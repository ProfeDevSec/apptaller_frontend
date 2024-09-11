import { Routes } from '@angular/router';
import { RecoverComponent } from './auth/recover/recover.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './core/layout/main/main.component';
import { authGuard } from './core/guard/auth/auth.guard';

export const routes: Routes = [
    { path: 'auth', children: [
        { path: 'login', component: LoginComponent },
        { path: 'recover', component: RecoverComponent },
        { path: '**', pathMatch: 'prefix', redirectTo: 'login' }
    ] },
    { path: '', children: [
        { path: 'dashboard', loadComponent: () => import('./inner/home2/home2.component').then(c => c.Home2Component) },
        { path: 'users', loadComponent: () => import('./inner/users/users.component').then(c => c.UsersComponent) },
        { path: 'users/:nid', loadComponent: () => import('./inner/users/users.component').then( c => c.UsersComponent ) },
        { path: 'user/add', loadComponent: () => import('./inner/users/create-user/create-user.component').then( c => c.CreateUserComponent ) },
        { path: 'user/:nid', loadComponent: () => import('./inner/users/edit-user/edit-user.component').then( c => c.EditUserComponent ) },
        { path: '**', pathMatch: 'prefix', redirectTo: 'dashboard' },

    ], component: MainComponent, canActivate: [ authGuard ] },
    { path: '**', redirectTo: '' },
];
