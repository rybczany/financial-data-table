import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FinancialData } from './financial-data';
import { DataTableService } from '../../services/api/data-table.service';
import { groupBy, map, mergeMap, tap, toArray, zip } from 'rxjs/operators';
import { of } from 'rxjs';

//---------------------------------------------------------------------------------

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DataTableComponent implements OnInit {
  constructor(private dataTableService: DataTableService) {}
  mainDataSource: FinancialData[] = [];
  subDataSource: FinancialData[] = [];
  expandedElement: FinancialData | null | undefined;
  mainColumns = [
    {
      columnDef: 'symbol',
      header: 'Symbol',
      cell: (element: FinancialData) => `${element.symbol}`,
    },
    {
      columnDef: 'order id',
      header: 'Order ID',
      cell: () => ``,
    },
    {
      columnDef: 'side',
      header: 'Side',
      cell: () => ``,
    },
    {
      columnDef: 'size',
      header: 'Size',
      cell: (element: FinancialData) => `${element.size}`,
    },
    {
      columnDef: 'open time',
      header: 'Open Time',
      cell: () => ``,
    },
    {
      columnDef: 'open price',
      header: 'Open Price',
      cell: (element: FinancialData) => `${element.openPrice}`,
    },
    {
      columnDef: 'swap',
      header: 'Swap',
      cell: (element: FinancialData) => `${element.swap}`,
    },

    {
      columnDef: 'profit',
      header: 'Profit',
      cell: () => `profit`,
    },
  ];
  subColumns = [
    {
      columnDef: 'symbol',
      header: 'Symbol',
      cell: () => ``,
    },
    {
      columnDef: 'order id',
      header: 'Order ID',
      cell: (element: FinancialData) => `${element.id}`,
    },
    {
      columnDef: 'side',
      header: 'Side',
      cell: (element: FinancialData) => `${element.side}`,
    },
    {
      columnDef: 'size',
      header: 'Size',
      cell: (element: FinancialData) => `${element.size}`,
    },
    {
      columnDef: 'open time',
      header: 'Open Time',
      cell: (element: FinancialData) => `${element.openTime}`,
    },
    {
      columnDef: 'open price',
      header: 'Open Price',
      cell: (element: FinancialData) => `${element.openPrice}`,
    },
    {
      columnDef: 'swap',
      header: 'Swap',
      cell: (element: FinancialData) => `${element.swap}`,
    },

    {
      columnDef: 'profit',
      header: 'Profit',
      cell: () => `profit`,
    },
  ];
  displayedMainColumns = this.mainColumns.map((c) => c.columnDef);
  displayedSubColumns = this.subColumns.map((c) => c.columnDef);
  newArr: any[] = [];
  symbol: string = '';
  size: number = 0;
  openPrice: number = 0;
  swap: number = 0;

  ngOnInit() {
    this.dataTableService.getFinancialData().pipe(
      map((res) => [...res.data]),
      mergeMap(res => res),
      tap(res => console.log(2,res)),
      groupBy(res => res.symbol),
      tap(res => console.log(3,res)),
      mergeMap(group => {
        return group.pipe(toArray())
      }),
      tap(res => {
        console.log(4,res)
        let newObj;
        let size: number = 0;
        let openPrice: number = 0;
        let swap: number = 0;
        res.forEach(it => {
          newObj = {
            symbol: this.symbol = it.symbol,
            size: size += it.size,
            openPrice: openPrice += it.openPrice,
            swap: swap += it.swap,
            details: res
          }
        })
        this.newArr.push(newObj);
        this.mainDataSource = this.newArr;
        this.subDataSource = newObj!.details;
        console.log("subDataSource",this.subDataSource)
        console.log("mainDataSource",this.mainDataSource)
      })
    )
    .subscribe();
  }
}
