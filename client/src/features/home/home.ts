import { Component, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // @Input({required:true}) membersFromApp: any[] = [];
  protected registerMode = signal(false);

  toggleRegisterMode(value:boolean) {
    // this.registerMode.set(!this.registerMode());
    this.registerMode.set(value);
  }
}
