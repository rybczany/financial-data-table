import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FinancialData } from "../../shared/data-table/financial-data";
// import { API_URL } from "../../const/urls";

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  constructor(private http: HttpClient) {}

  getFinancialData(): Observable<any> {
    return this.http.get<any>('https://geeksoft.pl/assets/order-data.json', {});
  }
}
