import { Injectable } from '@angular/core';
import { jwtKey, userKey } from '../auth/jwtKey';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get user(): IUser {
    return JSON.parse(localStorage.getItem(userKey));
  }

  get authenticated(): boolean {
    return !!localStorage.getItem(userKey);
  }
}
