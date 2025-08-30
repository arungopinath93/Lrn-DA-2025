// import { Component, inject, OnInit, signal } from '@angular/core';
import { Component, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { lastValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
// import { AccountService } from '../core/service/account-service';
// import { Home } from "../features/home/home";
// import { User } from '../types/users';
import { RouterOutlet, Router } from '@angular/router';
// import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  // imports: [Nav, Home],
  // imports: [Nav, RouterOutlet,NgClass],
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
// export class App implements OnInit {
export class App{
  // private http = inject(HttpClient);
  protected router = inject(Router);
  // protected readonly title = 'Dating App';
  // protected members = signal<User[]>([]);
  // private accountService = inject(AccountService);
  // constructor(private http: HttpClient) {}
  // async ngOnInit() {
  //   // this.http.get('https://localhost:5001/api/Members').subscribe
  //   // ({
  //   //   next: (response) => {
  //   //     debugger;
  //   //     console.log(response);
  //   //     this.members.set(response);
  //   //   },
  //   //   error: (error) => {
  //   //     console.error('Error fetching members:', error);
  //   //   },
  //   //   complete: () => {
  //   //     console.log('Request completed');
  //   //   }
  //   // })
  //   this.members.set(await this.getMembers());
  //   this.setCurrentUser();
  // }

  // setCurrentUser() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const userData = JSON.parse(userString);
  //   this.accountService.currentUser.set(userData);
  // }

  // async getMembers() {
  //   try {
  //     // const response = await this.http.get('https://localhost:5001/api/Members').toPromise();
  //     // console.log(response);
  //     // this.members.set(response);
  //     return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/Members'));
  //   } catch (error) {
  //     console.error('Error fetching members:', error);
  //     throw error; // Re-throw the error to handle it in the calling context
  //   }
  // }
}
