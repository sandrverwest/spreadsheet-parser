import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Error} from "./errors.service";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private loaderSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public loader$:Observable<boolean>  = this.loaderSubject.asObservable()

  showLoader() {
    this.loaderSubject.next(true)
  }

  hideLoader() {
    this.loaderSubject.next(false)
  }
}
