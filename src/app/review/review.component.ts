import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IReview } from '../review-form/review';
import { RequestsService, ReviewWithRatings } from '../services/requests.service';
import { IUser } from '../models/user.model';
import { Slider } from 'ngx-slider';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  readonly slider = new Slider();

  constructor(
    private readonly requestsService: RequestsService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.slider.config.loop = true;
    this.slider.config.showPreview = false;
  }

  readonlyStarRating = false;
  likeProcessing = false;

  reviewWithRatings: ReviewWithRatings = {
    review: {
      _id: '',
      name: '',
      authorId: '',
      content: '',
      group: '',
      images: [],
      rating: 1,
      tags: [],
    },
    likesTotal: 0,
    author: {
      _id: '',
      email: '',
      firstName: '',
      lastName: '',
      passwordHash: '',
    },
    middleRating: 0,
    selfRating: 0,
    selfLike: false,
  };

  get author(): IUser {
    return this.reviewWithRatings.author;
  }

  get review(): IReview {
    return this.reviewWithRatings.review;
  }

  get id(): string {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }


  ngOnInit() {
    this.requestsService.getReviewById(this.id).subscribe(review => {
      this.reviewWithRatings = review;
      this.readonlyStarRating = true;
      console.log(review);
      this.slider.items = this.review.images.map(value=>({ src: value}));
      console.log(this.slider.items)
    });



  }

  toggleLike(): void {
    const newLikeValue = !this.reviewWithRatings.selfLike;

    this.setSelfLike(newLikeValue);

    this.likeProcessing = true;

    this.requestsService.setLikeStatus(this.id, newLikeValue).subscribe((value) => {
      this.setSelfLike(value);
      this.likeProcessing = false;
    });
  }

  setRating = (selfRating: number): void => {
    this.reviewWithRatings = {
      ...this.reviewWithRatings,
      selfRating,
    };
  };

  setSelfLike = (selfLike: boolean) => {
    this.reviewWithRatings = {
      ...this.reviewWithRatings,
      selfLike,
    };
  };
}
