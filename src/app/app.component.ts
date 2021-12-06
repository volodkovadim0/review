import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './services/auth.service';
import { logOut } from "./services/log-out.utils";
import { FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

const isDarkThemeKey = 'is-dark-theme';
const isLangEnKey = 'is-lang-en';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 're-cum-in-dations';
  darkThemeControl = new FormControl(this.isDarkThemeInLocalStorage);
  languageControl = new FormControl(this.langIsEnInLocalStorage);

  constructor(
    private readonly authService: AuthService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
  ) {
  }

  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  get fullName(): string {
    return this.authService.user.firstName;
  }

  private get langIsEnInLocalStorage(): boolean {
    return localStorage.getItem(isLangEnKey) === 'true';
  }

  private get isDarkThemeInLocalStorage(): boolean {
    return localStorage.getItem(isDarkThemeKey) === 'true';
  }

  ngOnInit() {
    this.setLang();
    this.setTheme();
    this.darkThemeControl.valueChanges.subscribe(
      isDarkTheme => {
        localStorage.setItem(isDarkThemeKey, isDarkTheme);
        this.setTheme();
      }
    )
    this.languageControl.valueChanges.subscribe(
      isLangEn => {
        localStorage.setItem(isLangEnKey, isLangEn);
        this.setLang();
      }
    );
  }

  private setLang(): void {
    this.translateService.setDefaultLang(this.langIsEnInLocalStorage ? 'en' : 'ru');
  }

  private setTheme() {
    document.body.classList.remove('light-theme');
    document.body.classList.remove('dark-theme');

    document.body.classList.add(this.isDarkThemeInLocalStorage ? 'dark-theme' : 'light-theme');
  }

  openLogin() {
    this.dialog.open(AuthComponent);
  }

  logOut() {
    logOut();
  }
}
