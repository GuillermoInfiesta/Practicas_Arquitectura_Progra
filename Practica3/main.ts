import express from "npm:express@4.18.2"
import mongoose from "npm:mongoose@7.6.3"
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { CrearCliente } from './resolvers/CrearCliente.ts';
import { BorrarCliente } from './resolvers/BorrarCliente.ts';
import { CrearGestor } from './resolvers/CrearGestor.ts';
import { AsignarGestor } from './resolvers/AsignarGestor.ts';
import { IngresarDinero } from './resolvers/IngresarDinero.ts';
import { EnviarDinero } from './resolvers/EnviarDinero.ts';
import { CrearHipoteca } from './resolvers/CrearHipoteca.ts';
import { AmortizarHipoteca } from './resolvers/AmortizarHipoteca.ts';
import { GetAllClientes } from "./resolvers/GetAllClientes.ts";
import { GetCliente } from "./resolvers/GetCliente.ts";
import { GetAllGestores } from './resolvers/GetAllGestores.ts';
import { GetGestor } from './resolvers/GetGestor.ts';
import { GetAllHipotecas } from './resolvers/GetAllHipotecas.ts';
import { GetMovimientos } from "./resolvers/GetMovimientos.ts";
import "./resolvers/IngresarXTiempo.ts" //Descomentar para que se activen
//import "./resolvers/AmortizarXTiempo.ts"




const env = await load();

try{
  await mongoose.connect(env.HOST_URL || Deno.env.get("HOST_URL") || "");
}catch(e){
  console.log(e.message);
}
console.log("Conexion establecida")

const miapp = express();

miapp.use(express.json());

miapp
  .post("/cliente", CrearCliente)
  .post("/hipoteca", CrearHipoteca)
  .post("/gestor", CrearGestor)
  .delete("/cliente/:id", BorrarCliente)
  .put("/cliente/:idSender/:idReceiver/:cantidadEnviada", EnviarDinero)
  .put("/cliente/:id/:cantidadIngresada", IngresarDinero)
  .put("/asignar/:idGestor/:idCliente", AsignarGestor)
  .put("/hipoteca/:idHipoteca", AmortizarHipoteca)
  .get("/cliente", GetAllClientes)
  .get("/cliente/:id", GetCliente)
  .get("/gestor", GetAllGestores)
  .get("/gestor/:id", GetGestor)
  .get("/hipoteca", GetAllHipotecas)
  .get("/movimientos/:idCliente", GetMovimientos)

miapp.listen(3000)

