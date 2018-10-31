import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginAction } from '@app/enums/login-action';
import { IUser } from '@app/interfaces/user';
import { ParameterUtil } from '@app/utils/parameter-util';
import { environment } from 'environments/environment';
import { Observable ,  Subject } from 'rxjs';


interface IApiKeyResponse {
  key: string;
}

interface IRegisterUserRequest {
  // username: string;
  password1: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
}

/**
 * Login functions return token (see login dialog and auth interceptor)
 */
@Injectable()
export class LoginService {

  private googlePath: string;
  private loginPath: string;
  private logoutPath: string;
  private restAuthPath: string;
  private userPath: string;
  private existsPath: string;
  private registerPath: string;
  private verifyEmailPath: string;
  private resetPasswordPath: string;
  private verifyResetKeyPath: string;
  private changePasswordPath: string;

  private loggedInApiKey: string;

  private loggedInUser: IUser;
  private userLoggedInSubject: Subject<LoginAction>;

  // API v2 paths:
  private adminPath: string;
  private managePath: string;
  private basicPath: string;

  // Storage keys
  private tokenStorageKey: string;
  private userStorageKey: string;

  constructor(private http: HttpClient) {
    this.googlePath = 'google/';
    this.loginPath = 'login/';
    this.logoutPath = 'logout/';
    this.restAuthPath = 'rest-auth/';
    this.userPath = 'user/';
    this.existsPath = 'exists/';
    this.registerPath = 'register/';
    this.verifyEmailPath = 'verify-email/';
    this.resetPasswordPath = 'reset-password/';
    this.changePasswordPath = 'change-password/';
    this.verifyResetKeyPath = 'verify-reset-key/';

    this.adminPath = 'admin/';
    this.managePath = 'manage/';
    this.basicPath = 'basic/';

    this.tokenStorageKey = 'token';
    this.userStorageKey = 'loggedInUser';
    this.userLoggedInSubject = new Subject<LoginAction>();
  }

  private getUserFromStorage() {
    return localStorage.getItem(this.userStorageKey);
  }

  get apiKey() {
    if (this.loggedInApiKey) {
      return this.loggedInApiKey;
    } else {
      const apiKey = localStorage.getItem(this.tokenStorageKey);

      if (apiKey) {
        this.loggedInApiKey = apiKey;
        return this.loggedInApiKey;
      } else {
        this.userLoggedInSubject.next(LoginAction.LOG_OUT);
        return null;
      }
    }
  }

  /**
   * Components can subscribe to this to react to user login or logout actions.
   */
  get userLoginAction(): Observable<LoginAction> {
    return this.userLoggedInSubject.asObservable();
  }

  /**
   * Use this method to get info about the logged in user.
   */
  get user() {
    if (!this.loggedInUser) {
      console.log('No User in memory');
      const userFromStorage = this.getUserFromStorage();

      if (userFromStorage) {
        this.loggedInUser = JSON.parse(userFromStorage);
      } else {
        console.log('No User in localstorage');
      }
    }

    return this.loggedInUser;
  }

  /**
   * Called from the login component.
   * Note: Refactor to work "behind the scenes"? (don't call from component)
   * @param key
   */
  setupLoggedIn(apiKey: string) {
    this.loggedInApiKey = apiKey;

    this.getLoggedInUser()
      .subscribe(result => {
        this.loggedInUser = result;

        localStorage.setItem(this.tokenStorageKey, apiKey);
        localStorage.setItem(this.userStorageKey, JSON.stringify(result));

        this.userLoggedInSubject.next(LoginAction.LOG_IN);
      }, errors => {

      });
  }

  /**
   * Used to get info from the API about the logged in user.
   * Returns 401 if user is not logged in.
   */
  private getLoggedInUser(): Observable<IUser> {
    // const url = environment.config.url.LEApiBaseUrl + this.restAuthPath + this.userPath;
    const url = environment.config.url.LEApiBaseUrl + this.basicPath + this.userPath;
    return this.http.get<IUser>(url);
  }

  /**
   * Not Implemented
   */
  loginWithGoogle() {
    const url = environment.config.url.LEApiBaseUrl + this.restAuthPath + this.googlePath;
    return this.http.post(url, {});
  }

  /**
   *
   * @param username
   * @param password
   */
  loginWithUsernameAndPassword(username: string, password: string): Observable<IApiKeyResponse> {
    // const url = environment.config.url.LEApiBaseUrl + this.restAuthPath + this.loginPath;
    const url = environment.config.url.LEApiBaseUrl + this.loginPath;
    return this.http.post<IApiKeyResponse>(url, {
      username: username,
      password: password
    });
  }

  private logOutFromAPI() {
    const url = environment.config.url.LEApiBaseUrl + this.logoutPath;
    return this.http.post(url, {});
  }

  logout() {
    // Null everything and send message to components that we're out
    this.loggedInApiKey = null;
    this.loggedInUser = null;

    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userStorageKey);

    this.logOutFromAPI()
      .subscribe(result => {
        this.userLoggedInSubject.next(LoginAction.LOG_OUT);
      });
  }

  getUsernameExists(username: String) {
    const paramString = ParameterUtil.createParameterString([{
      username: username
    }]);
    const url = environment.config.url.LEApiBaseUrl + this.userPath + this.existsPath + paramString;
    return this.http.get<any>(url);
  }

  getEmailExists(email: String) {
    const paramString = ParameterUtil.createParameterString([{
      email: email
    }]);
    const url = environment.config.url.LEApiBaseUrl + this.userPath + this.existsPath + paramString;
    return this.http.get<any>(url);
  }

  registerNewUser(user: IRegisterUserRequest) {
    const url = environment.config.url.LEApiBaseUrl + this.registerPath;
    return this.http.post<IRegisterUserRequest>(url, user);
  }

  verifyEmail(key: string) {
    const url = environment.config.url.LEApiBaseUrl + this.verifyEmailPath;
    return this.http.post(url, {
      key: key
    });
  }

  changePasswordWithResetKey({ password, passwordAgain, resetKey }) {
    const url = environment.config.url.LEApiBaseUrl + this.changePasswordPath;
    return this.http.post(url, {
      password1: password,
      password2: passwordAgain,
      reset_key: resetKey
    });
  }

  verifyResetKey(resetKey: string) {
    const url = environment.config.url.LEApiBaseUrl + this.verifyResetKeyPath;
    return this.http.post(url, {
      reset_key: resetKey
    });
  }

  resetPassword(email: string) {
    const url = environment.config.url.LEApiBaseUrl + this.resetPasswordPath;
    return this.http.post(url, {
      email: email
    });
  }
}
