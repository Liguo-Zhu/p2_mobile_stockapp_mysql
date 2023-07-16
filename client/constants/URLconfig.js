//===client side config
export const URL_LOGIN = "http://localhost:3000/users/login";
export const URL_SIGNUP = "http://localhost:3000/users/signup";
export const URL_UPDATE_WATCHLIST = "http://localhost:3000/api/updatewatchlist";
export const URL_GET_WATCHLIST = "http://localhost:3000/api/getwatchlist";

//note: client side and server side configurations must be consistent.

//===server side config
//===The following code comes form knexfile.js
// module.exports = {
//   client: "mysql2",
//   connection: {
//     host: "localhost",
//     database: "stocksDB",
//     user: "root",
//     password: "password123",
//   },
// };
