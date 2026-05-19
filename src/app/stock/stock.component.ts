import { Component, OnInit } from '@angular/core';
import { Stock, StockInfoData } from './StockInterface';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FileServiceService } from '../service/file-service.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers: [MessageService]
})
export class StockComponent implements OnInit {
  isLoading = false;
  newStock = '';
  selectedStock: any[] = [];
  isChooseAll = false;
  stockInfoDatas: StockInfoData[] = [];
  stockList: Stock[] = [];

  // API 基礎網址
  private apiUrl = 'https://shawnyendemo.onrender.com/api/StockList';

  constructor(
    private messageService: MessageService, 
    private http: HttpClient, 
    private fileService: FileServiceService
  ) { }

  ngOnInit(): void {
    this.getDataFromDatabase();
  }

  // ==== 取得資料 (GET) ====
  getDataFromDatabase() {
    this.isLoading = true;
    this.http.get<Stock[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.stockList = response;
      },
      error: (err) => {
        console.error('發生錯誤:', err);
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '無法取得股票清單' });
      }
    });
  }

  // ==== 新增股票 (POST) ====
  createStock() {
    const id = this.newStock.substring(0, 4).trim();
    const name = this.newStock.substring(4).trim();
    const idRegex = /^\d{4}$/;
    const nameRegex = /^[\u4e00-\u9fa5]+$/;

    if (!id.match(idRegex) || !name.match(nameRegex)) {
      this.messageService.add({ severity: 'info', summary: 'info', detail: '輸入請遵循格式(ex:2303聯電)' });
      return;
    }

    this.isLoading = true;
    const requestStock = { stockId: id, stockName: name };

    this.http.post<Stock>(this.apiUrl, requestStock).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'success', detail: '股票新增成功' });
        this.newStock = '';
        this.getDataFromDatabase(); // 新增後重新拉取清單
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        const errorMsg = err.status === 409 ? '此股票已經在追蹤清單中' : '新增失敗';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
      }
    });
  }

  // ==== 刪除股票 (DELETE) ====
  deleteStock(index: number) {
    // 這裡使用資料庫產生的整數 id 來進行刪除
    const targetId = this.stockList[index].id; 
    
    if (!targetId) {
      console.error('找不到這檔股票的資料庫 Id');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '資料異常，無法刪除' });
      return;
    }

    this.isLoading = true;
    this.http.delete(`${this.apiUrl}/${targetId}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'success', detail: '股票刪除成功' });
        this.getDataFromDatabase(); // 刪除後重新拉取清單
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '刪除失敗' });
      }
    });
  }

  chooseAll() {
    if (this.isChooseAll) {
      this.selectedStock = [...this.stockList];
    } else {
      this.selectedStock = [];
    }
  }

  // 爬蟲取得股票資訊API---
  getStockInfo() {
    if (this.selectedStock.length === 0) return;
    this.isLoading = true;
    this.http.post<any>('https://shawnyendemo.onrender.com/api/StockInfo', this.selectedStock).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.stockInfoDatas = response;
      },
      error: (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      }
    });
  }
  // 通知API
  notifyStockInfo() {
    if (this.selectedStock.length === 0) return;
    this.isLoading = true;
    this.http.post('https://shawnyendemo.onrender.com/api/StockInfoNotify', this.selectedStock, { responseType: 'text' }).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'success', detail: "傳送成功" });
      },
      error: (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      }
    });
  }

  download() {
    this.fileService.downloadFile('stockList.json'); 
  }
}