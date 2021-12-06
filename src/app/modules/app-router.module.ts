import { RouterModule } from '@angular/router';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { ReviewComponent } from '../review/review.component';
import { ReviewListComponent } from '../review-list/review-list.component';
import { UserPageComponent } from '../user-page/user-page.component';
import { TokenRegisterComponent } from '../token-register/token-register.component';
import { UserNotFoundComponent } from '../user-not-found/user-not-found.component';
import { ReviewCardListComponent } from '../review-card-list/review-card-list.component';

export const AppRouterModule = RouterModule.forRoot([
  {
    path: 'create',
    component: ReviewFormComponent,
  },
  {
    path: 'edit/:id',
    component: ReviewFormComponent,
  },
  {
    path: 'read/:id',
    component: ReviewComponent,
  },
  {
    path: 'user/:id',
    component: UserPageComponent,
  },
  {
    path: '',
    component: ReviewCardListComponent,
  },
  {
    path: 'token',
    component: TokenRegisterComponent,
  },
  {
    path: 'token/error',
    component: UserNotFoundComponent,
  },
]);
