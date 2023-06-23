import { Component } from '@angular/core';
import { Message } from './BoardInterface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
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
  isShowEdit = false;

  ngOnInit(): void {


  }

  createMessage(){
    this.isShowEdit = true;
    this.titleInput='';
    this.contentInput='';
  }

  confirm(){
    if(this.titleInput== ''||this.contentInput== ''){
      return;
    }
     this.messageList.unshift({
      title: this.titleInput,
      content: this.contentInput,
      date: new Date
     });
     this.isShowEdit = false;
  }


}
