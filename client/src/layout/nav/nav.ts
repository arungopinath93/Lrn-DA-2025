import { afterNextRender, Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/service/account-service';
import { ToastService } from '../../core/service/toast-service';
import { inject, Injectable } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { single, skip } from 'rxjs';
import { themes } from '../theme';

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
export class Nav implements OnInit {
  
  protected accountService = inject(AccountService);
  protected router = inject(Router);
  protected toast = inject(ToastService);
  protected creds: any = {};

  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLElement;
    if(elem) elem.blur();
  }
  
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
