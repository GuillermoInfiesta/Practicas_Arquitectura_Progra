
export const checkIdLength = (id: string): void => {

    if(id.length != 24){
        throw new Error(`La longitud del ID ${id} es incorrecta`);
    }
}