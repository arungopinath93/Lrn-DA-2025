import { afterNextRender, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/service/account-service';
import { inject, Injectable } from '@angular/core';

@Component({
  selector: 'app-nav',
  imports: [
    FormsModule
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected accountService = inject(AccountService);
  protected creds : any = {};
  // protected isLoggedIn = signal(false);
  login() {
    this.accountService.loginUser(this.creds).subscribe({

      // next: (response:any) => {
      //   console.log('Login successful', response);
      // },
      // error: (error:any) => {
      //   console.error('Login failed', error);
      // }
      next: (response: any) => {
        console.log('Login successful', response);
        // this.isLoggedIn.set(true);
        this.creds = {};
      },
      error: (error: any) => console.error('Login failed', error)
    });
    console.log(this.creds);
    // Implement login logic here
  }
  logout() {
    // this.isLoggedIn.set(false);
    console.log('User logged out');
    this.accountService.logout();
    // Implement logout logic here
  }
}
