import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        title: 'Home',
        loadComponent: () =>
          import('./features/home/home').then((m) => m.Home),
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
        loadComponent: () =>
          import('./features/auth/login/login').then(
            (m) => m.Login
          ),
      },
    ],
  },
];
