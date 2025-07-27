import { Component } from '@angular/core';
import { Message, MessageForShow, PageEvent } from './BoardInterface';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FileServiceService } from '../service/file-service.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [MessageService]
})
export class BoardComponent {
  isLoading = false;
  date: Date = new Date;
  /*
  mokeMessageList: Message[] = [
    {
      title: '範例標題一',
      content: '範例內容一',
      date: new Date
    },
    {
      title: '範例標題二',
      content: '範例內容二',
      date: new Date
    },
    {
      title: '範例標題三',
      content: '範例內容三',
      date: new Date
    },
    {
      title: '範例標題四',
      content: '範例內容四',
      date: new Date
    },
    {
      title: '範例標題五',
      content: '範例內容五',
      date: new Date
    }];
   */

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
  messageListForShow: MessageForShow[] = [];

  constructor(private messageService: MessageService, private http: HttpClient, private fileService: FileServiceService) { }

  ngOnInit(): void {
    this.getInitDataFromServer();
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
      date: (new Date).toISOString()
    });
    this.isCreate = false;
    this.setDataToBrowser('create');
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
    this.isCreate = false;
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
    this.messageList[this.editIndex].date = (new Date).toISOString();
    this.messageList[this.editIndex].title = this.titleInput;
    this.isEdit = false;
    this.setDataToBrowser('edit');
  }

  deleteMessage(index: number) {
    this.messageList.splice(index, 1);
    this.setDataToBrowser('delete');
  }

  setDataToBrowser(type: string) {
    const request: Message[] = this.messageList;
    this.isLoading = true;
    console.log(request);
    this.http.post<string>('https://shawnyendemo.onrender.com/api/MessageList', request).subscribe(
      () => {
        this.isLoading = false;
        if (type === 'create') {
          this.showToast('success', '留言新增成功');
        } else if (type === 'delete') {
          this.showToast('success', '留言刪除成功');
        } else {
          this.showToast('success', '留言編輯成功');
        }
        this.getMessageListForShow();
      },
      (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;
        if (type === 'create') {
          this.showToast('info', '新增失敗');
        } else if (type === 'delete') {
          this.showToast('info', '刪除失敗');
        } else {
          this.showToast('info', '編輯失敗');
        }
        this.messageService.add({ severity: 'info', summary: 'info', detail: error.error });
        this.getInitDataFromServer(); // 新刪修失敗就重新撈初始資料
      }
    );

    /*
    let data = JSON.stringify(this.messageList);
    localStorage.setItem('message', data);
    this.isLoading = false;
    if (type === 'create') {
      this.showToast('success', '留言新增成功');
    } else if (type === 'delete') {
      this.showToast('success', '留言刪除成功');
    } else {
      this.showToast('success', '留言編輯成功');
    }
    this.getMessageListForShow();

    */
  }

  getInitDataFromServer() {

    this.isLoading = true;
    this.http.get<Message[]>('https://shawnyendemo.onrender.com/api/MessageList').subscribe(
      (response) => {
        this.isLoading = false;
        this.messageList = response;
        // 初始設定分頁資訊
        const itemNumbers = this.messageList.length;
        if (itemNumbers % this.pageData.rows === 0) {
          this.pageData.pageCount = itemNumbers % this.pageData.rows;
        } else {
          this.pageData.pageCount = itemNumbers % this.pageData.rows + 1;
        }
        this.getMessageListForShow();
      },
      (error) => {
        console.error('發生錯誤:', error);
        this.isLoading = false;
        this.messageService.add({ severity: 'info', summary: 'info', detail: error.error });
      }
    );

    /*
    const data = localStorage.getItem('message');
    console.log(data);
    if (data === null) {
      this.messageList = this.mokeMessageList;
    } else {
      const messageList = JSON.parse(data);
      console.log(messageList, '14564646');
      if (messageList.length === 0) {
        this.messageList = this.mokeMessageList;
      } else {
        this.messageList = messageList;
      }
    }

    this.isLoading = false;

    this.getMessageListForShow();
    */
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
        const messageForShow: MessageForShow = {
          title: this.messageList[i].title,
          content: this.messageList[i].content,
          date: this.messageList[i].date,
          id: i
        };
        this.messageListForShow.push(messageForShow);
      }
    }
  }
  download() {
    this.fileService.downloadFile('messageList.json');
  }

}
