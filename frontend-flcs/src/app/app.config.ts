import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importe withInterceptors et ton fichier créé juste au-dessus
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; 
import { authInterceptor } from './auth.interceptor'; // Vérifie bien le chemin

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    // On ajoute withInterceptors ici
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) 
    ) 
  ]
};