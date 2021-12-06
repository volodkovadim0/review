import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { jwtKey, userKey } from './jwtKey';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestsService } from '../services/requests.service';
import { environment } from '../../environments/environment';
import { IAuthData } from '../models/auth-data.model';
import { Router } from '@angular/router';
import { logIn } from "../services/log-out.utils";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  readonly GOOGLE_AUTH_URL = `${environment.baseUrl}/auth/google`;
  readonly YANDEX_AUTH_URL = `${environment.baseUrl}/auth/yandex`;

  readonly firstName = new FormControl('Vadim');
  readonly lastName = new FormControl('Coderovich');
  readonly email = new FormControl('volodkavadim0@gmail.com');
  readonly password = new FormControl('');

  readonly registerForm = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password,
  });

  readonly loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  loginMode = true;
  loginError = false;

  get registerMode(): boolean {
    return !this.loginMode;
  }

  constructor(
    private readonly requestsService: RequestsService,
    readonly dialogRef: MatDialogRef<any>,
    private readonly router: Router,
    @Inject(MAT_DIALOG_DATA) private readonly data: IAuthData,
  ) {
  }

  ngOnInit(): void {
    if (this.data?.register) {
      this.loginMode = false;
      this.email.setValue(this.data.register.initialEmail);
      this.firstName.setValue(this.data.register.initialFirstName);
      this.lastName.setValue(this.data.register.initialLastName);
    }
  }

  login() {
    this.requestsService.login(this.loginForm.value).subscribe(result => {
      this.loginError = !result.success;

      if (!this.loginError) {
        logIn(result.token, result.user);
        this.dialogRef.close(true);
      }
    });
  }

  goToGoogleAuth() {
    window.location.href = this.GOOGLE_AUTH_URL;
  }

  goToYandexAuth() {
    window.location.href = this.YANDEX_AUTH_URL;
  }

  register() {
    this.requestsService.register({
      ...this.registerForm.value,
      password: this.password.value,
    }).subscribe(() => {
      this.loginMode = true;
      this.router.navigate(['/']);
    });
  }
}
