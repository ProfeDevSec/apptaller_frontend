import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { firstValueFrom } from 'rxjs';
import { ChangeRole } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http = inject( HttpClient );
  private readonly baseUrl: string = "/api";
  private readonly storage = inject( StorageService );

  constructor() { }

  login( username:string, password: string )  {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password });
  }

  logout(){
    return this.http.get(`${this.baseUrl}/auth/logout`);
  }

  refresh(){
    return this.http.get(`${this.baseUrl}/auth/refresh`,this.httpOptionsRefresh());
  }

  reset(email: string){
    return this.http.post(`${this.baseUrl}/auth/recover`, { email });
  }

  changePasswordUser(nid: string, new_password: string, confirm_password: string){
    return this.http.post(`${this.baseUrl}/users/password/${nid}`, {new_password, confirm_password}, this.httpOptions());
  }

  getUsers(){
    return this.http.get(`${this.baseUrl}/users/all`, this.httpOptions());
  }

  getCompany(){
    return firstValueFrom(this.http.get(`${this.baseUrl}/companies/`, this.httpOptions()));
  }

  getUserById( nid: string ){
    return firstValueFrom( this.http.get(`${this.baseUrl}/users/${nid}`, this.httpOptions()) );
  }

  deleteUser( nid: string ){
    return this.http.delete(`${this.baseUrl}/users/${nid}`, this.httpOptions());
  }

  changeState( nid: string, newState: number ) {
    return firstValueFrom( this.http.patch( `${this.baseUrl}/users/changeState/${nid}`, {newState}, this.httpOptions() ) );
  }

  getUser(){
    return firstValueFrom( this.http.get(`${this.baseUrl}/auth/user`, this.httpOptions()) );
  }

  updateUser( nid: string, user:any ){
    return firstValueFrom( this.http.patch(`${this.baseUrl}/users/${nid}`, user, this.httpOptions()) );
  }

  createUser( nid: string, user:any ){
    return firstValueFrom( this.http.post(`${this.baseUrl}/users/create/`, user, this.httpOptions()) );
  }

  getRoles(){
    return this.http.get(`${this.baseUrl}/roles/all`, this.httpOptions());
  }

  changeRole( data: ChangeRole ) {
    return firstValueFrom( this.http.post(`${this.baseUrl}/users/change-role/`, data , this.httpOptions()) );
  }

  private httpOptions( params?: HttpParams ){

    let headers: HttpHeaders = new HttpHeaders();

    const access_token = this.storage.getItem( 'token' );

    if (access_token) {
      headers = headers.set('Authorization', `Bearer ${access_token}`)
    }

    let options: any = {
      headers
    };

    if (params) {
      options.params = params;
    }
    return options;
  }

  private httpOptionsRefresh( params?: HttpParams ){

    let headers: HttpHeaders = new HttpHeaders();

    // const access_token = this.storage.getItem( 'token' );
    const refresh_token = this.storage.getItem( 'refreshToken' );
    // console.log('REFRESH:' + refresh_token);

    if (refresh_token) {
      headers = headers.set('Authorization', `Bearer ${refresh_token}`)
    }

    let options: any = {
      headers
    };

    if (params) {
      options.params = params;
    }
    return options;
  }

}
