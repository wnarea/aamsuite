import {Injectable} from "@angular/core";
import {
    Http, Headers, Response, URLSearchParams, RequestOptions, RequestMethod,
    ResponseContentType, Request
} from '@angular/http';
import {RegistrationUser} from "../public/auth/register/registration.component";
import {UserResource} from "../shared/userResource";
import {BucketItem} from "../shared/bucketItem";
import {environment} from "../../environments/environment";

export interface IdentityCallback {
    identityCallback(message: string, result: any): void;
}

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}

export interface AAMCallback {
    aamCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface LoggedOutCallback {
    loggedOut(message: string): void;
}

export interface StorageCallback {
    storageCallback(message: string, result: any): void;
    listStorageCallback(data: Array<BucketItem>): void;
    resourcesCallback(data: Array<UserResource>): void;
    resourcesFailCallback(error): void;
    resourceCreatedCallback(data: BucketItem): void;
    downloadedCallback(data: BucketItem, dataFile: any): void;
    resourceRemovedCallback(resourceId: string): void;
}

@Injectable()
export class UserLoginService {
    private _userId: number;

    constructor(private http: Http) {
    }

    getCurrentUserId(): number{
        console.log('getCurrentUserId()', this._userId);
        return this._userId;
    }
    authenticate(username: string, password: string, callback: AAMCallback) {
        console.log("UserLoginService: starting the authentication")

        const url = `${environment.webApiUrl}/account/login`;
        const encodeUsername = encodeURIComponent(username);
        const encodePassword = encodeURIComponent(password);
        const body = `email=${encodeUsername}&password=${encodePassword}&rememberMe=true`;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        console.log("Body:", body);

        this.http.post(url, body, {headers: headers, withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('Login OK', result);
                    this.parseLoginResult(result);
                    callback.aamCallback(null, true);
                },
                (error) => {
                    console.log(error);
                    callback.aamCallback(error, true);
                }
            );
    }

    parseLoginResult({user}) {
        console.log('parseLoginResult', user);
        this._userId = user.userId;
        console.log('userid', this._userId);
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw("UserLoginService: Callback in isAuthenticated() cannot be null");

        const url = `${environment.webApiUrl}/account/user`;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.get(url, {headers: headers, withCredentials: true })
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('isAuthenticated', result);
                    this.parseLoginResult(result);
                    callback.isLoggedIn("OK", true);
                },
                (error) => {
                    console.log('isAuthenticated', error);
                    callback.isLoggedIn(error, false);
                }
            );
    }

    forgotPassword(username: string, callback: IdentityCallback) {

    }
    confirmNewPassword(email: string, verificationCode: string, password: string, callback: IdentityCallback) {

    }

    logout() {
        console.log("UserLoginService: Logging out");
        var headers = new Headers();
        const url = `${environment.webApiUrl}/account/logout`;
        const body = {};

        this.http.post(url, body, {headers: headers, withCredentials: true})
            .subscribe(
                (result) => {
                    console.log('getAccess OK', result);
                },
                (error) => {
                    console.log(error);
                }
            );
    }
}

@Injectable()
export class UserRegistrationService {

    constructor() {

    }

    register(user: RegistrationUser, callback: IdentityCallback): void {
        console.log("UserRegistrationService: user is " + user);

        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: user.email
        };
        let dataNickname = {
            Name: 'nickname',
            Value: user.name
        };

        //TODO:
        // attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail));
        // attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataNickname));
        //
        // this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
        //     if (err) {
        //         callback.cognitoCallback(err.message, null);
        //     } else {
        //         console.log("UserRegistrationService: registered user is " + result);
        //         callback.cognitoCallback(null, result);
        //     }
        // });

    }

    confirmRegistration(username: string, confirmationCode: string, callback: IdentityCallback): void {

        // let userData = {
        //     Username: username,
        //     Pool: this.cognitoUtil.getUserPool()
        // };
        //
        // let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        //
        // cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
        //     if (err) {
        //         callback.cognitoCallback(err.message, null);
        //     } else {
        //         callback.cognitoCallback(null, result);
        //     }
        // });
    }

    resendCode(username: string, callback: IdentityCallback): void {
        // let userData = {
        //     Username: username,
        //     Pool: this.cognitoUtil.getUserPool()
        // };
        //
        // let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        //
        // cognitoUser.resendConfirmationCode(function (err, result) {
        //     if (err) {
        //         callback.cognitoCallback(err.message, null);
        //     } else {
        //         callback.cognitoCallback(null, result);
        //     }
        // });
    }

}

@Injectable()
export class StorageService{

    constructor(private http: Http, private userLoginService: UserLoginService){

    }

    getAccess(resourceid: number, callback: StorageCallback) {

        console.log('getAccess ID:', resourceid);
        const userId = this.userLoginService.getCurrentUserId();
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const url = `${environment.webApiUrl}/storage/fund/${resourceid}?userId=${userId}`;

        this.http.get(url, {headers: headers, withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('getAccess OK', result);

                    const userResource = new UserResource();
                    userResource.id = result.id;
                    userResource.image = '';
                    userResource.subscribed = result.subscribed;
                    userResource.prefix = '';
                    userResource.displayName = result.displayName;
                    userResource.description = result.description;
                    userResource.useremail = result.email;
                    userResource.accessflag = result.accessFlag;

                    callback.resourcesCallback([userResource]);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback(error);
                }
            );
    }

