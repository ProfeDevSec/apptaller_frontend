import {Component, inject, signal} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';
import { StorageService } from '../../core/services/storage/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private router = inject( Router );
  private http = inject( ApiService );
  private storage = inject( StorageService );
  error = signal<string>('');

  forma = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  signIn(){

    const { username, password } = this.forma.value;

    if ( username && password ) {
      this.http.login( username, password ).subscribe((res:any) => {
        this.storage.setItem('token', res.token);
        this.storage.setItem('refreshToken', res.refreshToken);

        this.router.navigate(['/']);
      },error => {
           //console.log(error)
           if(error.error) {
             this.error.update(c=>error.error.message);
           }else{
             if (error.status == 500){
               this.error.update(c => 'Un error ha ocurrido, revise su conexión de red.');
             }else {
               if (error.message) {
                 this.error.update(c => error.message);
               } else {
                 this.error.update(c => 'Un error ha ocurrido');
               }
             }
           }
        });
    }
  }


}
