import { Component } from '@angular/core';
import { Message, PageEvent } from './BoardInterface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [MessageService]
})
export class BoardComponent {
  date: Date = new Date;
  messageList: Message[] = [];
  contentInput: string = '';
  titleInput: string = '';
  isCreate = false;
  isEdit = false;
  editIndex = -1;
  stringFromBrowser = '';
  pageData: PageEvent = {
    first: 0, //起始index
    rows: 5, //一頁有幾個
    page: 0,
    pageCount: 1
  };
  messageListForShow: Message[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.getDataFromBrowser();
    // 初始設定分頁資訊
    const itemNumbers = this.messageList.length;
    if (itemNumbers % this.pageData.rows === 0) {
      this.pageData.pageCount = itemNumbers % this.pageData.rows;
    } else {
      this.pageData.pageCount = itemNumbers % this.pageData.rows + 1;
    }
    this.getMessageListForShow();
  }

  createMessage() {
    this.isEdit = false;
    this.isCreate = true;
    this.titleInput = '';
    this.contentInput = '';
  }

  confirm() {
    if (this.titleInput.trim() == '' || this.contentInput.trim() == '') {
      this.showToast('info', '標題及內容不得為空白');
      return;
    }
    this.messageList.unshift({
      title: this.titleInput,
      content: this.contentInput,
      date: new Date
    });
    this.isCreate = false;
    this.showToast('success', '留言新增成功');
    this.setDataToBrowser();
    this.getMessageListForShow();
  }

  cancel() {
    this.isCreate = false;
    this.isEdit = false;
    this.titleInput = '';
    this.contentInput = '';
  }

  showToast(type: string, content: string) {
    this.messageService.add({ severity: type, summary: 'Success', detail: content });
  }

  edit(index: number) {
    this.isEdit = true;
    this.titleInput = this.messageList[index].title;
    this.contentInput = this.messageList[index].content;
    this.editIndex = index;
  }

  confirmEdit() {
    if (this.titleInput.trim() == '' || this.contentInput.trim() == '') {
      this.showToast('info', '標題及內容不得為空白');
      return;
    }
    this.messageList[this.editIndex].content = this.contentInput;
    this.messageList[this.editIndex].date = new Date;
    this.messageList[this.editIndex].title = this.titleInput;
    this.isEdit = false;
    this.showToast('success', '留言編輯成功');
    this.setDataToBrowser();
  }

  deleteMessage(index: number) {
    this.messageList.splice(index, 1);
    this.showToast('success', '留言刪除成功');
    this.setDataToBrowser();
    this.getMessageListForShow();
  }

  setDataToBrowser() {
    let data = JSON.stringify(this.messageList);
    localStorage.setItem('message', data);
  }

  getDataFromBrowser() {
    const data = localStorage.getItem('message');
    if (data !== null) {
      const messageList = JSON.parse(data);
      this.messageList = messageList;
    }
  }

  onPageChange(event: any) {
    console.log(event);
    this.pageData.first = event.first;
    this.pageData.page = event.page;
    this.getMessageListForShow();
  }

  getMessageListForShow() {
    this.messageListForShow = [];
    //處理分頁後呈現的資料
    for (let i = this.pageData.first; i <= this.pageData.first + this.pageData.rows - 1; i++) {
      if (this.messageList[i]) {
        this.messageListForShow.push(this.messageList[i]);
      }
    }
  }

}
