export interface ApiResponse {
  data: FinancialDataDetail[];
}

export interface FinancialData {
  id: number | undefined;
  swap: number | undefined;
  symbol: string | undefined;
  size: number | undefined;
  details: FinancialDataDetail[] | undefined;
}

export interface FinancialDataDetail {
  openTime: number;
  openPrice: number;
  swap: number;
  closePrice: number;
  id: number;
  symbol: string;
  side: string;
  size: number;
}
