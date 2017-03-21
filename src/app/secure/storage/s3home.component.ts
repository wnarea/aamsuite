/**
 * Created by wilson.narea on 12/5/2016.
 */
import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {UserResource} from "../../shared/userResource";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {StorageService, StorageCallback} from "../../service/aamsuite.service";

@Component({
    selector: 's3-home',
    templateUrl: './s3home.component.html'
})
export class S3HomeComponent {

    items: Array<UserResource> = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private storageService: StorageService,
                private slimLoadingBarService: SlimLoadingBarService) {
        console.log("in S3HomeComponent");
    }


}