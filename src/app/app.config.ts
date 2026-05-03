import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

const ReliefoTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#faf5ee',
      100: '#f3e8d6',
      200: '#e8d0b0',
      300: '#dab880',
      400: '#cca264',
      500: '#C28E58',
      600: '#a87540',
      700: '#8a5e34',
      800: '#6e4b2b',
      900: '#563b22',
      950: '#2e1e10',
    },
    colorScheme: {
      light: {
        surface: {
          0:   '#ffffff',
          50:  '#F9F7F2',
          100: '#F9F7F2',
          200: '#E5DCD0',
          300: '#E5DCD0',
          400: '#d4c8b8',
          500: '#bfaf9c',
          600: '#a08e78',
          700: '#7a6b5a',
          800: '#4A433D',
          900: '#2e2925',
          950: '#1a1714',
        },
        primary: {
          color:         '#C28E58',
          contrastColor: '#ffffff',
          hoverColor:    '#a87540',
          activeColor:   '#8a5e34',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: ReliefoTheme,
        options: { darkModeSelector: false },
      },
      translation: {
        firstDayOfWeek: 1,
        dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        today: 'Heute',
        clear: 'Löschen',
      },
    }),
  ],
};

