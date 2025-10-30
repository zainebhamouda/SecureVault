import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-generator.component.html',
  styleUrls: ['./password-generator.component.css']
})
export class PasswordGeneratorComponent {
  username = '';
  mode: 'password' | 'passphrase' = 'password';
  length = 14;
  minNumbers = 1;
  minSpecial = 0;
  includeLower = true;
  includeUpper = true;
  includeNumbers = true;
  includeSpecial = true;

  generatedPassword = '';
  history: string[] = [];

  passwordStrength = '';
  strengthClass = '';

  private lower = 'abcdefghijklmnopqrstuvwxyz';
  private upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private numbers = '0123456789';
  private special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  generatePassword(): void {
    let pwd = '';

    if (this.mode === 'password') {
      let pool = '';
      if (this.includeLower) pool += this.lower;
      if (this.includeUpper) pool += this.upper;
      if (this.includeNumbers) pool += this.numbers;
      if (this.includeSpecial) pool += this.special;

      if (!pool) {
        alert('Please select at least one character type!');
        return;
      }

      let numbers = this.randomChars(this.numbers, this.minNumbers);
      let specials = this.randomChars(this.special, this.minSpecial);
      let lettersCount = this.length - numbers.length - specials.length;
      let rest = this.randomChars(pool, lettersCount);

      pwd = this.shuffleString(numbers + specials + rest);
    } else {
      const words = ['apple','orange','secure','vault','key','safe','lock','cipher','token','strong'];
      pwd = Array.from({ length: Math.floor(this.length / 4) }, () =>
        words[Math.floor(Math.random() * words.length)]
      ).join('-');
    }

    this.generatedPassword = pwd;
    this.updateStrength(pwd);

    this.history.unshift(pwd);
    if (this.history.length > 10) this.history.pop();
  }

  private randomChars(chars: string, count: number): string {
    return Array.from({ length: count }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private shuffleString(str: string): string {
    return str.split('').sort(() => Math.random() - 0.5).join('');
  }

  private updateStrength(password: string): void {
    if (password.length < 8) {
      this.passwordStrength = 'Weak';
      this.strengthClass = 'weak';
    } else if (password.length < 14) {
      this.passwordStrength = 'Medium';
      this.strengthClass = 'medium';
    } else {
      this.passwordStrength = 'Strong';
      this.strengthClass = 'strong';
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }
}
