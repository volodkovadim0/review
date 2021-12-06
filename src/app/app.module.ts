import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewComponent } from './review/review.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { RatingModule } from 'ng-starrating';
import { ReviewListComponent } from './review-list/review-list.component';
import { TokenExpiredInterceptor } from './services/token-expired.interceptor';
import { AllMaterialModule } from './modules/all-material.module';
import { AppRouterModule } from './modules/app-router.module';
import { UserPageComponent } from './user-page/user-page.component';
import { TokenRegisterComponent } from './token-register/token-register.component';
import { UserNotFoundComponent } from './user-not-found/user-not-found.component';
import { MarkdownModule } from "ngx-markdown";
import { ReviewCardListComponent } from './review-card-list/review-card-list.component';
import { SliderModule } from 'ngx-slider';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RatingComponent } from './rating/rating.component';
import { CommonModule } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ReviewComponent,
    ReviewFormComponent,
    ReviewListComponent,
    UserPageComponent,
    TokenRegisterComponent,
    UserNotFoundComponent,
    RatingComponent,
    ReviewCardListComponent,
  ],
  imports: [
    CommonModule,
    AllMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    LMarkdownEditorModule,
    RatingModule,
    AppRouterModule,
    MarkdownModule.forRoot(),
    SliderModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenExpiredInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
