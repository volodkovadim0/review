import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../auth/auth.component';
import { IAuthData } from '../models/auth-data.model';

@Component({
  selector: 'app-user-not-found',
  templateUrl: './user-not-found.component.html',
  styleUrls: ['./user-not-found.component.scss'],
})
export class UserNotFoundComponent {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
  ) {
  }

  get email(): string {
    return this.activatedRoute.snapshot.queryParamMap.get('email');
  }

  get firstName(): string {
    return this.activatedRoute.snapshot.queryParamMap.get('firstName');
  }

  get lastName(): string {
    return this.activatedRoute.snapshot.queryParamMap.get('lastName');
  }

  get authData(): IAuthData {
    return {
      register: {
        initialEmail: this.email,
        initialFirstName: this.firstName,
        initialLastName: this.lastName,
      },
    };
  }

  openRegisterModal(): void {
    this.dialog.open(AuthComponent, {
      data: this.authData,
    });
  }
}
