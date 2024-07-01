import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse, FinancialDataDetail } from "../../shared/data-table/financial-data";
import { API_URL } from "../../const/urls";

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  constructor(private http: HttpClient) {}

  getFinancialData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(API_URL, {});
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
}
