import mongoose from "npm:mongoose@7.6.3"
import { BusinessModel } from "./Business.ts";
import { TaskModel } from "./Task.ts";
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
    dni: {type: String, required: true, 
        unique: true, //Mirar como añadir mensaje de error
        minLength: [9, `La longitud de un DNI debe ser exactamente de 9 caracteres(8 números y 1 letra)`], 
        maxLength: [9, `La longitud de un DNI debe ser exactamente de 9 caracteres(8 números y 1 letra)`], 
        lowercase: true},
    business: {type: mongoose.Types.ObjectId, required: false, ref: `Business`, default: null,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`],},
    tasks: [{type: mongoose.Types.ObjectId, required: false, ref: `Tasks`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]}]
})

WorkerSchema.path("dni").validate((dni: string) => {
    const dniNumbers = parseInt(dni.substring(0,8));
    const i = dniNumbers % 23;
    const letras = "trwagmyfpdcbnjzsqvhlcke";

    if(dni.at(8) !== letras.at(i)) throw new Error(`La letra del dni no coincide con los numeros del mismo`);
    return true;
})
WorkerSchema.path("business").validate( async(id) => {
    if(id === null) return true;
    const exists = await BusinessModel.findById(id).exec();
    if(!exists) throw new Error(`No existe ninguna empresa con id ${id}`)
    if(exists.workers.length === 10) throw new Error(`La empresa ya ha alcanzado su maximo numero de trabajadores`)
    return true;
})
WorkerSchema.path("tasks").validate( async(IDs: string[]) => {
    await Promise.all(IDs.map(async(id) => {
        const exists = await TaskModel.findById(id).exec();
        if(!exists) throw new Error(`No existe ninguna tarea con id ${id}`)
    }))
    return true
})

//En un post save meter a la empresa, una vez está creado
WorkerSchema.post("save", async function () {
    const business_id = this.business?.toString();
    const _id = this._id.toString();
    await BusinessModel.findOneAndUpdate({_id: business_id}, {$push: {workers: _id}}).exec();
})


WorkerSchema.pre('findOneAndDelete', async function(){
    const workerId = this.getQuery()["_id"];
    const worker = await WorkerModel.findById(workerId).exec();
    if(!worker) throw new Error(`No se encuentra el trabajador en la base de datos`);
    
    await BusinessModel.findOneAndUpdate({_id: worker?.business},{$pull : {workers: workerId}}).exec();
    console.log(`Trabajador eliminado de empresa`);

    await Promise.all(worker.tasks.map(async(id) => {
        await TaskModel.findByIdAndDelete().where("_id").equals(id).exec();
    }))
    console.log(`Tareas eliminadas`)
})

export type WorkerModelType = {
    dni: string, 
    business: mongoose.Types.ObjectId,
    tasks: mongoose.Types.ObjectId[],
    //_id?
}

export const WorkerModel = mongoose.model<WorkerModelType>(
    "Workers",
    WorkerSchema
)