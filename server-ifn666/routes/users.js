require("dotenv").config();
var express = require("express");
var router = express.Router();

const bcrybt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* GET users listing. */

//login function
router.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  //step 1: verify request body(email and password) whether they are valid
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed!",
    });
    return;
  }

  // step 2: if step 1 is ok, then find the user whether inside the database
  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  //step 3: check the search result
  //3.1 user not found, return a message.
  if (queryUsers.length === 0) {
    res.json({
      error: true,
      message: "Users doest not exist",
    });
    return;
  }

  // 3.2 user found
  //3.2.1 get the user information
  const user = queryUsers[0];
  //3.2.2 check the user's password via bcrybt method
  const match = await bcrybt.compare(password, user.hash);

  //3.2.3 password is incorrect, return an error
  if (!match) {
    res.json({
      error: true,
      message: "Password doest not match",
    });
    return;
  }

  //3.2.3 password is correct, return the user info
  //create and return JWT token
  const expires_in = 60 * 60 * 24; // 1day： set the token to be valid for one day
  const exp = Date.now() + expires_in * 1000;
  const token = jwt.sign({ email, exp }, process.env.JWT_SECRET_KEY);
  res.json({
    error: false,
    user: email,
    token_type: "Bearer",
    token,
    expires_in,
  });
});

// add a user to the database
router.post("/signup", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  //step 1: check input user info
  //no email or password, then return a message
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed!",
    });
    return;
  }

  //step 2: if step 1 has the valid email and password, adn then check if user exists
  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  //step 3: if found the user, then return the message
  if (queryUsers.length > 0) {
    res.json({
      error: true,
      message: "Users already exist",
    });
    return;
  }

  //step 4: if step 3 not found, then create a hash code for the user and store the hash code password inside the database
  const saltRounds = 10;
  const hash = bcrybt.hashSync(password, saltRounds); //hashing

  //step 5: finally, insert a user to the database
  await req.db.from("users").insert({ email, hash });
  res.status(201).json({ error: false, message: "Successfully inserted user" });
});

module.exports = router;
