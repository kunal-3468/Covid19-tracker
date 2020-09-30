import { Component, OnDestroy} from '@angular/core';
import { CoronaService } from './corona.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as Chart from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'covid19-tracker';
   
  countries:any;
  country: any;
  confirmed: number;
  recovered: number
  deaths:number;
  active: number;
  recoveryrate: string;
  deathrate:string;
  last24hrcase: number;
  last24hrrec:number;
  ondata= false;
  data:any;
  onedayconfirmed= [];
  onedayrecovered=[];
  onedaydeaths=[];
  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];
  lineChartOptions: ChartOptions;
  lineChartColors: Color[];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType;
  length=[];
  lineChartData1: ChartDataSets[] = [];
  lineChartColors1: Color[];
  lineChartData2: ChartDataSets[] = [];
  lineChartColors2: Color[];
  dailyconf: any;
  dailyrec: any;
  pieColors: Color[];
  pie=false;
  line=false;
  line1=false;
  dailydeath: any;
  sub : Subscription;
  sub1: Subscription;
  count=[];
  sortedcountry:any;

   constructor(private coronasrs: CoronaService){}

   ngOnInit(){
        this.sub= this.coronasrs.getcountries().subscribe( data =>{
         this.countries = data;
         
         for(var country of this.countries){
            this.count.push(country.Country);
         }
           this.sortedcountry= this.count.sort();
       })
   }

   onpie(){
     this.pie = !this.pie;
   }
   online(){
     this.line = !this.line;
   }
   online1(){
     this.line1 = !this.line1;
   }
   
   getdata(){
        this.ondata= true;

        this.pie= false;
        this.line= false;
        this.line1= false;

       this.sub1= this.coronasrs.getdetails(this.country).subscribe( data =>{

        console.log(data); 
        
        this.dailyconf=0;
        this.dailyrec=0;
        this.dailydeath=0;
        this.onedayconfirmed= [];
        this.onedayrecovered= [];
        this.onedaydeaths= [];
        this.length=[];

        for(var i=data.length; i>1; i--){
             var indexi= data.length - i;
             var indexx= data.length - (i-1);
             
             this.dailyconf= data[indexx].Confirmed - data[indexi].Confirmed;
             this.dailyrec= data[indexx].Recovered - data[indexi].Recovered;
             this.dailydeath= data[indexx].Deaths - data[indexi].Deaths
             this.onedayconfirmed.push(this.dailyconf);
             this.onedayrecovered.push((this.dailyrec/this.dailyconf)*100);
             this.onedaydeaths.push((this.dailydeath/this.dailyconf)*100);
              }  
        for(var x=1; x<= data.length; x++){
           this.length.push(x);
        }       

          var index = data.length - 1;
          var index1= data.length - 2;
         
          this.last24hrcase= data[index].Confirmed - data[index1].Confirmed;
          this.last24hrrec= data[index].Recovered - data[index1].Recovered;
   
          this.active= data[index].Active;
          this.confirmed= data[index].Confirmed;
          this.recovered= data[index].Recovered;
          this.recoveryrate= ((this.recovered/this.confirmed)*100).toFixed(2)
          this.deaths= data[index].Deaths;
          this.deathrate= ((this.deaths/this.confirmed)*100).toFixed(2); 

          this.lineChartData=[
            { data: this.onedayconfirmed, label: 'Daily Rise in Cases' },
          ];;
          this.lineChartLabels= this.length;
          this.lineChartType = 'line';
          this.lineChartOptions = {
            responsive: true,
            legend : {
              labels : {
                fontColor : 'black'  
              }
          }
          };
          this.lineChartColors= [
            {
              borderColor: 'black',
              backgroundColor: '#D3343B',
            },
          ];

          this.lineChartData1=[
            { data: this.onedayrecovered, label: '%age of Daily Recovered Cases' },
          ];
          this.lineChartColors1= [
            {
              borderColor: 'black',
              backgroundColor: '#37D23C',
            },
          ];

          this.lineChartData2=[
            { data: this.onedaydeaths, label: '%age of Daily Death Cases'},
          ]; 
          this.lineChartColors2= [
            {
              borderColor: 'black',
              backgroundColor: '#F5F919',
            },
          ];

       } )

        
   }
     
   getcountry(country: any){
      this.country= country;
   }

   ngOnDestroy(){
      this.sub.unsubscribe;
      this.sub1.unsubscribe;
  }
}
