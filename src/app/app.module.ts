import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleSigninButtonModule,
  GoogleInitOptions
} from '@abacritt/angularx-social-login';
import {  GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserBarComponent } from './components/user-bar/user-bar.component';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { ParserComponent } from './components/parser/parser.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from './components/loader/loader.component';
import { NotFoundLayoutComponent } from './components/not-found-layout/not-found-layout.component';
import {environment} from "../environment/environment";

const googleLoginOptions: GoogleInitOptions = {
  oneTapEnabled: true,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets.readonly'
  ]
}

@NgModule({
  declarations: [
    AppComponent,
    UserBarComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    ParserComponent,
    LoaderComponent,
    NotFoundLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId,
              googleLoginOptions
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
