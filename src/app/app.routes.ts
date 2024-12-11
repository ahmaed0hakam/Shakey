import { Routes } from '@angular/router';
import { MoonComponent } from './planet/moon/moon.component';
import { MarsComponent } from './planet/mars/mars.component';

export const routes: Routes = [
  { path: 'moon', component: MoonComponent },
  { path: 'mars', component: MarsComponent },
  { path: '', redirectTo: 'moon', pathMatch: 'full' },
  { path: '**', redirectTo: 'moon' }
];
