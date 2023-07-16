import { Component } from '@angular/core';
import { Stock, StockInfoData } from './StockInterface';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers: [MessageService]
})
export class StockComponent {
  isLoading = false;
  newStock = '';
  selectedStock: any[] = [];
  isChooseAll = false;
  stockInfoDatas: StockInfoData[] = [];

  mokeStockList: Stock[] = [
    { stockName: '台泥', stockId: '1101' },
    { stockName: '聯電', stockId: '2303' },
    { stockName: '鴻海', stockId: '2317' },
    { stockName: '友達', stockId: '2409' },
    { stockName: '精技', stockId: '2414' },
    { stockName: '長榮', stockId: '2603' },
    { stockName: '陽明', stockId: '2609' },
    { stockName: '英濟', stockId: '3294' },
    { stockName: '鈺創', stockId: '5351' }
  ]
  stockList: Stock[] = [];


  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getDataFromBrowser();
  }

  createStock() {
    const id = this.newStock.substring(0, 4).trim();
    const name = this.newStock.substring(4).trim();
    const idRegex = /^\d{4}$/;
    const nameRegex = /^[\u4e00-\u9fa5]+$/;

    const codeMatch = id.match(idRegex);
    const nameMatch = name.match(nameRegex);

    if (codeMatch === null || nameMatch === null) {
      this.messageService.add({ severity: 'info', summary: 'info', detail: '輸入請遵循格式(ex:2303聯電)' });
    } else {
      this.stockList.push({ stockName: name, stockId: id });
      this.setDataToBrowser();
      this.messageService.add({ severity: 'info', summary: 'success', detail: '股票新增成功' });
      this.newStock = '';
    }
  }

  deleteStock(index: number) {
    this.stockList.splice(index, 1);
    this.setDataToBrowser();
    this.messageService.add({ severity: 'info', summary: 'success', detail: '股票刪除成功' });
  }

  chooseAll() {
    if (this.isChooseAll) {
      this.selectedStock = this.stockList;
    } else {
      this.selectedStock = [];
    }
  }

  getStockInfo() {
    if (this.selectedStock.length === 0) {
      return;
    }
    const request: Stock[] = this.selectedStock;
    this.isLoading = true;
    this.http.post<any>('https://shawnyendemo.onrender.com/api/StockInfo', request).subscribe(
      (response) => {
        this.isLoading = false;
        this.stockInfoDatas = response;
      },
      (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;
        this.messageService.add({ severity: 'info', summary: 'info', detail: error.error });
      }
    );

  }

  setDataToBrowser() {
    const request: Stock[] = this.stockList;
    this.isLoading = true;
    console.log(request);
    this.http.post<string>('https://shawnyendemo.onrender.com/api/StockList', request).subscribe(
      () => {
        this.isLoading = false;
        this.getDataFromBrowser();
      },
      (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;
        this.messageService.add({ severity: 'info', summary: 'info', detail: error.error });
      }
    );
    // let data = JSON.stringify(this.stockList);
    // localStorage.setItem('stock', data);
  }

  getDataFromBrowser() {
    this.isLoading = true;
    this.http.get<Stock[]>('https://shawnyendemo.onrender.com/api/StockList').subscribe(
      (response) => {
        this.isLoading = false;
        this.stockList = response;
      },
      (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;
        this.messageService.add({ severity: 'info', summary: 'info', detail: error.error });
      }
    );

    // const data = localStorage.getItem('stock');
    // if (data === null) {
    //   this.stockList = this.mokeStockList;
    // } else {
    //   const messageList = JSON.parse(data);
    //   if (messageList.length === 0) {
    //     this.stockList = this.mokeStockList;
    //   } else {
    //     this.stockList = messageList;
    //   }
    // }
  }
}
