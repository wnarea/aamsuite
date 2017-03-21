import {Component} from "@angular/core";
import {IdentityCallback, UserRegistrationService} from "../../../service/aamsuite.service";
import {Router} from "@angular/router";
@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './resendCode.html'
})
export class ResendCodeComponent implements IdentityCallback {

    email: string;
    errorMessage: string;

    constructor(public registrationService: UserRegistrationService, public router: Router) {

    }

    resendCode() {
        this.registrationService.resendCode(this.email, this);
    }

    identityCallback(error: any, result: any) {
        if (error != null) {
            this.errorMessage = "Something went wrong...please try again";
        } else {
            this.router.navigate(['/home/confirmRegistration', this.email]);
        }
    }
}