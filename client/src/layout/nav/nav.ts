import { afterNextRender, Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/service/account-service';
import { ToastService } from '../../core/service/toast-service';
import { inject, Injectable } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { skip } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected accountService = inject(AccountService);
  protected router = inject(Router);
  protected toast = inject(ToastService);
  protected creds: any = {};
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
        console.log(this.creds);
        this.creds = {};
        this.toast.success('Login successful');
        this.router.navigateByUrl('/members', { skipLocationChange: true });
      },
      error: (error: any) => {
        console.error('Login failed', error)
        this.toast.error(error.error);
      }
    });

    // Implement login logic here
  }
  logout() {
    // this.isLoggedIn.set(false);
    console.log('User logged out');
    this.accountService.logout();
    this.router.navigateByUrl('/');
    // Implement logout logic here
  }
}
