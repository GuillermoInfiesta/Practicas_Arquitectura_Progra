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

try{
await mongoose.connect("");
}catch(e){ 
  console.log(e);
}
console.log("Conexión establecida"); 
//await mongoose.connect("mongodb+srv://UserClasesArquitectura:UserClasesArquitectura@cluster0.jgt9boz.mongodb.net/Practica2");
 
const miapp = express();

miapp.use(express.json());

miapp
  .delete("/products/:id", deleteProduct) //Done
  .delete("/client/:id", deleteClient) //Done
  .get("/products", getAllProducts) //Done
  .get("/client", getAllClients) //Done
  .get("/invoice/:id", getInvoice) //Done (Modificar)
  .post("/products", postProduct) // Done
  .post("/client", postClient) //Done
  .post("/invoice", postInvoice); //Fallo al hacer checkeos

  //Añadir lo del deploy


miapp.listen(3001);
