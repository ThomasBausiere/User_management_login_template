import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { InfoCompteComponent } from './components/infoCompte/infoCompte.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
{
    path:'home', component:HomeComponent,
    canActivate:[authGuard]
},
{
    path:'login',component:LoginComponent
},
{
    path:'signin',component:SigninComponent
},
{
    path:'update',component:InfoCompteComponent,canActivate:[authGuard]
},
{
    path:'**', component:HomeComponent,canActivate:[authGuard]
}
];
