import { Injectable } from '@angular/core';
import { SHA256, AES, enc }  from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private SECRET_KEY: string;


  constructor() {
    // VULN hardcoding key
    this.SECRET_KEY = SHA256( "018f5582-b871-7741-82a4-9fed93571a0e" ).toString();
  }

  private encrypt( data:any ){
    return AES
      .encrypt( data, this.SECRET_KEY )
      .toString();
  }

  private decrypt( data:any ){
    return AES
      .decrypt( data, this.SECRET_KEY )
      .toString( enc.Utf8 );
  }

  keyExists( key: string, persistence:boolean = false ) : boolean {
    return this.getItem( key, persistence ) != null;
  }

  getItem( key: string, persistence:boolean = false ) {
    const item = persistence ? localStorage.getItem( key ): sessionStorage.getItem( key );
    return item ? this.decrypt( item ) : null;
  }

  setItem( key: string, item: string, persistence:boolean = false ) {
    persistence ? localStorage.setItem( key, this.encrypt( item ) ) : sessionStorage.setItem( key, this.encrypt( item ) );
  }

  setJson( key: string, data: any, persistence:boolean = false ) {
    this.setItem( key, JSON.stringify( data ), persistence );
  }

  getJson( key: string, persistence:boolean = false  ) {
    const item = this.getItem(key, persistence);
    return item ? JSON.parse(item) : null;
  }

  removeItem( key: string ){
    sessionStorage.removeItem( key );
  }

  clear(){
    sessionStorage.clear();
  }

}
