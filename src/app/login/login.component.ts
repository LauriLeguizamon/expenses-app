import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login() {
    this.authService.loginUser(this.loginForm.value).subscribe((user) => {
      this.authService.user = user;
      console.log(user);

      if (user === null || user === undefined) {
        return;
      }
      localStorage.setItem('userId', String(this.authService.user.id));
      this.router.navigate(['/expenses']);
    });
  }
}
