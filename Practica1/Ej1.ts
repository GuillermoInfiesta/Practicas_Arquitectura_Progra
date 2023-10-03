export const BubbleSort = (arr:number[]): number[] =>{
    let ordered:boolean = true; //Boleano que será true al salir del for una vez esté ordenado el array
    let numAux: number = 0;
    for(let i = 0; i<arr.length-1; i++){
        if(arr[i] > arr[i+1]){ //Si un numero es mayor que el siguiente hacemos un swap entre ellos
            numAux = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = numAux;
            ordered = false;
        }
    }
    !ordered && BubbleSort(arr); //Si no está ordenado seguimos usando BubbleSort, de manera recursiva
    return arr; //Devolvemos el array ordenado
}