import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 1. Import 'withFetch' here
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 2. Add 'withFetch()' as the first argument here
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])) 
  ]
};