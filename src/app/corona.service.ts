import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Injectable({
  providedIn: 'root'
})
export class CoronaService {

  country:any;

  constructor(private http: HttpClient) { }

  getcountries(): Observable<any>{
      const url ="https://api.covid19api.com/countries"
      return this.http.get<any>(url);
  }

  getdetails(country: any):Observable<any>{

      const url= "https://api.covid19api.com/total/dayone/country/"+country;

        return this.http.get<any>(url);
        
  }  
}
