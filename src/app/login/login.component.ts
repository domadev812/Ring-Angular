import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { NavbarService } from '../app.services-list';
import { ToastService } from '../_services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private navBarService: NavbarService,
    public toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.navBarService.hide();
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  login(): void {
    this.authService.login(this.loginForm.value)
      .subscribe((response) => {
        {
          this.router.navigate(['resources']);
        }
      }, (err) => {
        let message = err.message ? `: ${err.message}` : '';
        this.toastService.showError(message);

        // loader.dismiss();
      });
  }

  forgotPassword(): void {
    window.open('https://www.utahfutures.org/login', '_blank');
  }
}
