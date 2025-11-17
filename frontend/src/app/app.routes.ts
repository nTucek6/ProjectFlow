import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { authGuard } from './core/guard/auth-guard';
import { mainPageGuard } from './core/guard/main-page-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [mainPageGuard],
    children: [
      {
        path: '',
        title: 'Home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        title: 'Login',
        canActivate: [authGuard],
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
    ],
  },
];
