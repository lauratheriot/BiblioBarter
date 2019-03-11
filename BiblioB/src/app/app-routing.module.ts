import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'Matches', loadChildren: './home/home.module#HomePageModule' },
  { path: 'Profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: 'greet', loadChildren: './greet/greet.module#GreetPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
