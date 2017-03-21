/**
 * Created by wilson.narea on 11/30/2016.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filesize'
})
export class FileSizePipe implements PipeTransform{
    transform(size:number) {
        if (size) {
            console.log('FileSizePipe');

            var kb = Math.round(size / 1024.0).toFixed(2);
            return kb.toString() + ' KB';
        }
    }
}