import { Component, OnInit } from '@angular/core';
import { Message, MessageForShow, PageEvent } from './BoardInterface';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [MessageService]
})
export class BoardComponent implements OnInit {
  isLoading = false;
  messageList: Message[] = [];
  contentInput: string = '';
  titleInput: string = '';
  isCreate = false;
  isEdit = false;
  editIndex = -1;

  pageData: PageEvent = {
    first: 0,
    rows: 5,
    page: 0,
    pageCount: 1
  };
  messageListForShow: MessageForShow[] = [];

  // API 基礎網址設定
  private apiUrl = 'https://shawnyendemo.onrender.com/api/MessageList';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getInitDataFromServer();
  }

  // ==== 取得資料 (GET) ====
  getInitDataFromServer() {
    this.isLoading = true;
    this.http.get<Message[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageList = response;
        this.calculatePagination(); // 抽出分頁計算邏輯
        this.getMessageListForShow();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('取得資料失敗:', err);
        this.showToast('error', '無法取得留言資料');
      }
    });
  }

  // ==== 新增留言 (POST) ====
  confirm() {
    if (this.titleInput.trim() == '' || this.contentInput.trim() == '') {
      this.showToast('info', '標題及內容不得為空白');
      return;
    }

    this.isLoading = true;
    const requestMessage = {
      title: this.titleInput,
      content: this.contentInput,
      date: (new Date).toISOString()
    };

    this.http.post<Message>(this.apiUrl, requestMessage).subscribe({
      next: () => {
        this.isLoading = false;
        this.isCreate = false;
        this.showToast('success', '留言新增成功');
        this.getInitDataFromServer(); // 新增成功後，重新向資料庫拉取最新列表
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast('error', '新增失敗');
        console.error(err);
      }
    });
  }

  // ==== 編輯留言 (PUT) ====
  confirmEdit() {
    if (this.titleInput.trim() == '' || this.contentInput.trim() == '') {
      this.showToast('info', '標題及內容不得為空白');
      return;
    }

    const targetMessage = this.messageList[this.editIndex];
    if (!targetMessage.id) return; // 安全機制：確保這筆資料有資料庫的 Id

    this.isLoading = true;
    const updateRequest = {
      ...targetMessage, // 保留原本的 Id
      title: this.titleInput,
      content: this.contentInput,
      date: (new Date).toISOString()
    };

    // 發送 PUT 請求，網址帶上資料庫 Id
    this.http.put(`${this.apiUrl}/${targetMessage.id}`, updateRequest, { responseType: 'text' }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEdit = false;
        this.showToast('success', '留言編輯成功');
        this.getInitDataFromServer(); // 更新畫面
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast('error', '編輯失敗');
        console.error(err);
      }
    });
  }

  // ==== 刪除留言 (DELETE) ====
  deleteMessage(index: number) {
    const targetId = this.messageList[index].id;
    if (!targetId) return;

    this.isLoading = true;
    // 發送 DELETE 請求，網址帶上資料庫 Id
    this.http.delete(`${this.apiUrl}/${targetId}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.isLoading = false;
        this.showToast('success', '留言刪除成功');
        this.getInitDataFromServer(); // 更新畫面
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast('error', '刪除失敗');
        console.error(err);
      }
    });
  }

  // --- UI操作相關方法---
  createMessage() {
    this.isEdit = false;
    this.isCreate = true;
    this.titleInput = '';
    this.contentInput = '';
  }

  edit(index: number) {
    this.isCreate = false;
    this.isEdit = true;
    this.titleInput = this.messageList[index].title;
    this.contentInput = this.messageList[index].content;
    this.editIndex = index;
  }

  cancel() {
    this.isCreate = false;
    this.isEdit = false;
    this.titleInput = '';
    this.contentInput = '';
  }

  showToast(type: string, content: string) {
    this.messageService.add({ severity: type, summary: 'System', detail: content });
  }

  calculatePagination() {
    const itemNumbers = this.messageList.length;
    this.pageData.pageCount = Math.ceil(itemNumbers / this.pageData.rows) || 1;
  }

  onPageChange(event: any) {
    this.pageData.first = event.first;
    this.pageData.page = event.page;
    this.getMessageListForShow();
  }

  getMessageListForShow() {
    this.messageListForShow = [];
    for (let i = this.pageData.first; i <= this.pageData.first + this.pageData.rows - 1; i++) {
      if (this.messageList[i]) {
        const messageForShow: MessageForShow = {
          title: this.messageList[i].title,
          content: this.messageList[i].content,
          date: this.messageList[i].date,
          id: i // 這是用於畫面呈現的 index
        };
        this.messageListForShow.push(messageForShow);
      }
    }
  }
}
