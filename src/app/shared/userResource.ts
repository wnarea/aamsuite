/**
 * Created by wilson.narea on 12/5/2016.
 */
export class UserResource {
    public id:number;
    public image:string;
    public subscribed:boolean;
    public prefix:string;
    public displayName:string;
    public description:string;
    public useremail:boolean;
    public accessflag:number;

    allowCreateFolder() {
        if ((this.accessflag & 2)  === 2) {
            return true;
        }
        else {
            return false;
        }
    }

    removable() {
        if ((this.accessflag & 4) === 4) {
            return true;
        }
        else {
            return false;
        }
    }
}