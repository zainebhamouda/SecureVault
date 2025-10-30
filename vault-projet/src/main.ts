import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),        // rend HttpClient disponible pour les services
    provideRouter(routes),      // configure le routeur
    ...appConfig.providers      // ajoute tes providers custom
  ]
})
.catch(err => console.error('Erreur de bootstrap :', err));
