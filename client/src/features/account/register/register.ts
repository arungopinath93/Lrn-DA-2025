import { Component, input, output,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds,User } from '../../../types/users';
import { AccountService } from '../../../core/service/account-service';
@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // memberFromHome = input.required<User[]>();
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  private accountService = inject(AccountService);
  register() {
    // Registration logic goes here
    // console.log('Registering with credentials:', this.creds);
    this.accountService.registerUser(this.creds).subscribe({
      next: (user) => {
        console.log('Registration successful:', user);
        this.cancelRegister.emit(false); // Emit false to indicate registration is complete
      },
      error: (error) => {
        console.error('Registration failed:', error);
        // Handle registration error here
      } 
    });
  }

  cancel() {
    // Logic to handle cancellation goes here
    console.log('Registration cancelled');
    this.cancelRegister.emit(false);
  }
}
