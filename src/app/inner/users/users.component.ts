import { Component,  OnInit,inject, signal } from '@angular/core';
import { User, Role, ChangeRole } from '../../core/interfaces';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconNightComponent } from '../../core/shared/icon-night/icon-night.component';
import { IconSunComponent } from '../../core/shared/icon-sun/icon-sun.component';
import { IconClockComponent } from '../../core/shared/icon-clock/icon-clock.component';
import { IconAddUserComponent } from '../../core/shared/icon-add-user/icon-add-user.component';
import { IconRolesComponent } from '../../core/shared/icon-roles/icon-roles.component';
import { IconViewComponent } from '../../core/shared/icon-view/icon-view.component';
import { IconEditComponent } from '../../core/shared/icon-edit/icon-edit.component';
import { IconDeleteComponent } from '../../core/shared/icon-delete/icon-delete.component';
import { StorageService } from '../../core/services/storage/storage.service';
import { ApiService } from '../../core/services/api/api.service';
import { HttpErrorResponse } from "@angular/common/http";
import { userState } from '../../core/enums/userState.enum';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, IconNightComponent, IconSunComponent, IconClockComponent, IconAddUserComponent, IconRolesComponent, IconViewComponent, IconEditComponent, IconDeleteComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  storage = inject(StorageService);

  isModalUserUpdateOpen = signal<boolean>(false);
  isModalShiftOpen: boolean = false;
  isModalCreateUser: boolean = false;
  isModalRolesOpen: boolean = false;
  isModalEditUserOpen: boolean = false;
  isModalDeleteUserOpen: boolean = false;
  isModalRecoverPasswordOpen: boolean = false;

  loggedUser = signal<any>({});

  users = signal<any>(null);
  roles = signal<Role[]>([]);
  shifts = signal<any>(null);
  userDetail = signal<any>(null);

  originalUsers = signal<any>([null]);
  error_message = signal<any>(null);
  success_message = signal<any>(null);

  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly api = inject(ApiService);

  formCreateUser: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    secondSurname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    admin: new FormControl(true, Validators.required),
    operador: new FormControl(true, Validators.required),
    supervisor: new FormControl(true, Validators.required),
    administrador_empresa: new FormControl(true, Validators.required),
    shiftType: new FormControl('dia', Validators.required),
    countryId: new FormControl(1, Validators.required),
    shiftAssignment: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  formEditUser: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    secondSurname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    admin: new FormControl(false, Validators.required),
    operador: new FormControl(false, Validators.required),
    supervisor: new FormControl(false, Validators.required),
    administrador_empresa: new FormControl(false, Validators.required),
    shiftType: new FormControl('', Validators.required),
    countryId: new FormControl(0, Validators.required),
    shiftAssignment: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  formChangeShift: FormGroup = new FormGroup({
    shift: new FormControl('', Validators.required)
  });

  formChangePassword: FormGroup = new FormGroup({
    new_password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    confirm_password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)])
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loggedUser.update(u => {
      const newUser = this.storage.getJson("user");
      return newUser;
    });
  }




  loadUsers() {
    this.api.getUsers().toPromise().then((res:any) => {
      res.sort((a:any, b:any) => a.email.toLowerCase() < b.email.toLowerCase() ? -1 : 1)
      this.users.update(u => res.filter((x:any) => x.estado != 2));
      this.originalUsers.update(u=>res);
    }).catch((err: HttpErrorResponse) => {
      console.error(err);
    })
  }


  loadRoles() {
    this.api.getRoles().toPromise().then((res: any) => {
      // console.log(res);
      this.roles.update(r => res);
    });
  }

  getRoles( rolObj: { id: number, rol: {id:number, codigo: string} }[] ): string[] {
    let temp:string[] = [];
    rolObj.forEach(role => {
      temp.push( role.rol.codigo );
    });
    return temp;
  }

  handleEditModal(e: boolean) {
    this.isModalEditUserOpen = !this.isModalEditUserOpen;
  }

  handleModalEditUser(user?: User) {
    if (user) {
      this.userDetail.set(user);
      console.log(user);
      this.formEditUser.get('name')?.setValue(this.userDetail().name);
      this.formEditUser.get('surname')?.setValue(this.userDetail().surname);
      this.formEditUser.get('secondSurname')?.setValue(this.userDetail().secondSurname);
      this.formEditUser.get('email')?.setValue(this.userDetail().email);
      this.formEditUser.get('countryId')?.setValue(this.userDetail().countryId);
      this.formEditUser.get('password')?.setValue(this.userDetail().password);
    }
    this.isModalEditUserOpen = !this.isModalEditUserOpen;
  }

  handleModalDeleteUser(user?: User) {
    if (user) {
      this.userDetail.set(user);
    }else{
      this.loadUsers();
      this.userDetail.set(null);
    }
    this.isModalDeleteUserOpen = !this.isModalDeleteUserOpen;
  }

  handleModalShift(user?: User) {
    if (user) {
      this.userDetail.set(user);
    }else{
      this.loadUsers();
      this.userDetail.set(null);
    }
    this.isModalShiftOpen = !this.isModalShiftOpen;
  }

  handleModalRoles(user?: User) {
    if (user) {
      this.userDetail.set(user);
    }else{
      this.loadUsers();
      this.userDetail.set(null);
    }
    this.isModalRolesOpen = !this.isModalRolesOpen;
  }

  deleteUser() {
    const userNid =  this.userDetail().nid;

    console.log({ userNid, user: this.userDetail() });

    this.users.update( u => {
      return u.filter( (x:any) => x.nid != userNid );
    });

    // Desactivar el usuario
    this.api.changeState( userNid, userState.DELETED ).then( res => {
      console.log(res);
    } ).catch( (err:HttpErrorResponse) => {
      console.log(err);
    });

    this.isModalDeleteUserOpen = !this.isModalDeleteUserOpen;

  }

  handleModalRecoverPassword(user?: User) {
    if (user) {
      this.userDetail.set(user);
    }else{
      this.userDetail.set(null);
    }
    this.isModalRecoverPasswordOpen = !this.isModalRecoverPasswordOpen;
  }

  closeModalError(){
    this.error_message.update(c=>'');
  }

  closeModalSuccess(){
    this.success_message.update(c=>'');
  }

  recoverPassword() {
    const userNid =  this.userDetail().nid;
    const value = this.formChangePassword.value;

    this.api.changePasswordUser(userNid, value.new_password, value.confirm_password).subscribe((res:any) => {
        console.log(res);
        // @ts-ignore
        if ( res.status){
            if (res.status == 'error'){
               this.error_message.update(value=>res.message);
            }
            if (res.status == 'ok'){
               this.success_message.update(value => "Contraseña actualizada y enviada por correo");
            }
        }else{
           if ( res.message){
               this.success_message.update(value=>res.message);
           }
        }
      },error => {
           //console.log(error)
           if(error.error) {
             this.error_message.update(c=>error.error.message);
           }else{
             if (error.status == 500){
               this.error_message.update(c => 'Un error ha ocurrido, revise su conexión de red.');
             }else {
               if (error.message) {
                 this.error_message.update(c => error.message);
               } else {
                 this.error_message.update(c => 'Un error ha ocurrido');
               }
             }
           }
      });

    this.isModalRecoverPasswordOpen = !this.isModalRecoverPasswordOpen;

  }

  changeRole( e:any, role: Role ){
    // console.log(e);
    const checked = e.target.checked;
    console.log(role);
    let data: ChangeRole = {
      userNid: this.userDetail().nid,
      rolNid: role.nid,
      checked
    }

    console.log( { data } );

    this.api.changeRole( data ).then(res => {
      console.log(res);
    }).catch((err:HttpErrorResponse) => {
      console.error(err);
    })
  }

  isRole( role: string ): boolean {
    if ( this.userDetail().userRoles.find( (el: {rol:{ id: number, codigo: string }}) => el.rol.codigo === role ) ) {
      return true;
    }
    return false;
  }


  filter({target}: any) {
    const term = (target.value).toLowerCase();

    if (this.originalUsers() !== null){
      this.users.update( u=> this.originalUsers().filter((user: any) => {

        if (user.personas.length > 0) {
          if (user.personas[0].nombres.toLowerCase().includes( term ) ||
              user.personas[0].apellidoPaterno.toLowerCase().includes( term )){
            return true;
          }
        }

        return user.email.toLowerCase().includes( term );

      }) );
    }
  }

}
