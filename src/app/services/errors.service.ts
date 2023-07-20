import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface Error {
  message: string,
  code: number,
  status: string
}
@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor() { }

  private errorMessageSubject:BehaviorSubject<Error | null> = new BehaviorSubject<Error | null>(null)
  public errorMessage$:Observable<Error | null>  = this.errorMessageSubject.asObservable()

  setError(errorMessage: Error | null) {
    this.errorMessageSubject.next(errorMessage)
  }

  clearError() {
    this.errorMessageSubject.next(null)
  }
}
