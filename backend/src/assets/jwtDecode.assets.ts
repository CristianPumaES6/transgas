import * as jwtDecode from 'jwt-decode';


// AL ser una class lo tengo que poner en el constructor para que pueda ser utilizado.
export function JwtDecode(object: any): any {

    // lo desencripto
    return jwtDecode.default(object);
}
