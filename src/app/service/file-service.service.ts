import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FileServiceService {

  constructor(private http: HttpClient) { }
  downloadFile(fileName:string): void {
    const url = 'https://shawnyendemo.onrender.com/api/Files/'+fileName; // 替換為實際的下載檔案 API 網址

    const options = {
      responseType: 'blob' as 'json', // 設定回應類型為 Blob
      headers: new HttpHeaders().append('Content-Type', 'application/json'), // 根據 API 需求設定標頭
    };

    this.http.get(url, options).subscribe(
      (response:any) => {
        FileSaver(response, fileName); // 使用 file-saver 套件下載檔案
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
