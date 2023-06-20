import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent {
  constructor(private AuthService: AuthService, private router: Router) {
    this.AuthService.logout();
    this.router.navigate(['/auth/login']).then(() => {
    });
  }
}
