const express = require("express");
const config = require("config");
const winston = require("winston");
const socketIo = require("socket.io");
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const port = process.env.PORT || config.get("port");

require("./startups/config")();
require("./startups/mongodb")();
require("./socket/index")(io);
require("./startups/prod")(app);
require("./startups/cors")(app);
require("./startups/routes")(app);
require("./startups/validation")();
require("./startups/errorLogs")();

server.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);










