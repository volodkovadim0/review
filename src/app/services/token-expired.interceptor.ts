import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, filter, Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../auth/auth.component';
import { jwtKey, userKey } from '../auth/jwtKey';
import { getJwt, logOut } from "./log-out.utils";

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly httpClient: HttpClient,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requestCopy = this.appendToken(request);

    return next.handle(requestCopy).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        logOut();

        return this.dialog.open(AuthComponent).afterClosed().pipe(
          filter(Boolean),
          switchMap(() => this.httpClient.request(requestCopy)),
        );
      }

      throw error;
    }));
  }

  private appendToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = getJwt();
    return token ?
      request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      : request;
  }
}
