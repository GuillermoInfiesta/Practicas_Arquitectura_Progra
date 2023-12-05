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

TaskSchema.pre("save", async function(next){
    const workerId = this.worker.toString();
    const businessId = this.business.toString();
    const worker = await WorkerModel.findById(workerId).exec();
    if(businessId !== worker?.business.toString()) throw new Error(`La empresa del trabajador no coincide con la indicada`);
    next();
})

TaskSchema.post("save", async function(){
    //Añadir la tarea al trabajador y a la empresa
    const taskId = this._id.toString();
    const workerId = this.worker.toString();
    const businessId = this.business.toString();

    await WorkerModel.findOneAndUpdate({_id: workerId}, {$push: {tasks: taskId}}).exec();
    await BusinessModel.findOneAndUpdate({_id: businessId}, {$push: {tasks: taskId}}).exec();
    
})

TaskSchema.pre("findOneAndDelete", async function () {
    //Ver forma de acceder ya desde aqui a los parámetros
    const taskId: string = this.getQuery()["_id"]; 
    const task = await TaskModel.findById(taskId.toString()).exec();
    if(!task) throw new Error(`No se encuentra la tarea en la base de datos`)

    await WorkerModel.findOneAndUpdate({_id: task?.worker},{$pull: {tasks: taskId}});
    await BusinessModel.findOneAndUpdate({_id: task?.business},{$pull: {tasks: taskId}});
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