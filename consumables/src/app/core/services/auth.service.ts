import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


/** Datos que enviamos al backend */
export interface LoginPayload {
  username: string;
  password: string;
}

/** Respuesta esperada del backend */
export interface LoginResponse {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** URL leída desde environment.ts para poder cambiar según dev/prod */
  private readonly api = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) {}

  /** Llama al backend, obtiene el JWT y lo guarda */
  login(body: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.api, body).pipe(
      tap(res => this.saveToken(res.token))   // side-effect: almacenar token
    );
  }

  /** Guarda el token de forma sencilla (localStorage) */
  private saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  /** Devuelve el token o null si no existe */
  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  /** Elimina el token ⇒ cierra la sesión */
  logout(): void {
    localStorage.removeItem('access_token');
  }

  /** Sencilla comprobación de sesión */
  isLoggedIn(): boolean {
    return !!this.token;
  }
}