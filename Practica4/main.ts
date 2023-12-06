import express from "npm:express@4.18.2"
import mongoose from "npm:mongoose@7.6.3"
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { getAllWorkers } from './resolvers/GetAllWorkers.ts';
import { getAllBusiness } from './resolvers/GetAllBusiness.ts';
import { getAllTasks } from './resolvers/GetAllTasks.ts';
import { getBusiness } from './resolvers/GetBusiness.ts';
import { getTask } from './resolvers/GetTask.ts';
import { getWorker } from './resolvers/GetWorker.ts';
import { postWorker } from './resolvers/PostWorker.ts';
import { postBusiness } from './resolvers/PostBusiness.ts';
import { postTask } from './resolvers/PosstTask.ts';
import { deleteWorker } from './resolvers/DeleteWorker.ts';
import { deleteBusiness } from './resolvers/DeleteBusiness.ts';
import { deleteTask } from './resolvers/DeleteTask.ts';
import { hireWorker } from './resolvers/HireWorker.ts';
import { fireWorker } from "./resolvers/FireWorker.ts";
import { changeStatus } from './resolvers/ChangeTaskStatus.ts';


const env = await load();

try{
  await mongoose.connect(env.MONGO_URL || Deno.env.get("MONGO_URL") || "");
  console.log(`Conexion exitosa`);
}catch(e){
  console.log(e.message);
}

const miapp = express();

miapp.use(express.json());

miapp
  .get("/worker/:id", getWorker)
  .get("/business/:id", getBusiness)
  .get("/task/:id", getTask)
  .delete("/worker/:id", deleteWorker)
  .delete("/business/:id", deleteBusiness) 
  .delete("/task/:id", deleteTask) 
  .get("/worker", getAllWorkers) 
  .get("/business", getAllBusiness) 
  .get("/task", getAllTasks) 
  .post("/worker", postWorker)
  .post("/business", postBusiness) 
  .post("/task", postTask)
  .put("/business/:id/fire/:workerId", fireWorker) 
  .put("/business/:id/hire/:workerId", hireWorker) 
  .put("/task/:id", changeStatus) 


miapp.listen(3000);