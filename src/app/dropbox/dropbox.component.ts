import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { HttpResponse, HttpEventType } from "@angular/common/http";

import { DropboxService } from "./dropbox.service";
import { AlertService } from "../service/alert.service";

// https://material.io/resources/icons/?style=baseline

@Component({
  selector: "app-dropbox",
  templateUrl: "./dropbox.component.html",
  styleUrls: ["./dropbox.component.css"]
})
export class DropboxComponent implements OnInit {
  driveFileList: any;
  private aBaseUrl = environment.aBaseUrl;
  pathArr = [];
  folderName = "";
  createNewfolderName = "";
  isUploading = false;

  constructor(
    private router: Router,
    private aService: DropboxService,
    private alertService: AlertService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.driveFileList = [];
    this.getdriveFileList(null);
  }

  getdriveFileList(dataObj) {
    this.folderName = "";
    if (dataObj === null) {
      this.pathArr = [];
      this.pathArr.push({ name: "./", path: "" });
    } else {
      // this.pathArr.push({name: dataObj['name'], path: dataObj['path_display']});
      this.folderName = dataObj["path_display"];
      const tempArr = this.folderName.split("/");
      this.pathArr = [];
      // for (let tempName of tempArr) {
      for (let i = 0; i < tempArr.length; i++) {
        let tempName = tempArr[i];
        if (tempName === "") {
          tempName = "./";
        }
        let c = this.folderName.split("/", i + 1).join();
        // console.log(i + '--> ' + c.replace(new RegExp(',', 'g'), '/')) ;
        this.pathArr.push({
          name: tempName,
          path: c.replace(new RegExp(",", "g"), "/")
        });
      }
    }
    // console.log(this.pathArr);
    // console.log(folderName);
    this.aService.getdriveFileList(this.folderName).subscribe(data => {
      this.driveFileList = data;
    });
  }

  selectpath(pathObj) {
    const str: any = pathObj["path"].substring(1);
    // console.log('selectpath ' + str);
    if (str === "") {
      this.getdriveFileList(null);
    } else {
      this.getdriveFileList({ path_display: "/" + str });
    }
  }

  dropboxDownloadFileName(dataObj) {
    if (dataObj[".tag"] === "folder") {
      this.getdriveFileList(dataObj);
    } else if (dataObj[".tag"] === "file") {
      this.aService.fileDownload(dataObj["path_display"]).subscribe(data => {
        window.location.href = data["url"];
      });
    } else {
      alert(
        "Something Went wrong with to download " + dataObj["name"] + " file !"
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
      let fName = "";
      if (this.folderName.startsWith("/")) {
        fName = this.folderName.substr(1);
      }
      if (this.createNewfolderName.length > 1) {
        fName = fName + "/" + this.createNewfolderName;
      }
      this.currentFileUpload = this.selectedFiles.item(0);
      this.aService
        .uploadFile(this.currentFileUpload, fName)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            // console.log('File is completely uploaded!');
            this.createNewfolderName = "";
            this.alertService.toastrSuccess("File is uploaded!");
            this.isUploading = false;
            this.progress.percentage = 0;
            this.currentFileUpload = undefined;
            this.selectedFiles = undefined;

            this.getdriveFileList({ path_display: this.folderName });
          }
        });
    } catch (error) {
      console.error(error);
      this.alertService.toastrError("Upload failed! Please try again.");
      this.isUploading = false;
    }
    this.selectedFiles = undefined;
  }

  deleteFile(fileName) {
    let fName = "";
    if (fileName.startsWith("/")) {
      fName = fileName.substr(1);
    }
    this.aService.deleteFile(fName).subscribe(data => {
      // console.log(data);
      this.alertService.toastrSuccess("File is Deleted!");
      this.getdriveFileList({ path_display: this.folderName });
    });
  }

  infoFile(fileName) {
    fileName = fileName.substr(1);
    this.aService.getdriveFileInfo(fileName).subscribe(data => {
      if (data != null && data != undefined) {
        const infodialogRef = this.dialog.open(InfoDialog, {
          width: "350px",
          data: data,
        });
      }
    });
  }

  newFolder(): void {
    const dialogRef = this.dialog.open(CreateFolderDialog, {
      width: "250px",
      data: { foldername: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        // console.log(result);
        this.createNewfolderName = result;
      }
    });
  }

  removeFolder() {
    this.createNewfolderName = "";
  }
}

// https://stackblitz.com/angular/dqvgjovbapv?file=main.ts
@Component({
  selector: "create-folder-dialog",
  templateUrl: "create-folder-dialog.html"
})
export class CreateFolderDialog {
  constructor(
    public dialogRef: MatDialogRef<CreateFolderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "info-dialog",
  templateUrl: "info-dialog.html"
})
export class InfoDialog {
  constructor(
    public infodialogRef: MatDialogRef<InfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: InfoDialogData
  ) {}

  onNoClick(): void {
    this.infodialogRef.close();
  }
}

export interface DialogData {
  foldername: string;
}

export interface InfoDialogData {
  data: object;
}
