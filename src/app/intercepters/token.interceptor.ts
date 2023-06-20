import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, private commonService: CommonService, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.IsAuthenticating) { // Nếu đang xác thực thì không thực hiện intercept
      return next.handle(req);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.handleAuthError(499);
      return next.handle(req);
    } else {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(req).pipe(
        catchError(err => {
          this.handleAuthError(err.status);
          return throwError(err);
        })
      );
    }
  }

  private handleAuthError(status: number): void {
    switch (status) {
      case 499: // Chưa đăng nhập
        this.handleStatus('/auth/login', 'Vui lòng đăng nhập để tiếp tục!');
        break;
      case 401:
        this.handleStatus('/auth/login', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
        break;
      case 403:
        this.handleStatus('/auth/forbidden', 'Bạn không có quyền truy cập vào trang này!');
        break;
      case 404:
        this.handleStatus('/auth/not-found', 'Không tìm thấy trang yêu cầu!');
        break;
    }
  }

  private handleStatus(route: string, msg: string): void {
    this.router.navigate([route]).then(
      () => {
        this.commonService.openSnackBar(msg);
      }
    ).catch(() => {
    });
  }
}
