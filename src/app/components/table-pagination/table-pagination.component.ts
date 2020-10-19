import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/gloabl-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.css']
})
export class TablePaginationComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  elements: any = [];
  previous: any = [];
  headElements = ['Sr No.', 'Date', 'Cases'];

  data : GlobalDataSummary[];
  countries : string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData : DateWiseData[]; 
  dateWiseData ;
  loading = true;
  options: {
    height : 500, 
    animation:{
      duration: 1000,
      easing: 'out',
    },
  }

  constructor(private cdRef: ChangeDetectorRef, private api: DataServiceService) { }

  ngOnInit() {

    merge(
      this.api.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ), 
      this.api.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
          // console.log(this.countries.length)
        })
      }))
    ).subscribe(
      {
        complete : ()=>{
         this.updateValues('India')
         this.loading = false;
        }
      }
    )
    
    for (let i = 1; i <= 330; i++) {
      this.elements.push({id: i.toString(), first: 'User ' + i, last: 'Name ' + i, handle: 'Handle ' + i});
    }

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  updateChart(){
    let dataTable = [];
    dataTable.push(["Date" , 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      dataTable.push([cs.date , cs.cases])
    })

   
  }

  updateValues(country : string){
    console.log(country);
    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive = cs.active
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
        this.totalConfirmed = cs.confirmed
      }
    })

    this.selectedCountryData  = this.dateWiseData[country]
    // console.log(this.selectedCountryData);
    this.updateChart();
    
  }
}
