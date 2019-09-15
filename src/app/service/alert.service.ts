import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AlertService {

  constructor(private toastr: ToastrService, ) { }

  toastrSuccess(message: string) {
    this.toastr.success('', message, {
      timeOut: 5000,
    });
  }

  toastrWarning(message: string) {
    this.toastr.warning('', message, {
      timeOut: 5000,
    });
  }

  toastrError(message: string) {
    this.toastr.error('', message, {
      timeOut: 5000,
    });
  }

}