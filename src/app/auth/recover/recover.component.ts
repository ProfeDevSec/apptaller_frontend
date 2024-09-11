import {Component, inject, signal} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';
import { StorageService } from '../../core/services/storage/storage.service';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css'
})
export class RecoverComponent {

  private router = inject( Router );
  private http = inject( ApiService );
  private storage = inject( StorageService );

  error = signal<string>('');
  success = signal<string>('');

  forma = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  reset(){

    const { email } = this.forma.value;

    if ( email ) {
      this.http.reset( email ).subscribe((res:any) => {
          if ( res.status){
            if (res.status == 'error'){
               this.error.update(value=>res.message);
               this.success.update(value=>'');
            }
            if (res.status == 'ok'){
               this.success.update(value=>res.message);
               this.error.update(value=>'');
            }
        }else{
           if ( res.message){
               this.success.update(value=>res.message);
               this.error.update(value=>'');
           }
        }
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
