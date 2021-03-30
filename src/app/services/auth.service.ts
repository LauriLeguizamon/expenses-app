import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;
  loggedIn: boolean = false;

  httpOptions = {
    headers: new HttpHeaders({
      'Key-Inflection': 'camel',
    }),
  };

  constructor(private http: HttpClient) {}

  loginUser(user: User): Observable<User> {
    return this.http.post<User>(
      `${environment.apiUrl}/login`,
      {
        email: user.email,
        password: user.password,
      },
      this.httpOptions
    );
  }

  loginUserById(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${localStorage.getItem('userId')}`, this.httpOptions)
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(
      `${environment.apiUrl}/register`,
      {
        user: {
          email: user.email,
          password: user.password,
        },
      },
      this.httpOptions
    );
  }

  hasUser(): boolean {
    if (localStorage.getItem('userId') === null) {
      return false;
    }
    return true;
  }
}
