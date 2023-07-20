import {inject, Injectable, OnInit} from '@angular/core';
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {BehaviorSubject, lastValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthStatesService {
  user: SocialUser
  loggedIn: boolean
  constructor(private authService: SocialAuthService, private router: Router) {
  }

  private isLoggedInBehavior$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public isLoggedIn$: Observable<boolean> = this.isLoggedInBehavior$.asObservable()

  signedIn() {
    this.isLoggedInBehavior$.next(true)
  }

  signedOut() {
    this.isLoggedInBehavior$.next(false)
  }

  redirectSignOut() {
    this.authService.signOut()
    this.router.navigate(['auth'])
  }
}

export const canActivateAuth: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    if (inject(AuthStatesService).loggedIn) {
      return true
    } else {
      inject(AuthStatesService).redirectSignOut()
      return false
    }
  }
