import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { AlertService } from './service/alert.service';

// https://www.npmjs.com/package/ngx-toastr
// https://stackblitz.com/edit/ngx-toastr-angular2
// https://stackblitz.com/edit/ngx-toast-notification

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MyCRM';
  isConnected = true;
  online: any;
  onlinecount = 0;

  constructor(private updates: SwUpdate, private alertService: AlertService) {
    updates.available.subscribe(event => {
      console.log('update app Logic -->' + new Date().toString());
      updates.activateUpdate().then(() => document.location.reload());
    });

    this.online = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );

    this.online.subscribe(isOnline => {
      if (isOnline) {
        this.isConnected = true;
        if (this.onlinecount > 0) {
          this.alertService.toastrOnline('Great, You are online!');
        }
      } else {
        console.log('you are offline');
        this.alertService.toastrOffline('You are offline!');
        this.isConnected = false;
        this.onlinecount++;
      }
    });
  }
}
