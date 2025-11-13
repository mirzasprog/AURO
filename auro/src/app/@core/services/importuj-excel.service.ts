import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UpoladUposlenika } from '../data/uploadUposlenika';

@Injectable({
  providedIn: 'root'
})
export class ImportujExcelService {
  private readonly baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  private sendRequest<T>(verb: string, url: string, body?: Array<object>): Observable<T> {
    return this.http.request<T>(verb, url, {
      body: body
    });
  }

  private posaljiRequest<T>(verb: string, url: string, body?: object): Observable<T> {
    return this.http.request<T>(verb, url, { body: body });
  }

  public readExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const keys: any[] = json[0];
        const values: any[] = json.slice(1);
        const result = values.map((valueArray: any[]) => {
          let resultObj: any = {};
          keys.forEach((key: string, index: number) => {
            resultObj[key] = valueArray[index];
          });
          return resultObj;
        });

        resolve(result);
      };
      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  public sendToBackend(data: UpoladUposlenika[]) {
    return this.posaljiRequest<any>("POST", this.baseUrl + '/api/parcijalnaInventura/excel', data);
  }
}
