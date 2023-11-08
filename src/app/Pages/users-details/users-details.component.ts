import { Component, Input, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersInterface } from 'src/app/model/users.model';
import { UsersState } from 'src/app/store/admin/admin.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeleteUsers, UpdateUsers } from 'src/app/store/admin/admin.actions';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css'],
})
export class UsersDetailsComponent {
  private route = inject(ActivatedRoute);
  user!: UsersInterface;
  user$!: Observable<any>;
  form!: FormGroup;
  users: UsersInterface[] = [];
  profilePics: string[] = [
    '../../assets/user-one.png',
    '../../assets/user-two.png',
    '../../assets/user-three.png',
    '../../assets/user-four.png',
    '../../assets/user-five.png',
    '../../assets/user-six.png',
  ];
  index!: number;
  closeResult = '';
  constructor(
    private router: Router,
    private store: Store,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.index = Number(this.route.snapshot.paramMap.get('userIndex'));
    this.user$ = this.store
      .select(UsersState.GetUserByIndex)
      .pipe(map((filterFn) => filterFn(this.index)));

    this.user$.subscribe((user) => {
      this.user = user;
    });
    this.form = this.formBuilder.group({
      name: new FormControl(this.user.name),
      email: new FormControl(this.user.email),
      tel: new FormControl(this.user.tel),
      userName: new FormControl(this.user.userName),
      userType: new FormControl(this.user.userType),
      jobTitle: new FormControl(this.user.jobTitle),
      status: new FormControl(this.user.status),
      salary: new FormControl(this.user.salary),
    });
  }

  deleteUser(index: number) {
    if (confirm('Are you sure you want to delete ' + this.user.name)) {
      this.store.dispatch(new DeleteUsers(index));
    }
    this.router.navigate(['/users-list']);
  }

  editUser(): void {
    if (this.form.valid) {
      const userData: UsersInterface = {
        userName: this.form.value.userName,
        name: this.form.value.name,
        email: this.form.value.email,
        tel: this.form.value.tel,
        userType: this.form.value.userType,
        jobTitle: this.form.value.jobTitle,
        status: this.form.value.status,
        salary: this.form.value.salary,
        profilePic: this.user.profilePic,
        password: '',
      };
      this.store.dispatch(new UpdateUsers(userData, this.index));
      this.modalService.dismissAll();
    } else {
      alert('Please fill in all the required fields.');
    }
  }
  openModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  setProfilePic(index: number) {
    this.user.profilePic = this.profilePics[index];
  }
}
