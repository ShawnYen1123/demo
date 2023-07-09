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

  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getServerCheck();
  }

  getServerCheck() {
    this.http.get('https://shawnyendemo.onrender.com/CheckServer', { responseType: 'text' }).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('發生錯誤:', error);
        this.messageService.add({ severity: 'info', summary: 'info', detail: error });
      }
    );
  }
}
