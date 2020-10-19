import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/gloabl-data';
import { CountryDataSummary } from "src/app/models/country-data";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  lastUpdate = '';
  loading = true;
  globalData: GlobalDataSummary[];
  countryData: CountryDataSummary[];
  datatable = [];
  value: number;
  country: String
  dataArray:any [] = []
  chart = {
    PieChart : "PieChart" ,
    ColumnChart : 'ColumnChart' ,
    LineChart : "LineChart", 
    height: 500, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }  
  }
  
  
  constructor(private dataService: DataServiceService) { }


  
  ngOnInit(): void {

    this.dataService.getTotalCounts()
      .subscribe(res => {
        console.log(res)
        let confirmed = res.confirmed.value;
        console.log(confirmed)
        this.totalConfirmed = res.confirmed.value;
        let deaths = res.deaths.value;
        console.log(deaths)
        this.totalDeaths = res.deaths.value;
        let recovered = res.recovered.value;
        console.log(recovered)
        this.totalRecovered = res.recovered.value;
        this.lastUpdate = new Date(res.lastUpdate).toDateString();
        console.log(this.lastUpdate)
      });

    

    this.dataService.getGlobalData()
      .subscribe(
        {
          next: (result) => {
            console.log(result);
            this.globalData = result;
            // result.forEach(cs => {
            //   if (!Number.isNaN(cs.confirmed)) {
            //     this.totalActive += cs.active
            //     this.totalConfirmed += cs.confirmed
            //     this.totalDeaths += cs.deaths
            //     this.totalRecovered += cs.active
            //   }

            // })

            this.initChart('c');
          }, 
          complete : ()=>{
            this.loading = false;
          }
        }
      )
  }



  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value)
  }

  initChart(caseType: string) {

    // this.datatable = [];
    // this.datatable.push(["Country", "Cases"])
    
    // this.globalData.forEach(cs => {
    //   let value :number ;
    //   if (caseType == 'c')
    //     if (cs.confirmed > 2000)
    //       value = cs.confirmed
          
    //   if (caseType == 'a')
    //     if (cs.active > 2000)
    //       value = cs.active
    //   if (caseType == 'd')
    //     if (cs.deaths > 1000)
    //       value = cs.deaths
          
    //   if (caseType == 'r')
    //     if (cs.recovered > 2000)
    //         value = cs.recovered
        

    //     this.datatable.push([
    //         cs.country, value
    //       ])
    // })
    // console.log(this.datatable);
    this.dataService.getCountryData()
      .subscribe(res => {
        console.log(res)
        this.datatable = [];
        res.forEach(i => {
          console.log(i.infected)
          let value :number ;
          if (caseType == 'c')
            if (i.infected > 2000)
              value = i.infected

          if (caseType == 'd')
            if (i.deceased > 2000)
              value = i.deceased

          if (caseType == 'r')
            if (i.recovered > 2000)
                value = i.recovered
          this.datatable.push([
            i.country, value
          ])
        })
        console.log(this.datatable)
      })
  }

}
