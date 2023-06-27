import { Component } from '@angular/core';
import { Message } from './BoardInterface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers:[MessageService]
})
export class BoardComponent {
  content: string = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero ';
  date: Date = new Date;
  messageList: Message[] = [
    {
      title:'標題一',
      content: '標題一內容標題一內容標題一內容標題一內容標題一內容標題一內容標題一內容標題一內容',
      date: new Date
    },
    {
      title:'標題二',
      content: '標題二內容標題二內容標題二內容標題二內容標題二內容標題二內容標題二內容標題二內容',
      date: new Date
    },
    {
      title:'標題三',
      content: '標題三內容標題三內容標題三內容標題三內容標題三內容標題三內容標題三內容標題三內容標題三內容',
      date: new Date
    }
  ];
  contentInput:string = '';
  titleInput:string = '';
  isCreate = false;
  isEdit = false;
  editIndex = -1;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {


  }

  createMessage(){
    this.isEdit=false;
    this.isCreate = true;
    this.titleInput='';
    this.contentInput='';
  }

  confirm(){
    if(this.titleInput.trim()== ''||this.contentInput.trim()== ''){
      this.showToast('info','標題及內容不得為空白');
      return;
    }
     this.messageList.unshift({
      title: this.titleInput,
      content: this.contentInput,
      date: new Date
     });
     this.isCreate = false;
     this.showToast('success','留言新增成功');
  }

  cancel(){
    this.isCreate = false;
    this.isEdit = false;
    this.titleInput='';
    this.contentInput='';
  }

  showToast(type:string, content: string){
    this.messageService.add({ severity: type, summary: 'Success', detail: content });
  }

  edit(index:number){
    this.isEdit = true;
    this.titleInput=this.messageList[index].title;
    this.contentInput=this.messageList[index].content;
    this.editIndex = index;
  }

  confirmEdit(){
    if(this.titleInput.trim()== ''||this.contentInput.trim()== ''){
      this.showToast('info','標題及內容不得為空白');
      return;
    }
    this.messageList[this.editIndex].content = this.contentInput;
    this.messageList[this.editIndex].date = new Date;
    this.messageList[this.editIndex].title = this.titleInput;
    this.isEdit = false;
    this.showToast('success','留言編輯成功');
  }

  deleteMessage(index:number){
    this.messageList.splice(index, 1);
  }


}
