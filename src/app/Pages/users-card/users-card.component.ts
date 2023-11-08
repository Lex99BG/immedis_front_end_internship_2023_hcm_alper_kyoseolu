import { Select } from '@ngxs/store';
import { Component, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UsersInterface } from 'src/app/model/users.model';
import { DeleteUsers } from 'src/app/store/admin/admin.actions';
import { UsersState } from 'src/app/store/admin/admin.state';
import { state } from '@angular/animations';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-users-card',
  templateUrl: './users-card.component.html',
  styleUrls: ['./users-card.component.css'],
})
export class UsersCardComponent {
  @Input() user!: UsersInterface;
  @Input() index!: number;
  showPassword: boolean = false;

  @Select(UsersState.getLoggedUser)
  loggedAs$!: Observable<UsersInterface>;
  loggedAs!: UsersInterface;
  isAdmin: boolean = false;
  constructor(
    private router: Router,
    private store: Store,
    private elem: ElementRef
  ) {
    this.loggedAs$.subscribe((user) => {
      if (user) {
        this.loggedAs = user;
        this.isAdmin = user.userType === 'Admin';
      }
    });
  }
  navigateToUser(index: number) {
    this.router.navigate(['/user', index]);
  }

  applyBackground(user: UsersInterface): string {
    return user.userType === 'User' ? '#dcbb35' : '';
  }

  applyBorder(user: UsersInterface): string {
    return user.userType === 'User' ? '4px solid #dcbb35' : '';
  }

  deleteUser(index: number) {
    if (confirm('Are you sure you want to delete ' + this.user.name)) {
      this.store.dispatch(new DeleteUsers(index));
    }
  }
  isCurrentUser(): boolean {
    return this.loggedAs.userName === this.user.userName;
  }
}
