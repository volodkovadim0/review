import { jwtKey, userKey } from "../auth/jwtKey";
import { IUser } from "../models/user.model";

export const logOut = () => {
  localStorage.removeItem(jwtKey);
  localStorage.removeItem(userKey);
}

export const logIn = (token: string, user: IUser): void => {
  localStorage.setItem(jwtKey, token);

  if (user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  }
}

export const getJwt = (): string => localStorage.getItem(jwtKey);