import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const token = isPlatformBrowser(platformId) ? localStorage.getItem('token') : null;

  if(token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next(authReq); // Manda a request modificada
  }

  return next(req);
};
