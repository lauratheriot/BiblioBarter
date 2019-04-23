import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../../api.service';

import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthService {
// props
  username = '';

  isLoggedIn$ = new Subject();
  isLoggedIn: Boolean = false;
  auth0 = new auth0.WebAuth({
    clientID: 'ivIuyoWYphC-Rxf2AWNO6cl9HRID0X9x',
    domain: 'bibliobarter.auth0.com',
    responseType: 'token id_token',
    audience: 'https://bibliobarter.auth0.com/userinfo',
    redirectUri: 'http://www.bibliobarter.com/callback',
    // redirectUri: 'http://172.24.9.181:8100/callback',
    // redirectUri: 'http://18.188.132.186:8100/callback',
    scope: 'openid profile',
  });

//   client = new Auth0Cordova({
//     domain: 'YOUR_DOMAIN',
//     clientId: 'YOUR_CLIENT_ID',
//     packageIdentifier: 'YOUR_PACKAGE_ID' // found in config.xml
//   });

//   var options = {
//     scope: 'openid profile',
//     audience: 'https://YOUR_DOMAIN/userinfo'
//   };
//   var self = this;
//   client.authorize(options, function(err, authResult) {
//     if (err) {
//       console.log(err);
//       return (e.target.disabled = false);
//     }
//     localStorage.setItem('access_token', authResult.accessToken);
//     self.resumeApp();
//   });
// };

  constructor(public router: Router, public http: HttpClient, private apiService: ApiService) {
    // Check if user is logged In when Initializing
    const loggedIn = this.isLoggedIn = this.isAuthenticated();
    this.isLoggedIn$.next(loggedIn);
  }

  public login(): void {
    this.auth0.authorize();
  }

// when user is authenticated, access token is saved to local storage
// send get req to auth0 w that access token and recieve user info back
  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        const loggedIn = this.isLoggedIn = true;
        this.isLoggedIn$.next(loggedIn);
        // console.log(localStorage);
        // http req here to /userinfo to grab user prof from Auth0
        this.http.get('https://bibliobarter.auth0.com/userinfo', {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${localStorage.access_token}`, },
          }).subscribe((userInfo: any) => {
            localStorage.setItem('username', userInfo.nickname);
            this.apiService.userSignup(userInfo);
            this.router.navigate(['/Matches']);
      });
      } else if (err) {
        console.log(err);
        localStorage.loginMethod = 'login';
        const loggedIn = this.isLoggedIn = false;
        this.isLoggedIn$.next(loggedIn);
        this.router.navigate(['/Greet']);

      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    // Go back to the home route
    const loggedIn = this.isLoggedIn = false;
    this.isLoggedIn$.next(loggedIn);
  }

//  This method checks if the user is authenticated or not by checking the token expiration
//  date from local storage.
  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }
}