    listResources(userId: number, callback: StorageCallback) {
        console.log('listResources');

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const url = `${environment.webApiUrl}/storage/funds/${userId}`;

        this.http.get(url, {headers: headers, withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('initialStorage OK', result);
                    const funds = result.map(data => {
                        const userResource = new UserResource();
                        userResource.id = data.id;
                        userResource.image = '';
                        userResource.subscribed = data.subscribed;
                        userResource.prefix = '';
                        userResource.displayName = data.displayName;
                        userResource.description = data.description;
                        userResource.useremail = data.email;
                        userResource.accessflag = data.accessFlag;
                        return userResource;
                    });
                    callback.resourcesCallback(funds);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback(error);
                }
            );
    }

    listStorage(resourceId:number, callback: StorageCallback) {
        console.log('listStorage');

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const url = `${environment.webApiUrl}/storage/documents/${resourceId}`;

        this.http.get(url, {headers: headers, withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('listStorage OK', result);
                    const funds = result.map(data => {
                        const bucketItem = new BucketItem();
                        bucketItem.prefix = data.id;
                        bucketItem.name = data.displayName;
                        bucketItem.date = '';
                        bucketItem.isContainer = data.isDirectory;
                        bucketItem.url = '';
                        bucketItem.size = data.contentLength;
                        bucketItem.lastModified = data.created;
                        bucketItem.extension = data.contentType;
                        return bucketItem;
                    });
                    callback.listStorageCallback(funds);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback(error);
                }
            );
    }

    listChildren(documentId:number, callback: StorageCallback) {
        console.log('listChildren');

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const url = `${environment.webApiUrl}/storage/children/${documentId}`;

        this.http.get(url, {headers: headers, withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('listStorage OK', result);
                    const funds = result.map(data => {
                        const bucketItem = new BucketItem();
                        bucketItem.prefix = data.id;
                        bucketItem.name = data.displayName;
                        bucketItem.date = '';
                        bucketItem.isContainer = data.isDirectory;
                        bucketItem.url = '';
                        bucketItem.size = data.contentLength;
                        bucketItem.lastModified = data.created;
                        bucketItem.extension = data.contentType;
                        return bucketItem;
                    });
                    callback.listStorageCallback(funds);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback(error);
                }
            );
    }

    createFolder(folderName: string, documentParentId: string, resourceId:number, callback: StorageCallback)
    {
        console.log('listChildren');

        const body = {
            folderName : folderName,
            documentParentId : documentParentId,
            fundId: resourceId,
            userId: this.userLoginService.getCurrentUserId()
        };
        console.log('Create fodler body:', body);

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const url = `${environment.webApiUrl}/storage/createFolder`;

        this.http.post(url, body, {headers: headers, withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('listStorage OK', result);

                    const bucketItem = new BucketItem();
                    bucketItem.prefix = result.id;
                    bucketItem.name = result.displayName;
                    bucketItem.date = '';
                    bucketItem.isContainer = result.isDirectory;
                    bucketItem.url = '';
                    bucketItem.size = result.contentLength;
                    bucketItem.lastModified = result.created;
                    bucketItem.extension = result.contentType;

                    callback.resourceCreatedCallback(bucketItem);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback(error);
                }
            );
    }

    uploadFile(file: any, parentDocumentId:string, resourceId:number, callback: StorageCallback) {
        console.log('uploadFile');

        const headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        const url = `${environment.webApiUrl}/storage/uploadFile`;

        const formData: FormData = new FormData();
        formData.append('formFile', file, file.name);
        formData.append('userId', this.userLoginService.getCurrentUserId());
        formData.append('resourceId', resourceId);
        formData.append('parentDocumentId', parentDocumentId);

        this.http.post(url, formData, { withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('uploadFile OK', result);

                    const bucketItem = new BucketItem();
                    bucketItem.prefix = result.id;
                    bucketItem.name = result.displayName;
                    bucketItem.date = '';
                    bucketItem.isContainer = result.isDirectory;
                    bucketItem.url = '';
                    bucketItem.size = result.contentLength;
                    bucketItem.lastModified = result.created;
                    bucketItem.extension = result.contentType;

                    callback.resourceCreatedCallback(bucketItem);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback(error);
                }
            );
    }

    downloadFile(item: BucketItem, callback: StorageCallback) {

        console.log('downloadFile');

        const url = `${environment.webApiUrl}/storage/downloadResource/${item.prefix}/${item.name}`;

        let headers = new Headers();

        //create an instance of requestOptions
        let requestOptions = new RequestOptions({
            headers: headers
            // search: params
        });

        //any other requestOptions
        requestOptions.method = RequestMethod.Get;
        requestOptions.url = url;
        requestOptions.responseType = ResponseContentType.Blob;

        //create a generic request object with the above requestOptions
        let request = new Request(requestOptions);

        this.http.request(request)
            .subscribe(
                (result) => {
                    console.log('downloadFile OK', result);
                    callback.downloadedCallback(item, result);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback({error: error, item: item});
                }
            );
    }

    removeResource(resourceId: string, callback: StorageCallback) {

        console.log('removeResource:', resourceId);

        const userId = this.userLoginService.getCurrentUserId();

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const url = `${environment.webApiUrl}/storage/removeResource/${resourceId}`;

        this.http.delete(url, {headers: headers, withCredentials: true})
            .map( response => response.json())
            .subscribe(
                (result) => {
                    console.log('removeResource OK', result);

                    callback.resourceRemovedCallback(resourceId);
                },
                (error) => {
                    console.log(error);
                    callback.resourcesFailCallback(error);
                }
            );
    }
}