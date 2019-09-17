import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropboxService {

  constructor(private http: HttpClient) {}

  // private appPath = 'mycrm/';
  private aBaseUrl = environment.aBaseUrl;

  public getdriveFileList(folderName) {
    // console.log('get drive File List --> ' + this.aBaseUrl + 'dropboxListFiles?folder=' + folderName);
    return this.http.get(this.aBaseUrl + 'dropboxListFiles?folder=' +  folderName);
  }

  public fileDownload(filePath) {
    // console.log('get File --> ' + this.aBaseUrl + 'dropboxDownload?fileName=' + filePath);
    return this.http.get(this.aBaseUrl + 'dropboxDownload?fileName=' + filePath);
  }

  public deleteFile(fileName) {
    // console.log('get drive File Delete --> ' + this.aBaseUrl + 'dropboxDelete?fileName=' + fileName);
    return this.http.delete(this.aBaseUrl + 'dropboxDelete?fileName=' + fileName);
  }

  public uploadFile(file: File, folderName): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    // console.log(this.aBaseUrl + 'dropboxUpload?folder=' + folderName);
    const req = new HttpRequest('POST', this.aBaseUrl + 'dropboxUpload?folder=' + folderName , formdata, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

}
