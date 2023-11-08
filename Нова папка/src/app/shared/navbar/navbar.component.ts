import { Component } from '@angular/core';
import { UsersInterface } from 'src/app/model/users.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isActive: boolean = false;
  token: String = localStorage.getItem('token') ?? '';
  user!: UsersInterface;
  ngOnInit(): void {
    let user = localStorage.getItem('session');
    if (user) this.user = JSON.parse(user);

    console.log(this.user);
  }
  logOut() {
    localStorage.clear();
  }
}
