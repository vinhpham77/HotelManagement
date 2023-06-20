import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { SidenavService } from '../../../services/sidenav.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  get Username() {
    return this.loginForm.get('username');
  }

  get Password() {
    return this.loginForm.get('password');
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private commonService: CommonService, private router: Router, private sidenavService: SidenavService) {
  }

  login() {
    if (this.loginForm.valid) {
      let username = this.Username?.value;
      let password = this.Password?.value;

      this.authService.login(username!, password!).subscribe(data => {
        if (data.success) {
          this.sidenavService.loadSidenavItems();
          this.router.navigate(['/home']).then(() => {
          });
        } else {
          this.commonService.openSnackBar(data.message);
        }
      });
    }
  }
}
