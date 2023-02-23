import * as math from 'mathjs';
//import * as math from './decimal.js';


// AL ser una class lo tengo que poner en el constructor para que pueda ser utilizado.
export function mathRound(total: number, nDecimal: number): any {

    // lo desencripto
    return math.round(total, nDecimal)
}