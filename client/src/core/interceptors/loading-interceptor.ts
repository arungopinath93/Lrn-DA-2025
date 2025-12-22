import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { BusyService } from '../service/busy-service';
import { delay, every, finalize, of, tap } from 'rxjs';
import { inject } from '@angular/core';

const cache = new Map<string,HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if(req.method === 'GET'){
    const cachedResponse = cache.get(req.url);
    if(cachedResponse){
      return of(cachedResponse);
    }
  }

  return next(req).pipe(
    delay(500), // Ensure busy indicator shows even for fast requests
    tap(response =>{
      cache.set(req.url, response);
    }),
    finalize(() =>{
      busyService.idle();
    })
  );
};
