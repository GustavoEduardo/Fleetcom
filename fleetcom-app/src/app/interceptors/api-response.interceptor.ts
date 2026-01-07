import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiResponse } from '../model/api-rersponse.model';

export const ApiResponseInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const body = event.body as ApiResponse<any>;

        if (body?.success && 'data' in body) {
          return event.clone({
            body: body.data,
          });
        }
      }

      return event;
    }),

    catchError((error: HttpErrorResponse) => {
      const apiError = error.error;

      if (apiError?.message) {
        return throwError(() => new Error(apiError.message));
      }

      return throwError(() => error);
    }),
  );
};
