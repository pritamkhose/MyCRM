import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login/login.component';
import { PasswordforgotComponent } from './login/passwordforgot/passwordforgot.component';
import { PasswordresetcodeComponent } from './login/passwordresetcode/passwordresetcode.component';
import { SignupComponent } from './login/signup/signup.component';

import { ConfigComponent } from './component/config/config.component';
import { ContactComponent } from './component/contact/contact.component';
import { ContactEditComponent } from './component/contact/contact-edit/contact-edit.component';
import { LeadComponent } from './component/lead/lead.component';
import { ReportComponent } from './component/report/report.component';
import { ProfileComponent } from './component/profile/profile.component';
import { ProductComponent } from './component/product/product.component';
import { ProductEditComponent } from './component/product/product-edit/product-edit.component';

import { DropboxComponent } from './dropbox/dropbox.component';

const routes: Routes = [
  { path: 'home', component: DashboardComponent },
  // { path: '**', redirectTo: '/home', pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'passwordforgot', component: PasswordforgotComponent },
  { path: 'passwordresetcode', component: PasswordresetcodeComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'contact', component: ContactComponent },
  { path: 'contact/:id', component: ContactEditComponent },
  { path: 'lead', component: LeadComponent },
  { path: 'product', component: ProductComponent },
  { path: 'product/:id', component: ProductEditComponent },
  { path: 'report', component: ReportComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'config', component: ConfigComponent },

  { path: 'documents', component: DropboxComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
