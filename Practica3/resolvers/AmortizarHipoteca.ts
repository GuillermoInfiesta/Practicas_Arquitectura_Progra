import {Request, Response} from "npm:express@4.18.2"
import { HipotecaModel } from '../collections/Hipoteca.ts';
import { ClienteModel } from '../collections/Cliente.ts';

export const AmortizarHipoteca = async (req: Request, res: Response) => {
    const idHipoteca = req.params.idHipoteca;

    const hipoteca = await HipotecaModel.findOne().where("_id").equals(idHipoteca);

    if(!hipoteca){
        res.status(404).send("No existe esa hipoteca en la base de datos");
        return;
    }

    const cliente = await ClienteModel.findOne().where("_id").equals(hipoteca.idCliente).exec();

    //Aunque sale rojo el cliente va a existir siempre, ya que no se puede crear una hipoteca sin cliente, y no se puede eliminar un cliente si aun
    //tiene hipotecas
    if(cliente.dineroCuenta < hipoteca.pagoCuota){
        res.status(400).send(`El cliente ${hipoteca.idCliente} no ha podido pagar su cuota mensual de la hipoteca ${idHipoteca} por falta de dinero`);
        return;
    }

    const newCuotas = hipoteca.cuotas - 1;

    const newDineroCuentaCliente = cliente.dineroCuenta - hipoteca.pagoCuota;
    await ClienteModel.findOneAndUpdate({_id: hipoteca.idCliente},{dineroCuenta: newDineroCuentaCliente});

    if(newCuotas === 0){
        await HipotecaModel.findOneAndDelete().where("_id").equals(idHipoteca).exec();
        res.status(200).send(`Enhorabuena, se ha completado el pago de la hipoteca ${idHipoteca}`);
        return;
    }

    const newTotal = hipoteca.total - hipoteca.pagoCuota;
    await HipotecaModel.findOneAndUpdate({_id: idHipoteca},{total: newTotal, cuotas: newCuotas});

    res.status(200).send(`Se ha realizado el pago correctamente, a la hipoteca ${idHipoteca} le quedan ${newCuotas} pagos de ${hipoteca.pagoCuota}$`)
}