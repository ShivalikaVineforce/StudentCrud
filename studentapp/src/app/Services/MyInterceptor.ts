import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Modify the request (e.g., add headers)
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: 'Bearer your-token-here',
      },
    });

    // Pass the modified request to the next handler
    return next.handle(clonedRequest);
  }
}
