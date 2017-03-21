import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {UserLoginService, LoggedInCallback} from "../../service/aamsuite.service";


export class Stuff {
    public type: string;
    public date: string;
}

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './useractivity.html'
})
export class UseractivityComponent implements LoggedInCallback {

    public logdata: Array<Stuff> = [];

    constructor(public router: Router, public userService: UserLoginService) {
        this.userService.isAuthenticated(this);
        console.log("in UseractivityComponent");
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            console.log("scanning DDB");
        }
    }

}
