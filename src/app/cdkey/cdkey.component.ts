import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-cdkey',
  templateUrl: './cdkey.component.html',
  styleUrls: ['./cdkey.component.css'],
  providers: [MessageService]
})
export class CdkeyComponent {

  isLoading = false;
  machineNumber = '';
  cdkeyNumber = '';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getServerCheck();
  }

  getCdKey() {

    // 依據前次後端設計：必須準備要傳入的 Payload (Request Body)
    const payload = {
      MachineId: this.machineNumber // 替換成您實際裝載機碼的變數
    };

    // 依據前次後端設計：使用 POST 方法，並指定正確的路由
    this.http.post<any>('https://shawnyendemo.onrender.com/api/PoeCdkey/generate', payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.cdkeyNumber = response.key;
        console.log(response.key);
        console.log(this.messageService);
        this.messageService.add({ severity: 'success', summary: 'success', detail: "序號產生成功" });
      },
      error: (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;

        // 如果機碼格式錯誤，後端會回傳 BadRequest(字串)
        // 把後端給的錯誤訊息 (error.error) 顯示出來
        let errorMsg = '產生序號失敗';
        if (typeof error.error === 'string') {
          errorMsg = error.error;
        }

        this.messageService.add({ severity: 'error', summary: 'error', detail: errorMsg });
      }
    });
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
