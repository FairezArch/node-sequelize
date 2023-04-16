const http = require("http");
const app = require("./app");
const { port } = require('./config/app')
const setPort = port || 3001;
const server = http.createServer(app);
server.listen(setPort, () => console.log(`server running in port ${setPort}`));