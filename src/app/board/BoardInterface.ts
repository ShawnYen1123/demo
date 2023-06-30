export interface Message{
  title:string;
  content:string;
  date:Date;
}

export interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
