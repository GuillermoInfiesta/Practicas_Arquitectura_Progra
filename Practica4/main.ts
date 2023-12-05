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
  .get("/worker/:id", getWorker) // Done (checkear mas adelante)
  .get("/business/:id", getBusiness) //Done (checkear mas adelante)
  .get("/task/:id", getTask) //Done (checkear mas adelante)
  .delete("/worker/:id", deleteWorker) //Checkeos y eliminar en dependencias
  .delete("/business/:id", deleteBusiness) //Checkeos y eliminar en dependencias
  .delete("/task/:id", deleteTask) //Checkeos y eliminar en dependencias
  .get("/worker", getAllWorkers) //Done (checkear mas adelante)
  .get("/business", getAllBusiness) //Done (checkear mas adelante)
  .get("/task", getAllTasks) //Done (checkear mas adelante)
  .post("/worker", postWorker) //Creo que done
  .post("/business", postBusiness) //Creo que done
  .post("/task", postTask) //Creo que done
  .put("/business/:id/fire/:workerId", fireWorker) //Creo que done
  .put("/business/:id/hire/:workerId", hireWorker) //Creo que done
  .put("/task/:id?status=x", changeStatus) //No funciona el endpoint ?¿?¿?
  /*
/worker/:id -> Devolverá el trabajador que corresponde al id
/business/:id -> Devolverá la empresa que corresponde al id
/task/id -> Devolverá la tarea que corresponde al id
/worker/:id -> Eliminará el trabajador que corresponde al id
/business/:id -> Eliminará la empresa que corresponde al id
/task/:id -> Eliminará la tarea que corresponde al id
/worker - > Deberá devolver todos los trabajadores
/business - > Deberá devolver todas las empresas
/task- > Deberá devolver todas las tareas
/worker - > Deberá crear un trabajador
/business - > Deberá crear una empresa
/task- > Deberá crear una tarea
/business/:id/fire/:workerId -> Deberá despedir de la empresa al trabajador que corresponde al id
/business/:id/hire/:workerId -> Deberá contratar de la empresa al trabajador que corresponde al id
/task/:id?status=x -> Cambiara el estado de una tarea

  */

miapp.listen(3000);