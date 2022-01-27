import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginService } from './shared/services/login.service';
import { SignalRService } from './shared/services/signal-r.service';
import { AuthState, setCurrentUser } from './store/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor
  (
    private store: Store<AuthState>,
    private loginService: LoginService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addAddingCountryListener();
    this.signalRService.addAddingCityListener();

    if(this.loginService.isLogin()) {
      try {
        let user = this.loginService.getUser();
        this.store.dispatch(setCurrentUser({user: user}));
      }
      catch(error){
        
      }
    }
  }

  title = 'car-rental-system';
}