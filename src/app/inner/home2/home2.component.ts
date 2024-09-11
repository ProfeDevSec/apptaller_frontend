import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../core/shared/components';
import moment from 'moment';

@Component({
  selector: 'app-home2',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingComponent, ReactiveFormsModule],
  templateUrl: './home2.component.html',
  styleUrl: './home2.component.css',
  providers: [],
})
export class Home2Component implements OnInit {

  private http = inject(ApiService);

  company = signal<any>(null);
  data = signal<any>(null);
  now = moment();

  ngOnInit() {

    // this.yesterday.setHours( this.now.getHours() - 24 );

    // const _ = this.getRangeDate();
    this.loadData();
  }

  async loadData() {

    const resCompany: any = await this.http.getCompany();
    if (resCompany.error) return console.log(resCompany.error);
    this.company.update(value => {
      let newCompany = resCompany;
      return newCompany;
    });

  }

}
