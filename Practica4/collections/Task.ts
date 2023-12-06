import mongoose from "npm:mongoose@7.6.3"
import { WorkerModel } from "./Worker.ts";
import { BusinessModel } from "./Business.ts";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    status: {type: String, 
        enum: {values: ["TO DO","In Progress","In Test","Closed"], 
        message: `El status que estas intentando asignar no existe`}, 
        required: true},
    worker: {type: mongoose.Types.ObjectId, 
        required: true, 
        ref: `Workers`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]},
    business: {type: mongoose.Types.ObjectId, 
        required: true, 
        ref: `Business`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]},
    descripcion: {type: String, 
        required: false, 
        default: ""}
}) 

TaskSchema.path("worker").validate( async(id) => {
    const exists = await WorkerModel.findById(id).exec();
    if(!exists) throw new Error(`No existe ningún cliente con id ${id}`)
    if(exists.tasks.length === 10) throw new Error(`El cliente ya ha alcanzado su límite de tareas (10)`)
    return true
})
TaskSchema.path("business").validate( async(id) => {
    const exists = await BusinessModel.findById(id).exec();
    if(!exists) throw new Error(`No existe ninguna empresa con id ${id}`)
    return true
})

TaskSchema.path("status").validate((status) => {
    if(status === "Closed") throw new Error(`No se puede crear una tarea con status ya en Closed`)
})

TaskSchema.pre("save", async function(next){
    const workerId = this.worker.toString();
    const businessId = this.business.toString();
    const worker = await WorkerModel.findById(workerId).exec();
    
    if(businessId !== worker?.business.toString()) throw new Error(`La empresa del trabajador no coincide con la indicada`); 
    next();
})

TaskSchema.post("save", async function(){
    const taskId = this._id.toString();
    const workerId = this.worker.toString();
    const businessId = this.business.toString();

    await WorkerModel.findOneAndUpdate({_id: workerId}, {$push: {tasks: taskId}}).exec(); //Añadirle la tarea al trabajador
    await BusinessModel.findOneAndUpdate({_id: businessId}, {$push: {tasks: taskId}}).exec(); //Añadirle la tarea a la empresa
    
})

TaskSchema.pre("findOneAndUpdate", async function (){
    const status:string = this.getUpdate()["status"]; //Guardar el status que queremos introducir
    if(!["TO DO","In Progress","In Test","Closed"].includes(status)) throw new Error(`El status no pertenece al grupo de valores validos para este campo`)
})
TaskSchema.post("findOneAndUpdate", async function (doc: TaskModelType) {
    const status:string = this.getUpdate()["$set"]["status"]; //Coger el status que hemos introducido
    if(status === "Closed"){ //Si se ha llegado a closed borrar la tarea
        await TaskModel.findOneAndDelete().where("_id").equals(doc._id).exec();
    }
    
})

TaskSchema.pre("findOneAndDelete", async function () {

    let task, taskId: string;
    if(this.getQuery()["_id"] !== undefined){ //En caso de que se llegue aqui filtrando por id
        taskId = this.getQuery()["_id"]; 
        task = await TaskModel.findById(taskId.toString()).exec();
    }else{ //En caso de que se llegue aqui filtrando por trabajador asociado a la tarea
        const workerId: string = this.getQuery()["worker"];
        task = await TaskModel.findOne().where("worker").equals(workerId.toString()).exec();
        taskId = task._id.toString();
    }
    if(!task) throw new Error(`No se encuentra la tarea en la base de datos`)

    await WorkerModel.findOneAndUpdate({_id: task.worker.toString()},{$pull: {tasks: taskId}}).exec(); //Eliminar la tarea en el trabajador
    await BusinessModel.findOneAndUpdate({_id: task.business.toString()},{$pull: {tasks: taskId}}).exec(); //Eliminar la tarea en la empresa
})

export type TaskModelType = {
    status: string,
    worker: mongoose.Types.ObjectId,
    business: mongoose.Types.ObjectId,
    descripcion: string,
    _id: mongoose.Types.ObjectId 
}

export const TaskModel = mongoose.model<TaskModelType>(
    "Tasks",
    TaskSchema
)