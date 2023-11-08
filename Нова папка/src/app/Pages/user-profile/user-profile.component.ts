import { Component, Input, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersInterface } from 'src/app/model/users.model';
import { UsersState } from 'src/app/store/admin/admin.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DeleteUsers,
  UpdateUserProfile,
  UpdateUsers,
} from 'src/app/store/admin/admin.actions';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  private route = inject(ActivatedRoute);
  user!: UsersInterface;
  user$!: Observable<any>;
  users!: UsersInterface[];
  @Select(UsersState.getUsers)
  users$!: Observable<any>;
  form!: FormGroup;
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
  showPassword = false;
  passwordFieldType = 'password';

  togglePasswordVisibility() {
    const passwordControl = this.form.get('password');
    if (passwordControl) {
      this.showPassword = !this.showPassword;
      this.passwordFieldType = this.showPassword ? 'text' : 'password';
    }
  }

  ngOnInit(): void {
    let user = localStorage.getItem('session');
    if (user) this.user = JSON.parse(user);

    this.users$.subscribe((returnData) => {
      this.users = returnData;
      let index = this.users.findIndex(
        (obj) => obj.userName === this.user.userName
      );
      this.index = index;
    });

    console.log(this.user);

    this.form = this.formBuilder.group({
      name: new FormControl(this.user.name),
      email: new FormControl(this.user.email),
      tel: new FormControl(this.user.tel),
      userName: new FormControl(this.user.userName),
      password: new FormControl(this.user.password),
    });
  }
  UpdateProfile(): void {
    if (this.form.valid) {
      const userData: UsersInterface = {
        userName: this.form.value.userName,
        name: this.form.value.name,
        email: this.form.value.email,
        tel: this.form.value.tel,
        userType: this.user.userType,
        jobTitle: this.user.jobTitle,
        status: this.user.status,
        salary: this.user.salary,
        profilePic: this.user.profilePic,
        password: this.form.value.password,
      };
      this.store.dispatch(new UpdateUserProfile(userData, this.index));
      let user = localStorage.getItem('session');
      if (user) this.user = JSON.parse(user);
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
