import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { AccountDto } from '../models/AccountDto';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = 'token';
  private isAuthenticating = false;
  private username = 'username';
  private role = 'role';
  private fullName = 'fullName';
  private exp = 'exp';
  private authApiUrl = environment.apiUrl + '/Auth';

  constructor(private http: HttpClient) {
  }

  get IsAuthenticating(): boolean {
    return this.isAuthenticating;
  }

  login(username: string, password: string): Observable<any> {
    this.logout();
    this.isAuthenticating = true;

    return this.http.post<any>(`${this.authApiUrl}/login`, { username, password }).pipe(
      map((response) => {
        const token = response.token;
        let username = '';
        let role = '';
        let fullName = '';

        try {
          const payload: any = jwt_decode(token);

          const nameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
          const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

          username = payload[nameClaim];
          role = payload[roleClaim];
          fullName = payload.fullName;

        } catch (error) {
          console.error('Error decoding JWT:', error);
        }

        localStorage.setItem(this.token, response.token);
        localStorage.setItem(this.username, username);
        localStorage.setItem(this.role, role);
        localStorage.setItem(this.fullName, fullName);

        this.isAuthenticating = false;
        return { success: true, message: 'Đăng nhập thành công!' };
      }),
      catchError((err) => {
        this.isAuthenticating = false;

        let message = '';
        switch (err.status) {
          case 401:
            message = 'Sai tên đăng nhập hoặc mật khẩu';
            break;
          case 403:
            message = 'Tài khoản của bạn đã bị khoá';
            break;
          case 404:
            message = 'Tài khoản chưa định danh. Vui lòng liên hệ quản trị viên để được hỗ trợ!';
            break;
          default:
            message = 'Đã có lỗi xảy ra, vui lòng thử lại sau!';
            break;
        }
        return of({ success: false, message });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.token);
    localStorage.removeItem(this.username);
    localStorage.removeItem(this.fullName);
    localStorage.removeItem(this.role);
    localStorage.removeItem(this.exp);
  }

  get IsLoggedIn(): boolean {
    return !!localStorage.getItem(this.token);
  }

  get Token(): string {
    const loginResponse = localStorage.getItem(this.token)!;
    return JSON.parse(loginResponse).token;
  }

  get FullName() {
    return localStorage.getItem(this.fullName)!;
  }

  get Username() {
    return localStorage.getItem(this.username)!;
  }

  get Role() {
    return localStorage.getItem(this.role)!;
  }
}
