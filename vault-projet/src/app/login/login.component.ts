import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest, AuthResponse } from '../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  email: string = '';
  password: string = '';
  emailTouched: boolean = false;
  passwordTouched: boolean = false;
  showPassword: boolean = false;
  loginError: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngAfterViewInit(): void {
    const header = document.querySelector('.header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToSignUp(): void {
    this.router.navigate(['/signup']);
  }

  onLogin(): void {
    this.emailTouched = true;
    this.passwordTouched = true;
    this.loginError = null;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = this.email && emailPattern.test(this.email);
    const isPasswordValid = this.password && this.password.length >= 6;

    if (!isEmailValid || !isPasswordValid) return;

    const loginData: LoginRequest = {
      userEmail: this.email,
      userPassword: this.password
    };

    this.authService.login(loginData)
      .pipe(
        catchError(err => {
          // afficher le message du backend ou un message générique
          this.loginError = err?.error?.error || 'Email or password is incorrect';
          return of(null);
        })
      )
      .subscribe((res: AuthResponse | null) => {
        if (!res) return;

        // ✅ Sauvegarde du token
        if (res.token) localStorage.setItem('token', res.token);

        // ✅ Sauvegarde des données utilisateur
        const userEmail = res.userEmail || this.email;
        const userName = res.userName || '';

        localStorage.setItem('email', userEmail);
        localStorage.setItem('fullName', userName);

        // Séparer nom/prénom pour profile
        let firstName = '';
        let lastName = '';
        if (userName) {
          const nameParts = userName.trim().split(' ');
          lastName = nameParts[0] || '';
          firstName = nameParts.slice(1).join(' ') || '';
        }

        localStorage.setItem('lastName', lastName);
        localStorage.setItem('firstName', firstName);

        // ✅ Redirection vers le profil
        this.router.navigate(['/dashboard/profile']);
      });
  }

  get emailInvalid(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.emailTouched && (!this.email || !emailPattern.test(this.email));
  }

  get passwordInvalid(): boolean {
    return this.passwordTouched && (!this.password || this.password.length < 6);
  }
  onInputChange(): void {
    this.loginError = null;
  }

}
