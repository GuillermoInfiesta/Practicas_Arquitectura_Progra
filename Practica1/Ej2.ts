const SecurityValidator = (password: string):number => {
    const arr: string[] = password.split("");
    let safetyScore: number = 0;
    let hasLetter: boolean = false;
    let hasNumber: boolean = false;
    let hasSpecialChar: boolean = false;
    let numStreak: number = 0; 
    let hasNumStreak: boolean = false;
    if(arr.length > 20) //Si tiene mas de 20 caracteres sumamos 2 al safetyScore
        safetyScore = safetyScore +2;
    else if(arr.length < 10) //Si tiene menos de 10 caracteres restamos 1 al safetyScore
        safetyScore = safetyScore -1;

    arr.forEach((x:string)=>{
                //Comprobar si es una mayuscula              //Comprobar si es una minuscula
        if(x.charCodeAt(0)>64 && x.charCodeAt(0)<91 || x.charCodeAt(0)>96 && x.charCodeAt(0)<123){ //Comprobar si es una letra
            hasLetter = true;
            numStreak = 0;
        }else if(x.charCodeAt(0)>47 && x.charCodeAt(0)<58){ //Comprobar si es un numero
            hasNumber = true;
            numStreak = numStreak+1;
        }else{ //Si no es letra ni numero lo catalogamos como caracter especial
            hasSpecialChar = true;
            numStreak = 0;
        }

        if(numStreak === 3)
            hasNumStreak=true;
    }
    )

    if(hasLetter && hasNumber) //Si tiene un numero y una letra sumamos 1 al safetyScore
        safetyScore ++;
    if(hasSpecialChar) //Si tiene caracteres especiales sumamos 1 al safetyScore
        safetyScore ++;
    if(hasNumStreak) //Si tiene 3 numeros seguidos restamos 1 al safeScore
        safetyScore --; 
    
    return safetyScore;
}