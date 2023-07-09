export interface Stock{
  stockName:string;
  stockId:string;
}


export interface StockInfoData{
  stockName:string;
  stockId:string;
  stockInfoList:StockInfo[]
}

export interface StockInfo{
  year:string;
  rightDate:string;
  dividendDate:string;
  exprice:string;
  stockDividend:string;
  cashDividend:string;
  cashDividendYield:string;
}
