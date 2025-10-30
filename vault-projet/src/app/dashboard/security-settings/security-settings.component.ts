import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.css']
})
export class SecuritySettingsComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordHint = '';
  passwordStrength = 0;
  passkeyEnabled = false;

  // Validation flags
  currentPasswordTouched = false;
  newPasswordTouched = false;
  confirmPasswordTouched = false;

  // ✅ Calcul de la force du mot de passe
  updatePasswordStrength(): void {
    let score = 0;

    if (this.newPassword.length >= 12) score += 1; // longueur minimale
    if (/[A-Z]/.test(this.newPassword)) score += 1; // majuscule
    if (/[a-z]/.test(this.newPassword)) score += 1; // minuscule
    if (/[0-9]/.test(this.newPassword)) score += 1; // chiffre
    if (/[\W_]/.test(this.newPassword)) score += 1; // caractère spécial

    this.passwordStrength = (score / 5) * 100; // pourcentage
  }

  // ✅ Validation du formulaire
  isFormValid(): boolean {
    return (
      this.currentPassword.length > 0 &&
      this.newPassword.length >= 12 &&
      this.newPassword === this.confirmPassword
    );
  }

  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    this.currentPasswordTouched = true;
    this.newPasswordTouched = true;
    this.confirmPasswordTouched = true;

    if (!this.isFormValid()) {
      alert('Please fix the errors before submitting.');
      return;
    }

    // Ici tu peux appeler ton API pour changer le mot de passe
    alert('Master password changed successfully ✅');

    // Réinitialiser les champs après succès
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordHint = '';
    this.passwordStrength = 0;
    this.passkeyEnabled = false;
    this.currentPasswordTouched = false;
    this.newPasswordTouched = false;
    this.confirmPasswordTouched = false;
  }
}
