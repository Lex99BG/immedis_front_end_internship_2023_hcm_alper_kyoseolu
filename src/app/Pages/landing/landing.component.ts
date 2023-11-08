import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  isClassActive: boolean = true;
  token: String = localStorage.getItem('token') ?? '';
  logOut() {
    localStorage.clear();
  }
}
