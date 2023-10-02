export const TimeConverter = (time: string): string =>{

    const minutos: string = time.substring(time.indexOf(":")+1, time.indexOf(":")+3); //Coger los minutos 

    let hora: number = + time.substring(0, time.indexOf(":")); //Coger la hora

    if(time.indexOf("am") != -1){ //Si es am, devolvemos como está
        if(hora < 10) //En caso de que la hora sea <10 le añadimos un 0 delante para que se muestre como 08 en vez de 8 por ejemplo
            return "0" + hora + minutos;
        else
            return hora + minutos;
    }else{ //Si es pm le sumamos 12 a la hora y devolvemos
        hora = hora+12;
        return ""+hora+minutos;
    }
    //Buscar solucion mas optima, hay seguro pq lo tengo hecho muy a la guarra
}