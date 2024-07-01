import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FinancialData, FinancialDataDetail } from './financial-data';
import { DataTableService } from '../../services/api/data-table.service';
import { groupBy, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { CommonModule, formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { convertStringToNumber, handleSnackBar } from '../../utils/utils';

//---------------------------------------------------------------------------------

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CommonModule],
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
  constructor(
    private dataTableService: DataTableService,
    private _snackBar: MatSnackBar
  ) {}
  @ViewChild('mainTable') mainTable: MatTable<FinancialDataDetail> | undefined;
  @ViewChildren('subTables') subTables:
    | QueryList<MatTable<FinancialDataDetail>>
    | undefined;
  mainDataSource: any[] = [];
  subDataSource: FinancialDataDetail[] = [];
  expandedElement: FinancialDataDetail | null | undefined;
  mainColumns = [
    {
      columnDef: 'expand',
      header: '',
      cell: () => ``,
    },
    {
      columnDef: 'symbol',
      header: 'Symbol',
      cell: (element: FinancialDataDetail) => `${element.symbol}`,
    },
    {
      columnDef: 'symbol details length',
      header: '',
      cell: (element: any) => `${element.details.length}`,
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
      cell: (element: FinancialDataDetail) => `${element.size}`,
    },
    {
      columnDef: 'open time',
      header: 'Open Time',
      cell: () => ``,
    },
    {
      columnDef: 'open price',
      header: 'Open Price',
      cell: (element: any) => {
        const averageOpenPrice =
          this.calculateSum(element, 'open price') / element.details.length;
        return averageOpenPrice.toFixed(4);
      },
    },
    {
      columnDef: 'swap',
      header: 'Swap',
      cell: (element: FinancialDataDetail) => `${element.swap}`,
    },
    {
      columnDef: 'profit',
      header: 'Profit',
      cell: (element: any) => {
        const averageProfit =
          this.calculateSum(element, 'profit') / element.details.length;
        return averageProfit.toFixed(4);
      },
    },
    {
      columnDef: 'remove',
      header: '',
      cell: () => ``,
    },
  ];
  subColumns = [
    {
      columnDef: 'expand',
      header: '',
      cell: () => ``,
    },
    {
      columnDef: 'symbol',
      header: 'Symbol',
      cell: () => ``,
    },
    {
      columnDef: 'symbol details length',
      header: '',
      cell: () => ``,
    },
    {
      columnDef: 'order id',
      header: 'Order ID',
      cell: (element: FinancialDataDetail) => `${element.id}`,
    },
    {
      columnDef: 'side',
      header: 'Side',
      cell: (element: FinancialDataDetail) => `${element.side}`,
    },
    {
      columnDef: 'size',
      header: 'Size',
      cell: (element: FinancialDataDetail) => `${element.size}`,
    },
    {
      columnDef: 'open time',
      header: 'Open Time',
      cell: (element: FinancialDataDetail) => {
        const formattedDate = formatDate(
          element.openTime,
          'dd.MM.yyyy hh:mm:ss',
          'pl_PL'
        );
        return formattedDate;
      },
    },
    {
      columnDef: 'open price',
      header: 'Open Price',
      cell: (element: FinancialDataDetail) => `${element.openPrice}`,
    },
    {
      columnDef: 'swap',
      header: 'Swap',
      cell: (element: FinancialDataDetail) => `${element.swap}`,
    },

    {
      columnDef: 'profit',
      header: 'Profit',
      cell: (element: FinancialDataDetail) => {
        const profit = this.calculateProfit(
          element.closePrice,
          element.openPrice,
          element.symbol,
          element.side
        );
        return profit.toFixed(4);
      },
    },
    {
      columnDef: 'remove',
      header: '',
      cell: () => ``,
    },
  ];
  displayedMainColumns = this.mainColumns.map((c) => c.columnDef);
  displayedSubColumns = this.subColumns.map((c) => c.columnDef);
  newArr: FinancialData[] = [];
  symbol: string = '';
  size: number = 0;
  openPrice: number = 0;
  swap: number = 0;

  ngOnInit() {
    this.dataTableService
      .getFinancialData()
      .pipe(
        map((res) => [...res.data]),
        mergeMap((res) => res),
        groupBy((res) => res.symbol),
        mergeMap((group) => {
          return group.pipe(toArray());
        }),
        tap((res) => {
          let newObj: FinancialData = {
            id: undefined,
            symbol: undefined,
            size: undefined,
            swap: undefined,
            details: undefined,
          };
          let id: number = 0;
          let size: number = 0;
          let swap: number = 0;
          res.forEach((it) => {
            newObj = {
              id: id++,
              symbol: (this.symbol = it.symbol),
              size: (size += it.size),
              swap: (swap += it.swap),
              details: res,
            };
          });
          this.newArr.push(newObj);
          this.mainDataSource = this.newArr;
          this.subDataSource = newObj.details!;
        })
      )
      .subscribe();
  }

  calculateMultiplier(symbol: string): number {
    let multiplier: number = 0;
    switch (symbol) {
      case 'BTCUSD':
        multiplier = 2;
        break;
      case 'ETHUSD':
        multiplier = 3;
        break;
      default:
        multiplier = 1;
    }
    return multiplier;
  }

  calculateSideMultiplier(side: string): number {
    let sideMultiplier: number = 0;
    switch (side) {
      case 'BUY':
        sideMultiplier = 1;
        break;
      default:
        sideMultiplier = -1;
    }
    return sideMultiplier;
  }

  calculateProfit(
    closePrice: number,
    openPrice: number,
    symbol: string,
    side: string
  ): number {
    const calculatedProfit =
      ((closePrice - openPrice) *
        this.calculateMultiplier(symbol) *
        this.calculateSideMultiplier(side)) /
      100;
    return calculatedProfit;
  }

  calculateSum(element: any, title: string): number {
    let sum: number = 0;
    element.details.forEach((detail: FinancialDataDetail) => {
      if (title === 'profit') {
        const calculatedProfit = this.calculateProfit(
          detail.closePrice,
          detail.openPrice,
          detail.symbol,
          detail.side
        );
        sum += calculatedProfit;
      } else {
        sum += detail.openPrice;
      }
    });
    return sum;
  }

  removeMainDataRow(row: FinancialData) {
    const ids = row.details!.map((detail: FinancialDataDetail) => detail.id);
    this.mainDataSource.splice(
      this.mainDataSource.map((item) => item.id).indexOf(row.id),
      1
    );
    this.mainTable!.renderRows();
    this.openSnackBar(ids.toString());
  }

  removeSubDataRow(id: number, element: FinancialData, row: FinancialDataDetail) {
    element.details!.splice(
      element.details!.map((item: FinancialDataDetail) => item.id).indexOf(id),
      1
    );
    this.subTables?.forEach((table) => table.renderRows());
    if (!element.details!.length) {
      this.removeMainDataRow(element);
    }
    this.openSnackBar(row.id.toString());
  }

  openSnackBar(ids: string) {
    handleSnackBar(this._snackBar, ids);
  }

  strToNo(data: string): number {
    return convertStringToNumber(data);
  }
}
