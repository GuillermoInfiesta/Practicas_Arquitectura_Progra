import mongoose from "npm:mongoose@7.6.3"

const Schema = mongoose.Schema;

const GestorSchema = new Schema ({
    nombre: {type: String, required: true},
    dni: {type: String, required: true},
    //idClientes: {type: Array<string>, required: false, default: []},
    numeroClientes: {type: Number, required: false, default: 0}
});

//Validaremos el dni antes de añadir a la base de datos, en caso de que un valor no sea valído saltará un error y se detendrá la creación

GestorSchema.path("dni").validate(async (dni) => {
    const exists = await GestorModel.findOne().where("dni").equals(dni).exec();
    if(exists) throw new Error(`Ya existe un gestor con el id ${dni}`);
    return true;
})
export type GestorModelType = {
    nombre: string,
    dni: string,
    //idClientes: string[], Implementar que se pueda inicializar con clientes
    numeroClientes: number,
    _id: mongoose.Types.ObjectId;
}

export const GestorModel = mongoose.model<GestorModelType>(
    "Gestores",
    GestorSchema
)