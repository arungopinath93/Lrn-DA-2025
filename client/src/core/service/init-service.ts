import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService = inject(AccountService);
  // Init() : Observable<null> make a fn type specific 
  Init() {  
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);
    const userData = JSON.parse(userString);
    this.accountService.currentUser.set(userData);

    return of(null);

  }
}
