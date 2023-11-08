import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './Pages/landing/landing.component';
import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './Pages/users-list/users-list.component';
import { UsersDetailsComponent } from './Pages/users-details/users-details.component';
import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { PagenotfoundComponent } from './Pages/pagenotfound/pagenotfound.component';
const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users-list',
    component: UsersListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/:userIndex',
    component: UsersDetailsComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/users-list', pathMatch: 'full' },

  { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
