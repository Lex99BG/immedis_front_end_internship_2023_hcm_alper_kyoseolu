import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import LoginResponse from '../mocked-response/login-response.json';
import { AuthService } from '../auth.service';
import { UsersInterface } from '../model/users.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    localStorage.setItem('token', LoginResponse.token);
    this.authService.login(this.form.value.userName, this.form.value.password);
    let user = localStorage.getItem('session');
    if (user !== null) {
      const userObject: UsersInterface = JSON.parse(user);
      if (userObject.userName) {
        // Потребителят е валиден, продължавате с пренасочването
        this.router.navigateByUrl('/users-list');
      } else {
        alert('Invalid username or password');
      }
    } else {
      alert('Invalid username or password');
    }
  }
}
