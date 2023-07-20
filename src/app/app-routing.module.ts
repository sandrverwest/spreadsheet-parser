import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginLayoutComponent} from "./components/login-layout/login-layout.component";
import {canActivateAuth} from "./services/auth-states.service";
import {MainLayoutComponent} from "./components/main-layout/main-layout.component";
import {NotFoundLayoutComponent} from "./components/not-found-layout/not-found-layout.component";

const routes: Routes = [
  {path: '', component: MainLayoutComponent, canActivate: [canActivateAuth] },
  {path: 'auth', component: LoginLayoutComponent},
  {path: '404', component: NotFoundLayoutComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
