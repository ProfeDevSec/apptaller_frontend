import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {

  private readonly route = inject( ActivatedRoute );
  private readonly api = inject( ApiService );
  private readonly location = inject( Location );

  user = signal<any>(null);
  userNid = signal<string>('');
  forma = new FormGroup({
    nombres: new FormControl("", [Validators.required]),
    apellido_paterno: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
  });


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const nid = String(params['nid']);
      this.userNid.update(u => nid);
      this.loadData( nid );
    });
  }

  update(){
    let newUser = this.forma.value;
    console.log(newUser);

    this.api.updateUser( this.userNid(), newUser ).then(res => {
      this.location.back();
    }).catch((err:HttpErrorResponse) => {
      console.log(err);
    });
  }


  back(){
    this.location.back();
  }

  private getDate( date: string ): string {
    return date.split('T')[0];
  }

  private loadData( nid: string ){
    this.api.getUserById( nid ).then((res:any) => {
      delete res.id;
      this.user.update(u => res);

      let vnombres: string = '';
      let vapellido_paterno: string = '';
      if (res.personas.length > 0){
        vnombres =  res.personas[0].nombres;
        vapellido_paterno =  res.personas[0].apellidoPaterno;
      }

      this.forma.setValue({
        nombres: vnombres,
        apellido_paterno: vapellido_paterno,
        email: res.email,
      });
      // console.log(this.user());

    }).catch((err:HttpErrorResponse) => {
      console.log(err);

    });

  }





}
