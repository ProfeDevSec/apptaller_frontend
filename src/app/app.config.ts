import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { jwtInterceptor } from './core/interceptor/jwt.interceptor'

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
  ]
};
