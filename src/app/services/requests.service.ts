import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReview } from '../review-form/review';
import { environment } from '../../environments/environment';
import { IUser } from '../models/user.model';

interface ILoginDto {
  readonly email: string;
  readonly password: string;
}

interface ILoginResult {
  readonly token: string;
  readonly success: boolean;
  readonly user: IUser;
}

export interface ItemsPage<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ReviewWithRatings {
  readonly review: IReview;
  readonly middleRating: number;
  readonly author: IUser;
  readonly selfRating: number;
  readonly selfLike: boolean;
  readonly likesTotal: number;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  constructor(
    private readonly httpClient: HttpClient,
  ) {
  }

  private get<T>(path: string): Observable<T> {
    return this.httpClient.get<T>(`${environment.baseUrl}/${path}`);
  }

  private delete<T>(path: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.baseUrl}/${path}`);
  }

  private post<T>(path: string, body: any): Observable<T> {
    return this.httpClient.post<T>(`${environment.baseUrl}/${path}`, body);
  }

  private put<T>(path: string, body: any): Observable<T> {
    return this.httpClient.put<T>(`${environment.baseUrl}/${path}`, body);
  }

  register(newUser: IUser): Observable<any> {
    return this.post('auth/register', newUser);
  }

  getUserById(id: string): Observable<IUser> {
    return this.get(`auth/one/${id}`);
  }

  getMyUser(): Observable<IUser> {
    return this.get('auth/me');
  }

  login(loginDto: ILoginDto): Observable<ILoginResult> {
    return this.post('auth/login', loginDto);
  }

  getTags(): Observable<string[]> {
    return this.get('review/tags');
  }

  createReview(review: IReview): Observable<IReview> {
    return this.post('review', review);
  }

  editReview(id: string, review: IReview): Observable<IReview> {
    return this.put(`review/${id}`, review);
  }

  getReviewById(id: string): Observable<ReviewWithRatings> {
    return this.get(`review/one/${id}`);
  }

  deleteReview(id: string): Observable<void> {
    return this.delete(`review/${id}`);
  }

  getReviewsByRatings(page: number, limit: number): Observable<ItemsPage<ReviewWithRatings>> {
    return this.get(`review/by-rating/${page}/${limit}`);
  }

  getReviewsByUser(userId: string, page: number, limit: number): Observable<ItemsPage<ReviewWithRatings>> {
    return this.get(`review/by-user/${userId}/${page}/${limit}`);
  }

  setLikeStatus(reviewId: string, isLiked: boolean): Observable<boolean> {
    return this.post(`review/like/${reviewId}/${isLiked}`, {});
  }

  getAuthorTotalLikes(authorId: string): Observable<number> {
    return this.get(`review/like/author/${authorId}`);
  }

  rateReview(reviewId: string, rating: number): Observable<void> {
    return this.post(`review/rate/${reviewId}/${rating}`, {});
  }
}
