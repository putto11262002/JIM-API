import express from "express";
import config from "./config";
import http from "http";
import router from "./routes"
import { errorHandler } from "./middlewares/error-handler";
import staffService from "./services/staff-service";
import { StaffCreateInput, StaffRole } from "@jimmodel/shared";

import ConstraintViolationError from "./lib/errors/constraint-violation-error";
import cors from "cors"

// Runs when the server starts listening
function onServerListening() {
  console.log(`Server listening on port ${config.PORT}`);
}

async function beforeServerStart(...fns: (() => Promise<void>)[]){
  await Promise.all(fns.map(fn => fn()))
}

async function createRootUser(){
 try{
  const rootStaff: StaffCreateInput = {
    email: "root@example.com",
    password: "password",
    role: StaffRole.ROOT,
    username: "root",
    firstName: "Root",
    lastName: "User",
    color: "#000000"
  }
  await staffService.create(rootStaff)

 }catch(err){
  if (err instanceof ConstraintViolationError){
    console.log(err.message)
  }
 }
}

async function startServer() {
  const app = express();

  app.use(cors({origin: config.ALLOWED_ORIGINS}))

  app.use(express.json())

  app.use(express.urlencoded({ extended: true }))

  app.use(config.SERVE_STATIC_PATH, express.static(config.FILE_STORAGE_PATH))

  app.use("/api", router)

  app.use(errorHandler)
  
  beforeServerStart(createRootUser)

  const server = http.createServer(app);

  server.listen(config.PORT, onServerListening);
}

export default startServer;
