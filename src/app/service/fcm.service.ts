
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';

const headerDict = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
  Authorization: 'key=AAAA-CBpE6c:APA91bEt7era5ur9lpyeKllap3qYnxnR7EULiB81q84xneudea4fLH3OF3hhfq1GiKWdR7HhVFZqTqXGvNLOYBco3IejDcJW0cVDMTDyYOFV73OWt_YuxFOnGtEbWAlGjrWgiNwQuoobGnCpM4sT43lC80n-KL5Keg',
};

const requestOptions = {
  headers: new Headers(headerDict),
};

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private http: HttpClient) {}

  private aBaseUrl = 'https://fcm.googleapis.com/fcm/send';

  public sendFCM(atitle: string, abody: string, token: string) {
    const data = {
      registration_ids: token,
      priority: 'high',
      notification: {
        title: atitle, // 'Pritam Multiple Notification',
        body: abody, // 'Pritam is Very Very Happy with FCM!'
        },
      data: {
        'Key-1': 'JSA Data 1',
        'Key-2': 'JSA Data 2',
        'Key-3': 'JSA Data 3'
        }
    };

    // https://github.com/pritamkhose/MyAppFCM/blob/master/FCM.postman_collection.json

    console.log(JSON.stringify(data));
    return this.http.post(this.aBaseUrl , data , httpOptions);
  }
}
