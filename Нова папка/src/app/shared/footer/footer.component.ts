import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  isClassActive: boolean = true;
  token: String = localStorage.getItem('token') ?? '';
  logOut() {
    localStorage.clear();
  }
}
