import "dotenv/config";
import express from "express";
import createConnection from "./socketSetup.js";
import { createServer } from "http";
import cors from "cors";

const port = process.env.PORT || `8081`;
const app = express();

app.use(cors({ origin: "*"}));

const server = createServer(app);
const io = createConnection(server);

server.listen(port);

server.on("listening", () =>
  console.log(`server is listening at port ${port}`)
);
server.on("error", () => console.log(`server is not listening`));
