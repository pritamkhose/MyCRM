import { Injectable } from '@angular/core';
import { LocalStorage, SharedStorage } from 'ngx-store';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  @LocalStorage() aList = new Object();
  @LocalStorage() username;
  @LocalStorage() email;
  @LocalStorage() token;
  @LocalStorage() socialLogin;

  // https://stackoverflow.com/questions/37662456/angular-2-output-from-router-outlet/41989983
  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  // Service message commands
  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  constructor() {}

  public clearAll() {
    this.aList = [];
    this.username = null;
    this.email = null;
    this.token = null;
    this.emitChange(null);
    this.socialLogin = null;
  }

  public clearLogin() {
    this.username = null;
    this.email = null;
    this.token = null;
    this.emitChange(null);
    this.socialLogin = null;
  }

  public setLogin(user: string, email: string, token: string) {
    this.username = user;
    this.email = email;
    this.token = token;
  }

  public getUser() {
    return this.username;
  }

  public setUser(user: string) {
    this.username = user;
  }

  public getEmail() {
    return this.email;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public getToken() {
    return this.token;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public getSaveList() {
    return this.aList;
  }

  public setSaveList(aList: object) {
    this.aList = aList;
  }

  public clearSaveList() {
    this.aList = [];
  }

  public getSocialLogin() {
    return this.socialLogin;
  }

  public setSocialLogin(aobj: object) {
    this.socialLogin = aobj;
  }

}
