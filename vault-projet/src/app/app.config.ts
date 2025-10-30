// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const API_URL = 'http://localhost:8080/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true })
    
  ]
};
