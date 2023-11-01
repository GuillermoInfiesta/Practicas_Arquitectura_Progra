import express from "npm:express@4.18.2"
import mongoose from "npm:mongoose@6.12.2"
import { deleteClient } from './resolvers/DeleteClient.ts';
import { deleteProduct } from './resolvers/DeleteProduct.ts';
import { postClient } from './resolvers/PostClient.ts';
import { postProduct } from './resolvers/PostProduct.ts';
import { getAllProducts } from './resolvers/GetAllProducts.ts';
import { getAllClients } from './resolvers/GetAllClient.ts';
import { postInvoice } from './resolvers/PostInvoice.ts';
import { getInvoice } from './resolvers/GetInvoice.ts';
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts";

const env = await load();

try{
  console.log(env.HOST_URL);
  await mongoose.connect(env.HOST_URL || Deno.env.get("HOST_URL") || "");
}catch(e){ 
  console.log(e.message);
  //Deno.exit(1);
}
console.log("Conexión establecida"); 
 
const miapp = express();

miapp.use(express.json());

miapp
  .delete("/products/:id", deleteProduct) 
  .delete("/client/:id", deleteClient)
  .get("/products", getAllProducts) 
  .get("/client", getAllClients) 
  .get("/invoice/:id", getInvoice)
  .post("/products", postProduct) 
  .post("/client", postClient) 
  .post("/invoice", postInvoice); 

try{
  console.log(env.PORT);
  miapp.listen(env.PORT);
}catch(e){
  console.log(e.message);
}

