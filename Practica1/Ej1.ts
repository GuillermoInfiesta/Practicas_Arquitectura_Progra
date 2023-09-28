const BubbleSort = (arr:number[]): number[] =>{
    //Solucion no optima temporal 
    let ordered:boolean = true; //Boleano que será true al salir del for una vez esté ordenado el array
    let numAux: number = 0;
    for(let i = 0; i<arr.length-1; i++){
        if(arr[i] > arr[i+1]){ //Si un numero es mayor que el siguiente hacemos un swap entre ellos
            numAux = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = numAux;
            console.log("a");
            ordered = false;
        }
    }
    !ordered && BubbleSort(arr); //Si no está ordenado seguimos usando BubbleSort, de manera recursiva
    return arr; //Devolvemos el array ordenado

    //Mirar para hacer la mas optima. Cambiar el for? menos variables?

}