export interface Message {
  title: string;
  content: string;
  date: Date;
}

export interface MessageForShow extends Message {
  id: number;
}

export interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
