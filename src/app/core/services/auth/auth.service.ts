import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject( Router );
  private storage = inject( StorageService );

  isAuth(): boolean {
    const data = this.storage.getItem('token');
    if ( !data ) return false;
    if ( data.length > 0 ) {
      return true;
    } 
    return false;
  }

  logout(){
    this.storage.removeItem("token");
    this.storage.removeItem("refreshToken");
    this.router.navigate(['auth/login'])
  }

}
