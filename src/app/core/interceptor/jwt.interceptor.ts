import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api/api.service';
import { StorageService } from "../services/storage/storage.service";
import { Router } from "@angular/router";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject( ApiService );
  const storage = inject( StorageService );
  const router = inject( Router );
  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // console.error('Unauthorized request:', req);
          if (req.url == '/api/auth/refresh'){
              storage.removeItem("token");
              storage.removeItem("refreshToken");
              router.navigate(['auth/login']);
              return throwError(() => err);
          }
          return apiService.refresh().pipe(
            switchMap((response: any) => {
              const newToken = response.token;
              storage.setItem('token', response.token);
              storage.setItem('refreshToken', response.refreshToken);
              const modifiedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(modifiedRequest);
            }),
            catchError((error) => {
              storage.removeItem("token");
              storage.removeItem("refreshToken");
              router.navigate(['auth/login']);
              return throwError(error);
            })
          );
        } else {
          console.error('HTTP error:', err);
        }
      } else {
        console.error('An error occurred:', err);
      }
      return throwError(() => err);
    })
  );;
};
