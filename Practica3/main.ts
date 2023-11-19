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
//import "./resolvers/IngresarXTiempo.ts"
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

//Optimizar los metodos
miapp
  .post("/cliente", CrearCliente) //Done por ahora
  .post("/hipoteca", CrearHipoteca) //Done por ahora
  .post("/gestor", CrearGestor) //Done por ahora
  .delete("/cliente/:id", BorrarCliente) //Done por ahora
  .put("/cliente/:idSender/:idReceiver/:cantidadEnviada", EnviarDinero) //Done por ahora
  .put("/cliente/:id/:cantidadIngresada", IngresarDinero) //Done por ahora
  .put("/asignar/:idGestor/:idCliente", AsignarGestor) //Done por ahora
  .put("/hipoteca/:idHipoteca", AmortizarHipoteca) //Done por ahora


miapp.listen(3000)

