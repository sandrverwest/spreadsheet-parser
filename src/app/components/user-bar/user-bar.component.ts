import {Component, Input} from '@angular/core';
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {AuthStatesService} from "../../services/auth-states.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.scss']
})
export class UserBarComponent {
  @Input() user:SocialUser

  constructor(private authService: SocialAuthService, private authStates: AuthStatesService, private router: Router) {
  }

  signOut() {
    this.authService.signOut()
    this.authStates.signedOut()
    this.router.navigate(['auth'])
    this.authStates.loggedIn = false
    localStorage.removeItem('accessToken')
  }
}
