import { Routes } from '@angular/router';
import { MoonComponent } from './planet/moon/moon.component';
import { MarsComponent } from './planet/mars/mars.component';

export const routes: Routes = [
  {
    path: 'moon',
    loadComponent: () => import('./planet/moon/moon.component').then((m) => m.MoonComponent),
  },
  {
    path: 'mars',
    loadComponent: () => import('./planet/mars/mars.component').then((m) => m.MarsComponent),
  },
  {
    path: '**',
    redirectTo: "moon",
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: "moon",
    pathMatch: 'full',
  },

];
