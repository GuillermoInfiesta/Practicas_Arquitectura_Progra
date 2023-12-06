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
    const duplicates = new Set(workers); //Uso set para comprobar duplicados porque set los elimina, asique si el set es mas pequeño significa que habia duplicados en el array
    if(duplicates.size !== workers.length) throw new Error(`Hay trabajadores duplicados en el array`);
    
    await Promise.all(workers.map( async (worker) => { //Comprobar que todos los trabajadores existan y esten sin contratar
        const exists = await WorkerModel.findById(worker).exec();
        if(!exists) throw new Error(`No existe el trabajador ${worker}`);
        if(exists.business !== null) throw new Error(`Este trabajador ya esta contratado por otra empresa`);
    }))
    return true;
})

BusinessSchema.post(`save`, async function() {
    const _id = this._id.toString(); 
    await Promise.all(this.workers.map( async(workerID) => { //Contratar (asignar esta empresa) a todos los trabajadores de la misma
        await WorkerModel.findOneAndUpdate({_id: workerID}, {business: _id}).exec();
    }));
})

BusinessSchema.pre(`findOneAndUpdate`,async function(){
    console.log(`empresa actualizando`)
    const update = this.getUpdate();
    if(!update) throw new Error(`Update is empty`);

    console.log(this.getQuery()["_id"])
    if(this.getQuery()["_id"] === undefined) return true;
    const business = await BusinessModel.findById(this.getQuery()["_id"]).exec();
    if(!business) throw new Error(`La empresa no existe`);

    if(update["$push"] !== undefined){ //Comprobar si el update es para hacer un push
        if(update["$push"]["workers"] !== undefined){ //Comprobar si es un push en workers
            if(business.workers.length === 10) throw new Error(`La empresa ya ha alcanzado su limite de empleados (10)`);
            if(business.workers.indexOf(update["$push"]["workers"]) >= 0) throw new Error(`Esta persona ya esta contratada por la empresa`);

            const worker = await WorkerModel.findById(update["$push"]["workers"]).exec();
            if(!worker) throw new Error(`El trabajador no existe`);
            if(worker?.business !== null) throw new Error(`Lo sentimos, este trabajador ya esta contratado por otra empresa`); 
        }
    }else if(update["$pull"] !== undefined){ //Comprobar si el update es un pull
        if(update["$pull"]["workers"] !== undefined){ //Comprobar si es un pull en workers
            if(business.workers.indexOf(update["$pull"]["workers"]) < 0) throw new Error (`Esta persona no trabaja en esta empresa`);
        }
    }
})

BusinessSchema.post(`findOneAndUpdate`, async function() {
    const update = this.getUpdate();
    if(!update) throw new Error(`Update is empty`);
    if(update["$push"] !== undefined){ //En caso de haber hecho push
        if(update["$push"]["workers"] !== undefined){ //En caso de haber hecho push en workers
            const workerId = update["$push"]["workers"];
            await WorkerModel.findOneAndUpdate({_id: workerId},{business: this.getQuery()["_id"]}).exec();
        }
    }else if(update["$pull"] !== undefined){//En caso de haber hecho pull
        if(update["$pull"]["workers"] !== undefined){ //En caso de haber hecho pull en workers
            const workerId = update["$pull"]["workers"];
            await WorkerModel.findOneAndUpdate({_id: workerId},{business: null}).exec();
            await TaskModel.findOneAndDelete().where("worker").equals(workerId).exec();
        }
    }
    console.log(`Empresa actualizada`)
})

BusinessSchema.pre("findOneAndDelete", async function (){
    const businessId = this.getQuery()["_id"];
    const business = await BusinessModel.findById(businessId).exec();

    if(!business) throw new Error(`La empresa no existe`);
    
    await Promise.all(business.tasks.map( async(id) => { //Eliminar todas las tareas asociadas a la empresa
        await TaskModel.findOneAndDelete().where("_id").equals(id).exec();
    }))   
    console.log(`Tareas Eliminadas`);
    await Promise.all(business.workers.map( async(id) => { //Indicarles a todos sus trabajadores que vuelven a no tener empresa
        await WorkerModel.findOneAndUpdate({_id: id},{business: null}).exec();
    }))
    console.log(`Trabajadores actualizados`);
})

export type BusinessModelType = {
    name: string,
    tasks: mongoose.Types.ObjectId[],
    workers: mongoose.Types.ObjectId[],
    _id: mongoose.Types.ObjectId
}

export const BusinessModel = mongoose.model<BusinessModelType>(
    "Business",
    BusinessSchema
)