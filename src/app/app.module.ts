import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
// import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { LayoutComponent } from './navigation/layout/layout.component';

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

import { LoginService } from './service/login.service';
import { LocalStorageService } from './service/local-storage.service';
import { ProductService } from './service/product.service';
import { ContactService } from './service/contact.service';
import { AlertService } from './service/alert.service';

import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider,
  FacebookLoginProvider, LinkedInLoginProvider  } from 'angularx-social-login';


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('260588641171-3c0akgkm8j9ubqm6bn3vrqvqq5ou7re5.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('489434948455038')
  },
  // {
  //   id: LinkedInLoginProvider.PROVIDER_ID,
  //   provider: new LinkedInLoginProvider("78iqy5cu2e1fgr")
  // }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidenavListComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    LoginComponent,
    PasswordforgotComponent,
    PasswordresetcodeComponent,
    SignupComponent,
    ConfigComponent,
    ContactComponent,
    LeadComponent,
    ReportComponent,
    ProfileComponent,
    ProductComponent,
    ProductEditComponent,
    ContactEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [
    // UserService,
    ProductService,
    ContactService,
    // UploadFileService,
    // FcmService,
    LoginService,
    LocalStorageService,
    AlertService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
