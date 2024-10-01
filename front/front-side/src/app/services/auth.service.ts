import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/api/users/login'; // Ajuste ton URL ici
  private isBrowser: boolean;

  constructor(private http: HttpClient) {
    // Vérifier si on est dans le contexte du navigateur
    this.isBrowser = typeof window !== 'undefined';
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password }).pipe(
      tap((response: any) => {
        console.log('réponse du server:', response);
        
        if (response && response.token) {
          if (this.isBrowser) {
            // Sauvegarder le token dans localStorage uniquement si l'on est côté client
            localStorage.setItem('authToken', response.token);
          }
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion', error);
        return of(false); // Gérer les erreurs en renvoyant false
      })
    );
  }

  getToken(): string | null {
    // Retourne le token uniquement si localStorage est disponible
    if (this.isBrowser) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
    }
  }
}
