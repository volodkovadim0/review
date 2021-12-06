import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../services/requests.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../models/user.model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  constructor(
    private readonly requestService: RequestsService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  get id(): string {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  user: IUser = {
    _id: '',
    lastName: '',
    firstName: '',
    email: '',
    passwordHash: '',
  };

  getReviewsByUser = (page: number, limit: number) => this.requestService.getReviewsByUser(this.id, page, limit);

  ngOnInit(): void {
    this.requestService.getUserById(this.id).subscribe(user => this.user = user);
  }

}
