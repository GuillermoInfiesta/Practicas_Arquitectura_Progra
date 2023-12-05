import mongoose from "npm:mongoose@7.6.3"
import { TaskModel } from './Task.ts';
import { WorkerModel } from "./Worker.ts";

const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
    name: {type: String, 
        required: [true, `Por favor añade un nombre a la empresa`], 
        lowercase: true,
        unique: true},
    tasks: [{type: mongoose.Types.ObjectId, 
        required: true,  
        ref: `Tasks`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]}],
    workers: [{type: mongoose.Types.ObjectId, 
        required: true, 
        ref: `Workers`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]}]
})

BusinessSchema.path("tasks").validate( async(tasks: string[]) => {
    await Promise.all(tasks.map( async (task) => {
        const exists = await TaskModel.findById(task).exec();
        if(!exists) throw new Error(`No existe la tarea ${task}`);
    }))
    return true;
})

BusinessSchema.path("workers").validate( async(workers: string[]) => {
    if(workers.length > 10) throw new Error(`Las empresas no pueden tener mas de 10 trabajadores`);
    const duplicates = new Set(workers);
    if(duplicates.size !== workers.length) throw new Error(`Hay trabajadores duplicados en el array`);
    
    await Promise.all(workers.map( async (worker) => {
        const exists = await WorkerModel.findById(worker).exec();
        if(!exists) throw new Error(`No existe el trabajador ${worker}`);
        if(exists.business !== null) throw new Error(`Este trabajador ya esta contratado por otra empresa`);
    }))
    return true;
})

BusinessSchema.post(`save`, async function() {
    const _id = this._id.toString(); 
    await Promise.all(this.workers.map( async(workerID) => {
        await WorkerModel.findOneAndUpdate({_id: workerID}, {business: _id}).exec();
    }));
})

BusinessSchema.pre(`findOneAndUpdate`,async function(){
    const update = this.getUpdate();
    if(!update) throw new Error(`Update is empty`);

    const business = await BusinessModel.findById(this.getQuery()["_id"]).exec();
    if(!business) throw new Error(`La empresa no existe`);

    //Checkear si el push y pull son de ñadir empleado o añadir tarea
    if(update["$push"] !== undefined){
        if(update["$push"]["workers"] !== undefined){
            if(business.workers.length === 10) throw new Error(`La empresa ya ha alcanzado su limite de empleados (10)`);
            if(business.workers.indexOf(update["$push"]["workers"]) >= 0) throw new Error(`Esta persona ya esta contratada por la empresa`);

            const worker = await WorkerModel.findById(update["$push"]["workers"]).exec();
            if(!worker) throw new Error(`El trabajador no existe`);
            if(worker?.business !== null) throw new Error(`Lo sentimos, este trabajador ya esta contratado por otra empresa`);
        }
    }else if(update["$pull"] !== undefined){
        if(update["$pull"]["workers"] !== undefined){
            if(business.workers.indexOf(update["$pull"]["workers"]) < 0) throw new Error (`Esta persona no trabaja en esta empresa`);
        }
    }
})

BusinessSchema.post(`findOneAndUpdate`, async function() {
    const update = this.getUpdate();
    if(!update) throw new Error(`Update is empty`);
    if(update["$push"] !== undefined){
        if(update["$push"]["workers"] !== undefined){
            const workerId = update["$push"]["workers"];
            await WorkerModel.findOneAndUpdate({_id: workerId},{business: this.getQuery()["_id"]}).exec();
        }
    }else if(update["$pull"] !== undefined){
        if(update["$pull"]["workers"] !== undefined){
            const workerId = update["$pull"]["workers"];
            await WorkerModel.findOneAndUpdate({_id: workerId},{business: null}).exec();
        }
    }
})

BusinessSchema.pre("findOneAndDelete", async function (){
    const businessId = this.getQuery()["_id"];
    const business = await BusinessModel.findById(businessId).exec();

    if(!business) throw new Error(`La empresa no existe`);
    
    await Promise.all(business.tasks.map( async(id) => {
        await TaskModel.findOneAndDelete().where("_id").equals(id).exec();
    }))   
    console.log(`Tareas Eliminadas`);
    await Promise.all(business.workers.map( async(id) => {
        await WorkerModel.findOneAndUpdate({_id: id},{business: null}).exec();
    }))
    console.log(`Trabajadores actualizados`);
})

export type BusinessModelType = {
    name: string,
    tasks: mongoose.Types.ObjectId[],
    workers: mongoose.Types.ObjectId[],
    //_id?
}

export const BusinessModel = mongoose.model<BusinessModelType>(
    "Business",
    BusinessSchema
)