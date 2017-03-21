import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {IdentityCallback, UserLoginService} from "../../../service/aamsuite.service";

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './forgotPassword.html'
})
export class ForgotPasswordStep1Component implements IdentityCallback {
    email: string;
    errorMessage: string;

    constructor(public router: Router,
                public userService: UserLoginService) {
        this.errorMessage = null;
    }

    onNext() {
        this.errorMessage = null;
        this.userService.forgotPassword(this.email, this);
    }

    identityCallback(message: string, result: any) {
        if (message == null && result == null) { //error
            this.router.navigate(['/home/forgotPassword', this.email]);
        } else { //success
            this.errorMessage = message;
        }
    }
}


@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './forgotPasswordStep2.html'
})
export class ForgotPassword2Component implements IdentityCallback, OnInit, OnDestroy {

    verificationCode: string;
    email: string;
    password: string;
    errorMessage: string;
    private sub: any;

    constructor(public router: Router, public route: ActivatedRoute,
                public userService: UserLoginService) {
        console.log("email from the url: " + this.email);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['email'];

        });
        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onNext() {
        this.errorMessage = null;
        this.userService.confirmNewPassword(this.email, this.verificationCode, this.password, this);
    }

    identityCallback(message: string) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
        } else { //success
            this.router.navigate(['/home/login']);
        }
    }

}