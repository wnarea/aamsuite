import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LoggedInCallback, UserLoginService, StorageCallback, StorageService} from "../../service/aamsuite.service";
import {UserResource} from "../../shared/userResource";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {BucketItem} from "../../shared/bucketItem";

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './secureHome.html'
    // styleUrls: ['/assets/css/sb-admin.css']
})
export class SecureHomeComponent implements OnInit, LoggedInCallback, StorageCallback {
    items: Array<UserResource> = [];
    public isRequesting: boolean;

    constructor(public router: Router,
                public userService: UserLoginService,
                public storageService: StorageService,
                private slimLoadingBarService: SlimLoadingBarService) {
        this.userService.isAuthenticated(this);
        console.log("SecureHomeComponent: constructor");
    }

    ngOnInit() {
        this.slimLoadingBarService.start();
        this.storageService.listResources(this.userService.getCurrentUserId(), this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {

        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.isRequesting = true;
            this.slimLoadingBarService.start();
            this.storageService.listResources(this.userService.getCurrentUserId(), this);
        }
    }

    storageCallback(message: string, result: any){

    }

    resourcesCallback(data: Array<UserResource>) {
        console.log('resourcesCallback', data);
        this.items = data;
        this.isRequesting = false;
        this.slimLoadingBarService.complete();
    }

    resourcesFailCallback(error) {
        this.isRequesting = false;
    }

    listStorageCallback(){

    }

    resourceCreatedCallback(data: BucketItem) {

    }

    downloadedCallback(item: BucketItem, dataFile: any) {

    }

    ddbQueryFail() {
        this.isRequesting = false;
    }
    ddbQueryDone(data: Array<UserResource>) {
        console.log('ddbQueryDone');

        this.items = data;
        this.isRequesting = false;
        this.slimLoadingBarService.complete();
    }
    ddbQueryItemDone(data: UserResource) {

    }

    resourceRemovedCallback() {
    }
}

