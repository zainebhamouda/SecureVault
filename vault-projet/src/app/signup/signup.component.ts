import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, SignupRequest } from '../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  fullNameTouched: boolean = false;
  emailTouched: boolean = false;
  passwordTouched: boolean = false;
  confirmPasswordTouched: boolean = false;

  signupError: string | null = null; // erreur backend
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') this.showPassword = !this.showPassword;
    else if (field === 'confirmPassword') this.showConfirmPassword = !this.showConfirmPassword;
  }

  get fullNameInvalid(): boolean {
    return this.fullNameTouched && (!this.fullName.trim() || !/^\S+\s+\S+/.test(this.fullName));
  }

  get fullNameErrorMessage(): string {
    if (!this.fullName.trim()) return 'Full Name is required';
    return 'Enter your name as "LastName FirstName"';
  }

  get emailInvalid(): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.emailTouched && (!this.email || !pattern.test(this.email));
  }

  get passwordInvalid(): boolean {
    return this.passwordTouched && (!this.password || this.password.length < 6);
  }

  get confirmPasswordInvalid(): boolean {
    return this.confirmPasswordTouched && (this.confirmPassword !== this.password);
  }

  onSignup(): void {
  this.fullNameTouched = true;
  this.emailTouched = true;
  this.passwordTouched = true;
  this.confirmPasswordTouched = true;
  this.signupError = null;

  if (this.fullNameInvalid || this.emailInvalid || this.passwordInvalid || this.confirmPasswordInvalid) {
    return;
  }

  // Séparer LastName et FirstName
  const nameParts = this.fullName.trim().split(' ');
  const lastName = nameParts[0];
  const firstName = nameParts.slice(1).join(' ');

  const signupData: SignupRequest = {
    userName: `${lastName} ${firstName}`,
    userEmail: this.email,
    userPassword: this.password.length >= 6 ? this.password : this.password + '1'
  };

  this.authService.signup(signupData)
    .pipe(
      catchError((err: any) => {
        if (err?.error?.error) {
          this.signupError = err.error.error;

          // vider le formulaire
          this.fullName = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';

          // réinitialiser les touched
          this.fullNameTouched = false;
          this.emailTouched = false;
          this.passwordTouched = false;
          this.confirmPasswordTouched = false;
        } else {
          this.signupError = 'An error occurred while creating the account';
        }
        return of(null);
      })
    )
    .subscribe(res => {
      if (res) {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', this.email);
        this.router.navigate(['/login']);
      }
    });
}

// Ajouter ces méthodes pour effacer le message d'erreur quand on tape à nouveau
onFullNameInput() {
  this.signupError = null;
}

onEmailInput() {
  this.signupError = null;
}

onPasswordInput() {
  this.signupError = null;
}

onConfirmPasswordInput() {
  this.signupError = null;
}

}
