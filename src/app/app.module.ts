import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {routing} from "./app.routes";
import {HomeComponent, AboutComponent, HomeLandingComponent} from "./public/home.component";
import {UseractivityComponent} from "./secure/useractivity/useractivity.component";
import {MyProfileComponent} from "./secure/profile/myprofile.component";
import {SecureHomeComponent} from "./secure/landing/securehome.component";
import {JwtComponent} from "./secure/jwttokens/jwt.component";
import {Ng2AutoCompleteModule} from "ng2-auto-complete";
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {LoginComponent} from "./public/auth/login/login.component";
import {RegisterComponent} from "./public/auth/register/registration.component";
import {ForgotPasswordStep1Component, ForgotPassword2Component} from "./public/auth/forgot/forgotPassword.component";
import {LogoutComponent, RegistrationConfirmationComponent} from "./public/auth/confirm/confirmRegistration.component";
import {ResendCodeComponent} from "./public/auth/resend/resendCode.component";
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {S3HomeComponent} from './secure/storage/s3home.component';
import {S3Component} from "./secure/storage/s3.component";
import {FileSizePipe} from "./shared/filesize.pipe"
import {UserLoginService, StorageService} from "./service/aamsuite.service";

@NgModule({
    declarations: [
        LoginComponent,
        LogoutComponent,
        RegistrationConfirmationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPassword2Component,
        RegisterComponent,
        AboutComponent,
        HomeLandingComponent,
        HomeComponent,
        UseractivityComponent,
        MyProfileComponent,
        SecureHomeComponent,
        JwtComponent,
        AppComponent,
        S3HomeComponent,
        S3Component,
        FileSizePipe
    ],
    imports: [
        Ng2AutoCompleteModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        Ng2Bs3ModalModule,
        SlimLoadingBarModule.forRoot()
    ],
    providers: [
        UserLoginService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
