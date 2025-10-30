import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  
})
export class WelcomeComponent {
  featuresVisible = false;

  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  goToSignUp(): void {
    this.router.navigate(['/signup']); 
  }
}

