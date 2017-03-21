/**
 * Created by wilson.narea on 11/30/2016.
 */
/**
 * Created by wilsonnarea on 11/16/16.
 */
import {Component, ViewChild, OnInit, OnDestroy} from "@angular/core";
import {LoggedInCallback, UserLoginService, Callback} from "../../service/aamsuite.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from 'rxjs/Rx';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {StorageService, StorageCallback} from "../../service/aamsuite.service";
import {BucketItem} from "../../shared/bucketItem";
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {UserResource} from "../../shared/userResource";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

declare var AWS:any;

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './s3.html',
    styles: [`
        a.disabled {
            color: gray;
            pointer-events: none;
            cursor: not-allowed; 
        }
        td {
            font-weight: normal;
        }
    `]
})
export class S3Component implements LoggedInCallback, StorageCallback, OnInit, OnDestroy {
    @ViewChild('uploadModal')
    uploadModal: ModalComponent;
    bucketData: Array<BucketItem> = new Array<BucketItem>();
    breadcrumb: Array<BucketItem> = new Array<BucketItem>();
    subscription: Subscription;
    createFolderForm: FormGroup;
    file: File;
    progressUploadMessage: String = 'no message';
    resource: UserResource;
    displayNameHighlighted: string = '';

    constructor(private router: Router,
                private route: ActivatedRoute,
                private userService: UserLoginService,
                private formBuilder: FormBuilder,
                private storageService: StorageService,
                private slimLoadingBarService: SlimLoadingBarService) {

        console.log("in S3Component");

        this.createFolderForm = formBuilder.group({
            'folderName': ['', [
                Validators.required/*,
                Validators.pattern("[a-z][A-Z][0-9]-_")*/
            ]]
        });

        this.createFolderForm.statusChanges.subscribe(
            (data: any) => console.log(data)
        );

        this.resource = new UserResource();
        this.userService.isAuthenticated(this);
    }

    getCurrentPrefix() {
        var prefix = '';
        for (var i=0; i < this.breadcrumb.length; i++) {
            prefix = prefix + this.breadcrumb[i] + '/';
        }
        return prefix;
    }

    ngOnInit() {

        //this.dynamoDBService.query(this);

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    isLoggedIn(message:string, isLoggedIn:boolean) {
        if (!isLoggedIn) {

        } else {
            console.log("scanning DDB");
            this.subscription = this.route.params.subscribe(
                (params: any) => {

                    this.slimLoadingBarService.start();

                    var resourceId = params['resourceid'];
                    var documentId = params['prefix'];

                    console.log('route changed',resourceId, documentId);

                    if (resourceId != null){
                        this.breadcrumb = new Array<BucketItem>();
                        this.storageService.getAccess(resourceId, this);
                        this.storageService.listStorage(resourceId, this);
                    } else if (documentId != null){
                        console.log('document changed');
                        const docs = this.bucketData.filter(d => d.prefix == documentId);
                        console.log('filter', docs);
                        if (docs != null && docs.length>0) {
                            const doc = docs[0];
                            console.log('Open doc', doc);
                            this.breadcrumb.push(doc);
                            console.log('breadcrumb', this.breadcrumb);
                            this.storageService.listChildren(documentId, this);
                        } else {
                            const docsBreadcrumb = this.breadcrumb.filter(d => d.prefix == documentId);
                            if (docsBreadcrumb != null && docsBreadcrumb.length>0) {
                                const docBreadcrumb = docsBreadcrumb[0];
                                const docIndex = this.breadcrumb.indexOf(docBreadcrumb);
                                this.breadcrumb = this.breadcrumb.slice(0, docIndex+1);
                                this.storageService.listChildren(documentId, this);
                            }
                        }
                    }
                }
            );
        }
    }

    newFolderSubmit() {
        this.uploadModal.close();

        const folderName = this.createFolderForm.controls['folderName'].value;
        console.log('Create this folder:', folderName);
        if(this.breadcrumb.length == 0) {
            this.storageService.createFolder(folderName, null, this.resource.id, this);
        }
        else {
            const parentDocument = this.breadcrumb[this.breadcrumb.length-1];
            this.storageService.createFolder(folderName, parentDocument.prefix, this.resource.id, this);
        }

    }

    downloadFile (item: BucketItem) {
        console.log("download file:" + item.name);

        item.busy = true;
        this.storageService.downloadFile(item, this);

    }

    removeFile(item: BucketItem) {
        console.log("removeFile file:", item);
        this.storageService.removeResource(item.prefix, this);
    }

    showNewFolderModal() {
        console.log('showUploadModal() called ');
        this.uploadModal.open();
    }

    showFileSelector() {
        console.log('showFileSelector() called');
        document.getElementById('fileInput').click();
    }

    fileEvent(fileInput: any) {
        console.log('fileEvent');
        var files = fileInput.target.files;
        var file = files[0];
        this.file = file;
        console.log(file);

        this.progressUploadMessage = '';
        // var prefix = this.getCurrentPrefix();
        // console.log(prefix);
        // var key = prefix + this.file.name;
        // console.log('uploading' + key);
        this.slimLoadingBarService.start();
        if(this.breadcrumb.length == 0) {
            this.storageService.uploadFile(this.file, '', this.resource.id, this);
        } else {
            const parentDocument = this.breadcrumb[this.breadcrumb.length-1];
            this.storageService.uploadFile(this.file, parentDocument.prefix, this.resource.id, this);
        }
    }

    listStorageCallback(data: Array<BucketItem>) {
        console.log('listStorageCallback', data);
        this.bucketData = data;
        this.slimLoadingBarService.complete();
    }

    resourcesCallback(data: Array<UserResource>) {
        console.log('resourcesCallback', data);

        this.resource = data[0];

    }

    storageCallback(message: string, result: any){

    }

    resourcesFailCallback(errObject){

        const {error, item} = errObject;

        if (item != null) {
            item.busy = false;
        }
    }

    resourceCreatedCallback(data: BucketItem) {
        this.bucketData.unshift(data);
        this.slimLoadingBarService.complete();
    }

    downloadedCallback(item: BucketItem, dataFile: any){
        console.log('downloadedCallback');
        console.log(dataFile._body.length);
        var thefile = new Blob([dataFile._body], { type: 'application/octet-stream' });
        console.log(thefile);

        item.busy = false;
        this.slimLoadingBarService.complete();

        var a = document.createElement("a");
        document.body.appendChild(a);

        let url = window.URL.createObjectURL(thefile);
        a.href = url;
        a.download = item.name;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    resourceRemovedCallback(resourceId: string) {
        console.log('resourceRemovedCallback', resourceId);
        this.bucketData = this.bucketData.filter(one => one.prefix !== resourceId);
    }

}
