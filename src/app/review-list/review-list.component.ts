import { Component, Input, OnInit } from '@angular/core';
import { ItemsPage, RequestsService, ReviewWithRatings } from '../services/requests.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent implements OnInit {
  readonly position = 'position';
  readonly name = 'name';
  readonly authorName = 'authorName';
  readonly group = 'group';
  readonly rating = 'rating';
  readonly authorRating = 'authorRating';
  readonly read = 'read';

  displayedColumns: string[] = [
    this.position,
    this.name,
    this.authorName,
    this.group,
    this.rating,
    this.authorRating,
    this.read,
  ];

  page: PageEvent = {
    pageSize: 10,
    pageIndex: 0,
    length: 1,
  };

  pageResult: ItemsPage<ReviewWithRatings> = {
    total: 1,
    page: 0,
    limit: 10,
    items: [],
  };

  @Input() getItemsPage = (page: number, limit: number) => this.requestsService.getReviewsByRatings(
    page, limit,
  );

  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  constructor(
    private readonly requestsService: RequestsService,
    private readonly authService: AuthService,
  ) {
  }

  isAuthorOfReview(review: ReviewWithRatings): boolean {
    return this.authenticated && review.review.authorId === this.authService.user._id;
  }

  asReview(review: any): ReviewWithRatings {
    return review;
  }

  ngOnInit(): void {
    this.getPage();
  }

  private getPage(): void {
    this.getItemsPage(this.page.pageIndex, this.page.pageSize).subscribe(page => this.pageResult = page);
  }

  deleteReview(id: string, index: number) {
    this.requestsService.deleteReview(id).subscribe(() => {
      this.pageResult = {
        ...this.pageResult,
        items: this.pageResult.items.filter(item => item.review._id !== id),
        total: this.pageResult.total - 1
      };
    });
  }

  updatePage(event: PageEvent) {
    this.page = event;
    this.getPage();
  }
}
