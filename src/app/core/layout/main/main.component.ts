import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from "../../services/api/api.service";
import { User } from "../../interfaces";
import { HttpErrorResponse } from "@angular/common/http";
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  private auth = inject( AuthService );

  private http = inject( ApiService );
  private storage = inject( StorageService );

  user = signal<any>( null );

  open: boolean = true;


  handleSidebar( e:any ): void {
    this.open = !this.open;
  }

  logout(){
    this.auth.logout();
  }

    ngOnInit(){
    this.http.getUser().then((res:any) => {
      let loggUser = res;
      loggUser.roles = loggUser.roles.map( (r:any) => r.rol.codigo );
      this.storage.setJson( "user", loggUser );

      this.user.update( value => {
        let newuser = res;
        // console.log(res);
        return newuser;
      });
      
    }).catch((err:HttpErrorResponse) => {
      console.error( err );
      // this.auth.logout();
    });
  }

}
