import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Select, Store } from '@ngxs/store';
import { UsersState } from '../../store/admin/admin.state';
import { UsersInterface } from 'src/app/model/users.model';
import { Observable } from 'rxjs/internal/Observable';
import { AddUsers } from 'src/app/store/admin/admin.actions';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  @ViewChild('profileImage', { static: false })
  profileImage!: ElementRef;
  closeResult = '';
  form!: FormGroup;
  @Select(UsersState.getLoggedUser)
  loggedAs!: Observable<UsersInterface>;
  isAdmin: boolean = false;
  userProfilePic: string = '../../assets/user-two.png';
  profilePics: string[] = [
    '../../assets/user-one.png',
    '../../assets/user-two.png',
    '../../assets/user-three.png',
    '../../assets/user-four.png',
    '../../assets/user-five.png',
    '../../assets/user-six.png',
  ];
  users: UsersInterface[] = [];
  @Select(UsersState.getUsers)
  userInfo$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl(null),
      email: new FormControl(null),
      tel: new FormControl(null),
      jobTitle: new FormControl(null),
      userName: new FormControl(null),
      password: new FormControl(null),
      status: new FormControl(null),
      salary: new FormControl(null),
      userType: new FormControl('admin'),
    });

    this.userInfo$.subscribe((returnData) => {
      this.users = returnData;
    });

    this.loggedAs.subscribe((user) => {
      this.isAdmin = user.userType === 'Admin';
    });
  }

  createUser(): void {
    if (this.form.valid) {
      const userData: UsersInterface = {
        userName: this.form.value.userName,
        password: this.form.value.password,
        name: this.form.value.name,
        email: this.form.value.email,
        tel: this.form.value.tel,
        userType: this.form.value.userType,
        jobTitle: this.form.value.jobTitle,
        status: this.form.value.status,
        salary: this.form.value.salary,
        profilePic: this.userProfilePic,
      };
      this.store.dispatch(new AddUsers(userData));
      this.form.reset();
      this.modalService.dismissAll();
      this.users.sort((a, b) => (a.userType < b.userType ? -1 : 1));
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
    this.userProfilePic = this.profilePics[index];
  }
}
