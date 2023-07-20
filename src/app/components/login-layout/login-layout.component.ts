import {Component, OnInit} from '@angular/core';
import {AuthStatesService} from "../../services/auth-states.service";
import {Router} from "@angular/router";
import {SocialAuthService} from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {
  constructor(private authStates: AuthStatesService, private authService: SocialAuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.authStates.user = user
      this.authStates.loggedIn = (user != null)
      if(user){
        this.router.navigate(['/'])
        this.authStates.signedIn()
      }
    })
  }
}
