import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public aSendObj: any;
  private para;

  constructor(private http: HttpClient) {
    this.para = '?Database=' + environment.database + '&Collection=config';
  }

  public getData() {
    return this.http.get(
      environment.aBaseUrl + 'RestAPIMongoDB' + this.para + '&id=' + '5d80a55e7561f2001712e65c'
    );
  }

  public createData(data) {
    // console.log(data);
    return this.http.post(
      environment.aBaseUrl + 'RestAPIMongoDB' + this.para,
      JSON.stringify(data),
      httpOptions
    );
  }

  public updateData(data) {
    // console.log(id + ' - '+ data);
    return this.http.put(
      environment.aBaseUrl + 'RestAPIMongoDB' + this.para + '&id=' + '5d80a55e7561f2001712e65c',
      JSON.stringify(data),
      httpOptions
    );
  }

}
