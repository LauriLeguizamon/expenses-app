import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    console.log('el header se reinicia')
    this.loggedIn = this.authService.hasUser();
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/home']);
    this.loggedIn = false;
  }

}
