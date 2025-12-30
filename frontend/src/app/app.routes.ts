import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { authGuard } from './core/guard/auth-guard';
import { mainPageGuard } from './core/guard/main-page-guard';
import { VerifyLayout } from './core/layouts/verify-layout/verify-layout';
import { authMentorRegisterGuard } from './core/guard/mentor-token-guard';

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
      {
        path: 'projects',
        title: 'Projects',
        loadComponent: () => import('./features/projects/projects').then((m) => m.Projects),
      },
      {
        path: 'project/:id',
        title: 'Project',
        loadComponent: () => import('./features/project/project').then((m) => m.Project),
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            title: 'Overview',
            loadComponent: () =>
              import('./features/project/overview/overview').then((m) => m.Overview),
          },
          {
            path: 'board',
            title: 'Board',
            loadComponent: () => import('./features/project/board/board').then((m) => m.Board),
          },
        ],
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
      {
        path: 'register',
        title: 'Register',
        canActivate: [authGuard],
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'register/:token',
        title: 'Register',
        canActivate: [authGuard, authMentorRegisterGuard],
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: '',
    component: VerifyLayout,
    children: [
      {
        path: 'register-success',
        title: 'Register Success',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/auth/register-success/register-success').then(
            (m) => m.RegisterSuccess
          ),
      },
      {
        path: 'verify/:token',
        title: 'Verify',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/auth/verify-user/verify-user').then((m) => m.VerifyUser),
      },
    ],
  },
];
