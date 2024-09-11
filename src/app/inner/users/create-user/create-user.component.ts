import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {

  private readonly route = inject( ActivatedRoute );
  private readonly api = inject( ApiService );
  private readonly location = inject( Location );

  user = signal<any>(null);
  selectedNIDCompany = signal<string>('');
  forma = new FormGroup({
    nombres: new FormControl(null, [Validators.required]),
    apellido_paterno: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
  });



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const nid = String(params['nid']);
      this.selectedNIDCompany.update(u => nid);
    });
  }

  getJson( value: any ): string {
    return JSON.stringify( value );
  }

  create(){

    let newUser = this.forma.value;

    console.log(newUser);

    this.api.createUser( this.selectedNIDCompany(), newUser ).then(res => {
      this.location.back();
    }).catch((err:HttpErrorResponse) => {
      console.log(err);
    });
  }

  back(){
    this.location.back();
  }

}
