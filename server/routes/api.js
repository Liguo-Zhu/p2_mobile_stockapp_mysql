require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//JWT: use JWT to check the token, and check the user whether has the authorization
const authorize = (req, res, next) => {
  const token = req.body.token; //need to change to the header token

  try {
    // decode the JWT know what is email of the user
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // date checker
    if (decode.exp < Date.now()) {
      res.status(410).send({ error: true, message: "expired token" });
    }
    next();
  } catch (error) {
    res.status(400).send({ error: true, message: "invalid token" });
  }
};

// this part if for test
router.get("/", authorize, function (req, res, next) {
  res.status(200).send({ error: false, message: "Success" });
});

//update the watchlist in database by JWT
router.post("/updatewatchlist", authorize, async function (req, res, next) {
  const email = req.body.email;
  const watchlist = req.body.watchlist;

  //find the user's watchlist by email for testing
  const user_watchlist = await req.db
    .from("users")
    .select("watchlist")
    .where("email", "=", email);

  // update the watchlist via user email information
  try {
    await req.db.from("users").update({ watchlist }).where("email", "=", email);
    res.status(201).json({
      error: false,
      message: `Successfully update user's(${email}) watchlist. `,
    });
  } catch (error) {
    console.log(error);
  }
});

//get watchlist from database by JWT
router.post("/getwatchlist", authorize, async function (req, res, next) {
  const email = req.body.email;
  //find watchlist by user email
  try {
    let user_watchlist = await req.db
      .from("users")
      .select("watchlist")
      .where("email", "=", email);

    // find then return the information
    res.status(201).json({
      error: false,
      message: `Success get user's(${email}) watchlist.`,
      watchlist: user_watchlist,
    });
  } catch (error) {
    //not found return a error
    res
      .status(500)
      .json({ error: true, message: "Internal Server Error in MySQL." });
  }
});

module.exports = router;
