import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsersInterface } from './model/users.model';
import { Store } from '@ngxs/store';
import { Login } from './store/admin/admin.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: UsersInterface[] = [];
  session: any;
  constructor(private router: Router, private store: Store) {
    let session: any = localStorage.getItem('session');
    if (session) {
      session = JSON.parse(session);
    }

    this.session = session;
  }

  login(username: string, password: string) {
    this.store.dispatch(new Login(username, password));
  }
}
