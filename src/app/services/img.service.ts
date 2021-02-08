import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImgService {

  constructor(private sanitizer: DomSanitizer) { }

  getImage(foto){
    return this.sanitizer.bypassSecurityTrustResourceUrl(foto);
  }

}
