import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

//ngxtranslate setup
import { provideTranslateService, provideTranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthExpiredInterceptor } from './core/interceptors/auth-expired.interceptor';
import { AuthService } from './shared/services/auth.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MY_DATE_FORMATS } from './shared/formats/date-formats';

import { provideNgToast } from 'ng-angular-popup';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: 'i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      console.log('User Initializer');
      return auth.initializeAuth();
    }),
    provideNativeDateAdapter(MY_DATE_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
   // provideZonelessChangeDetection(),
    provideNgToast({
      duration: 3000,              // 3 seconds
      position: 'toaster-top-right', // Default position
      maxToasts: 3,                // Max 3 toasts at once
      width: 400,                  // Toast width in pixels
      showProgress: true,          // Show progress bar
      dismissible: true,           // Allow manual dismiss
      showIcon: true,              // Show icons
      enableAnimations: true       // Enable animations
    }),
  ],
};
