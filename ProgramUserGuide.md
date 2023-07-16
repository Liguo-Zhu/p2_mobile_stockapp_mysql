# === part 1: config ===

(1) Enter file "client/constants/URLconfig.js" and client/.env.example
(2) Enter file "server/.env.example
(3) make sure client side and server side configurations have the same port (default: 3000), and set the keys

# === part 2: MySQL database config ===

### step 1: open MySQL Workbench, import "stocksDB.sql" (can be found in the root directory)

### step 2: and then refresh the schemas, you will find "users" table inside the "stocksDB" schema.

table "users": id(PK,NN,AI), email(NN,UQ), hash(NN), watchlist()

# === part 3: run the program ===

### step 1: download the code

### step 2: install dependencies

(1): Enter file "client" and execute `npm install`
(2): Enter file "server" and execute `npm install`

### step 3: run the program

(1): Enter file "client" and execute `npm start`, and then select the simulation platform
(2): Enter file "server" and execute `npm start`
