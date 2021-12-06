import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtKey, userKey } from '../auth/jwtKey';
import { RequestsService } from '../services/requests.service';
import { logIn } from "../services/log-out.utils";

@Component({
  selector: 'app-token-register',
  templateUrl: './token-register.component.html',
  styleUrls: ['./token-register.component.scss'],
})
export class TokenRegisterComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly requestService: RequestsService,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token');

    localStorage.setItem(jwtKey, token);

    this.requestService.getMyUser().subscribe(user => {
      logIn(token, user);
      this.router.navigate(['/']);
    });
  }
}
