import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() {
    this.createToastContainer();
  }

  success(message: string, duration: number = 3000){
    this.createToastElement(message, 'alert-success', duration);
  }

  error(message: string, duration: number = 3000){
    this.createToastElement(message, 'alert-error', duration);
  }

  warning(message: string, duration: number = 3000){
    this.createToastElement(message, 'alert-warning', duration);
  }

  info(message: string, duration: number = 3000){
    this.createToastElement(message, 'alert-info', duration);
  }
  
  private createToastContainer(){
    if(!document.getElementById('toast-container')){
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }
  
  private createToastElement(message: string, alertClass: string, duration: number){

    const toastContainer = document.getElementById('toast-container');
    if(!toastContainer) return null;

    const toast = document.createElement('div');
    // toast.className = `alert ${alertClass} shadow-lg`;
    toast.classList.add('alert',alertClass,'shadow-lg');
    // toast.style.marginBottom = '0.5rem';
    // toast.innerHTML = `
    //   <span>${message}</span>
    //   <button class="ml-4 btn btn-sm btn-ghost" onclick="this.parentElement.remove()">
    // `;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="ml-4 btn btn-sm btn-ghost">x</button>
    `;
    toast.querySelector('button')?.addEventListener('click', () => {
      toastContainer.removeChild(toast);
    });
    toastContainer.append(toast);

    setTimeout(() => {
      if(toastContainer.contains(toast)){
        toastContainer.removeChild(toast);
      }
    }, duration);
    return toast;
  }
}
