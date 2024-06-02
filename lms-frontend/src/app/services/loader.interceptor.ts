import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, finalize, of, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from '../types/user.type';
import { StoreService } from './store.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private storeService:StoreService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.spinner.show();
    let authReq = request.clone({
      headers: new HttpHeaders({
        token: localStorage.getItem('user')
          ? (JSON.parse(localStorage.getItem('user')) as User).token
          : '',
      }),
    });
    if(this.storeService.role!=='student'){
      authReq=request;
    }
    return next.handle(authReq).pipe(
      finalize(() => this.spinner.hide()),
      catchError((error: any) => {
        this.toastr.error(error?.error?.message);
        return throwError(() => error);
      })
    );
  }
}
