import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [MessageService]
})
export class IndexComponent {
  // private intervalId: any; // 儲存 setInterval() 回傳的 ID
  isLoading = false;
  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getServerCheck();
    // 設置定時器，每隔 10 分鐘觸發一次
    // setInterval(() => {
    //   this.getServerCheck();
    // }, 600000); // 600,000 毫秒，即每 10 分鐘觸發一次
  }

  ngOnDestroy() {
    // 在組件被銷毀時，停止定時器
    // if (this.intervalId) {
    //   clearInterval(this.intervalId);
    // }
  }

  getServerCheck() {
    this.isLoading = true;
    this.http.get('https://shawnyendemo.onrender.com/CheckServer', { responseType: 'text' }).subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
      },
      (error) => {
        console.error('發生錯誤:', error);
        this.messageService.add({ severity: 'info', summary: 'info', detail: error });
      }
    );
  }
}
