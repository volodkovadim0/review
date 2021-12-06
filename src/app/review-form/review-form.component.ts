import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, of, startWith, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IReview } from './review';
import { AuthService } from '../services/auth.service';
import { RequestsService, ReviewWithRatings } from '../services/requests.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
})
export class ReviewFormComponent implements OnInit {
  @ViewChild('tagSearchInput') tagSearchInput: ElementRef<HTMLInputElement>;

  review: IReview = {
    name: '',
    authorId: '',
    content: '',
    group: '',
    images: [],
    rating: 1,
    tags: [],
  };
  images: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsWhichContainsSearchWord: Observable<string[]> = of<string[]>([]);
  tags: string[] = ['example'];
  allTags: string[] = [];

  readonly groups = [
    'Film',
    'Game',
    'Book',
    'Science',
  ];

  readonly reader = new FileReader();
  readonly tagsSearchInputControl = new FormControl();
  readonly nameControl = new FormControl('My first review');
  readonly contentControl = new FormControl('some content here');
  readonly ratingControl = new FormControl(1);
  readonly groupControl = new FormControl(this.groups[0]);

  get formValue(): IReview {
    return {
      name: this.nameControl.value,
      content: this.contentControl.value,
      tags: this.tags,
      rating: this.ratingControl.value,
      images: this.images,
      group: this.groupControl.value,
      authorId: this.authService.user._id,
    };
  }

  get id(): string {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  get edit(): boolean {
    return !!this.id;
  }

  get create(): boolean {
    return !this.edit;
  }

  get notUsedTags(): string[] {
    return this.allTags.filter(tag => !this.tags.includes(tag));
  }

  constructor(
    private readonly requestsService: RequestsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.requestsService.getTags().subscribe(this.initializeTags);
    this.reader.onload = () => this.images.push(this.reader.result as string);

    if (this.edit) {
      this.requestsService.getReviewById(this.id).subscribe(this.setReview);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
    this.tagsSearchInputControl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagSearchInput.nativeElement.value = '';
    this.tagsSearchInputControl.setValue(null);
  }

  processFile(imageInput: HTMLInputElement) {
    const image = imageInput.files[0];
    this.reader.readAsDataURL(image);
    imageInput.files = new DataTransfer().files;
  }

  createReview() {
    this.requestsService.createReview(this.formValue).subscribe(this.navigateToRead);
  }

  editReview() {
    this.requestsService.editReview(this.id, this.formValue).subscribe(this.navigateToRead);
  }

  private navigateToRead = (review: IReview) => {
    this.router.navigate(['read', review._id]);
  }

  private filterTagsWhichContainsWord(word: string): string[] {
    const filterValue = word.toLowerCase();
    return this.notUsedTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  private setReview = ({ review }: ReviewWithRatings) => {
    this.review = review;
    this.nameControl.setValue(review.name);
    this.contentControl.setValue(review.content);
    this.groupControl.setValue(review.group);
    this.ratingControl.setValue(review.rating)
    this.images = [...review.images];
    this.tags = [...review.tags];
  };

  private getTagsWhichContainsWord(word: string): string[] {
    return word
      ? this.filterTagsWhichContainsWord(word)
      : this.notUsedTags;
  }

  private initializeTags = (tags: string[]) => {
    this.allTags = tags;
    this.tagsWhichContainsSearchWord = this.tagsSearchInputControl.valueChanges.pipe(
      startWith(null),
      map<any, string[]>(this.getTagsWhichContainsWord.bind(this)),
      tap(console.log)
    );
  };
}
