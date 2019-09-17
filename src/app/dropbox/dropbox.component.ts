import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpResponse, HttpEventType } from '@angular/common/http';

import { DropboxService } from './dropbox.service';
import { AlertService } from '../service/alert.service';

@Component({
  selector: 'app-dropbox',
  templateUrl: './dropbox.component.html',
  styleUrls: ['./dropbox.component.css']
})
export class DropboxComponent implements OnInit {
  driveFileList: any;
  private aBaseUrl = environment.aBaseUrl;
  pathArr = [];
  folderName = '';
  isUploading = false;

  constructor(private router: Router, private aService: DropboxService, private alertService: AlertService) { }

  ngOnInit() {
    this.driveFileList = [];
    this.getdriveFileList(null);
  }

  getdriveFileList(dataObj) {
    this.folderName = '';
    if (dataObj === null) {
      this.pathArr = [];
      this.pathArr.push({ name: './', path: '' });
    } else {
      // this.pathArr.push({name: dataObj['name'], path: dataObj['path_display']});
      this.folderName = dataObj['path_display'];
      const tempArr = this.folderName.split('/');
      this.pathArr = [];
      // for (let tempName of tempArr) {
      for (let i = 0; i < tempArr.length; i++) {
        let tempName = tempArr[i];
        if (tempName === '') {
          tempName = './';
        }
        let c = this.folderName.split('/', i + 1).join();
        // console.log(i + '--> ' + c.replace(new RegExp(',', 'g'), '/')) ;
        this.pathArr.push({
          name: tempName,
          path: c.replace(new RegExp(',', 'g'), '/')
        });
      }
    }
    // console.log(this.pathArr);
    // console.log(folderName);
    this.aService
      .getdriveFileList(this.folderName)
      .subscribe((data) => {
        this.driveFileList = data;
      });
  }

  selectpath(pathObj) {
    const str: any = pathObj['path'].substring(1);
    // console.log('selectpath ' + str);
    if (str === '') {
      this.getdriveFileList(null);
    } else {
      this.getdriveFileList({ path_display: '/' + str });
    }
  }

  dropboxDownloadFileName(dataObj) {
    if (dataObj['.tag'] === 'folder') {
      this.getdriveFileList(dataObj);
    } else if (dataObj['.tag'] === 'file') {
      this.aService.fileDownload(dataObj['path_display'])
        .subscribe((data) => {
          window.location.href = data['url'];
        });
    } else {
      alert(
        'Something Went wrong with to download ' + dataObj['name'] + ' file !'
      );
    }
  }

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  selectFile(event) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
    if (this.selectedFiles.length > 0) {
      this.isUploading = true;
    } else {
      this.isUploading = false;
    }
  }

  upload() {
    try {
      this.progress.percentage = 0;
      let fName = '';
      if (this.folderName.startsWith('/')) {
        fName = this.folderName.substr(1);
      }
      this.currentFileUpload = this.selectedFiles.item(0);
      this.aService.uploadFile(this.currentFileUpload, fName).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event instanceof HttpResponse) {
          // console.log('File is completely uploaded!');
          this.alertService.toastrSuccess('File is uploaded!');
          this.isUploading = false;
          this.progress.percentage = 0;
          this.currentFileUpload = undefined;
          this.selectedFiles = undefined;

          this.getdriveFileList({ path_display: this.folderName });
        }
      });
    } catch (error) {
      console.error(error);
      this.alertService.toastrError('Upload failed! Please try again.');
      this.isUploading = false;
    }
    this.selectedFiles = undefined;
  }

  deleteFile(fileName) {
    let fName = '';
    if (fileName.startsWith('/')) {
      fName = fileName.substr(1);
    }
    this.aService.deleteFile(fName).subscribe(data => {
      // console.log(data);
      this.alertService.toastrSuccess('File is Deleted!');
      this.getdriveFileList({ path_display: this.folderName });
    });
  }
}
