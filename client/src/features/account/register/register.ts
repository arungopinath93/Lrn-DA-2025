import { Component, input, output, inject, OnInit, Signal, signal } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/users';
import { AccountService } from '../../../core/service/account-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // memberFromHome = input.required<User[]>();
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  // protected registerForm: FormGroup = new FormGroup({});
  protected registerForm: FormGroup;
  protected profileForm:FormGroup;
  protected currentStep = signal(1);
  private router = inject(Router);
  protected validationErrors = signal<string[]>([]);

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchvalues('password')]]
    });
    this.profileForm = this.fb.group({
      gender: ['male', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }
  // ngOnInit(): void {
  //   this.initializeForm();
  // }
  // initializeForm() {
  //   this.registerForm = new FormGroup({
  //     email: new FormControl('',[Validators.required,Validators.email]),
  //     displayName: new FormControl('',[Validators.required]),
  //     password: new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
  //     confirmPassword: new FormControl('',[Validators.required,this.matchvalues('password')])
  //   });
  //   this.registerForm.controls['password'].valueChanges.subscribe({
  //     next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
  //   });
  // }
  matchvalues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    }
  }

  nextStep() {
    if (this.registerForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }

  prevStep(){
    this.currentStep.update(prevStep => prevStep - 1);
  }

  getMaxDate(){
    const today = new Date();
    today.setFullYear(today.getFullYear() -18);
    return today.toISOString().split('T')[0];
  }

  register() {
    debugger;
    if (this.registerForm.valid && this.profileForm.valid) {
      const formData = {...this.registerForm.value, ...this.profileForm.value};
      console.log('Form Data Invalid:', formData);
      this.accountService.registerUser(formData).subscribe({
        next: ()=>{
          this.router.navigateByUrl('/members');
        },
        error: (error)=>{
          console.error('Registration failed:', error);
          this.validationErrors.set(error);
        }
      })
    }
    // Registration logic goes here
    // console.log('Registering with credentials:', this.creds);
    // this.accountService.registerUser(this.creds).subscribe({
    //   next: (user) => {
    //     console.log('Registration successful:', user);
    //     this.cancelRegister.emit(false); // Emit false to indicate registration is complete
    //   },
    //   error: (error) => {
    //     console.error('Registration failed:', error);
    //     // Handle registration error here
    //   } 
    // });
    console.log('Form Status : ', this.registerForm.status);
  }

  cancel() {
    // Logic to handle cancellation goes here
    console.log('Registration cancelled');
    this.cancelRegister.emit(false);
  }
}
