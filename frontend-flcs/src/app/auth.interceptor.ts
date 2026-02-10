import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      Authorization: 'Basic ' + btoa('admin:admin123'),
      'Content-Type': 'application/json'
    }
  });
  return next(authReq);
};