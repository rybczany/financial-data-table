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
}
