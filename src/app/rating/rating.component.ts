import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestsService, ReviewWithRatings } from '../services/requests.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent {
  get value(): number {
    return this._value;
  }

  @Input()
  set value(value: number) {
    this._value = value;
  }
  @Input() readonly: boolean;
  @Input() private _value: number;
  @Input() reviewId: string;
  @Input() size: string;
  @Input() onlyLocalRating = false;

  @Output() readonly rated = new EventEmitter<number>();

  private loading = false;

  constructor(
    private readonly requestsService: RequestsService,
  ) {
  }

  get readonlyOrLoading(): boolean {
    return this.readonly || this.loading;
  }

  rateReview(rating: number): void {
    this.rated.next(rating);

    if (this.onlyLocalRating) {
      return;
    }

    this.loading = true;
    this.requestsService.rateReview(this.reviewId, rating).subscribe(() => {
      this.loading = false;
    });
  }
}
