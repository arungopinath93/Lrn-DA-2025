import { HttpClient } from '@angular/common/http';  
import { inject, Injectable, signal } from '@angular/core';
import { single, tap } from 'rxjs';
import { RegisterCreds, User } from '../../types/users';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  baseUrl: string = 'https://localhost:5001/api/';

  registerUser(creds: RegisterCreds) {
    debugger;
    // return this.http.post(this.baseUrl + 'account/register', creds);
    return this.http.post<User>(this.baseUrl + 'Account/register', creds).pipe
    (
      tap(user => {
        if (user) {
          // localStorage.setItem('user', JSON.stringify(user));
          // this.currentUser.set(user);
          this.setCurrentUser(user);
        }
      })
    );
  }
  loginUser(creds: any) {
    // return this.http.post(this.baseUrl + 'account/login', creds);
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe
    (
      tap(user =>{
        if (user) {
          // localStorage.setItem('user', JSON.stringify(user));
          // this.currentUser.set(user);
          this.setCurrentUser(user);
        }
      })
    )
  }
  setCurrentUser(user: User) {
     localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
   
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

}
