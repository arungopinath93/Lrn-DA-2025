import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = signal(0);

  busy(): void {
    this.busyRequestCount.update(count => count + 1);
  }
  idle(): void {
    this.busyRequestCount.update(count => Math.max(0, count - 1));
  }
}
