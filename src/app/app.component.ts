import {Component} from '@angular/core';
import {AuthStatesService} from "./services/auth-states.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public authStates: AuthStatesService) { }

}
