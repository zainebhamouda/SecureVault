import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  
  isEditing: boolean = false;
  avatarColor: string = '#ADD8E6';
  tempAvatarColor: string = this.avatarColor;
  profileImage: string | ArrayBuffer | null = null;
  isModalOpen: boolean = false;

  updateError: string | null = null; // <-- message d'erreur mise à jour

  avatarColors: string[] = [
    "#ADD8E6", "#32CD32", "#FFA500", "#E6A8D7",
    "#FFFF00", "#4B0082", "#00CED1", "#FA8072", "#FF69B4"
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.loadUser(email);
    }
  }

  loadUser(email: string) {
    this.userService.getUserByEmail(email).subscribe({
      next: (user: User) => {
        this.email = user.userEmail;
        const nameParts = user.userName?.trim().split(' ') || [];
        this.lastName = nameParts[0] || '';
        this.firstName = nameParts.slice(1).join(' ') || '';
        localStorage.setItem('firstName', this.firstName);
        localStorage.setItem('lastName', this.lastName);
        localStorage.setItem('fullName', user.userName || '');
      },
      error: err => console.error('Erreur récupération utilisateur:', err)
    });
  }

  toggleEdit() {
    this.isEditing = true;
    this.updateError = null;
  }

  saveChanges() {
  const userName = `${this.lastName} ${this.firstName}`;
  const updateData = { userName, userEmail: this.email };

  this.userService.updateUserByEmail(this.email, updateData).subscribe({
    next: (updatedUser: User) => {
      // Mise à jour réussie
      this.firstName = updatedUser.userName?.split(' ').slice(1).join(' ') || '';
      this.lastName = updatedUser.userName?.split(' ')[0] || '';
      this.email = updatedUser.userEmail || this.email;

      // Mise à jour du localStorage
      localStorage.setItem('firstName', this.firstName);
      localStorage.setItem('lastName', this.lastName);
      localStorage.setItem('fullName', updatedUser.userName || '');
      localStorage.setItem('email', this.email);

      // Remettre le formulaire en lecture seule
      this.isEditing = false;
      this.updateError = null; // pas d'erreur affichée
    },
    error: err => {
      console.error('Erreur mise à jour utilisateur:', err);
      this.updateError = err?.error?.message || 'Erreur lors de la mise à jour';
      // reste en mode édition pour corriger
    }
  });
}



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.profileImage = reader.result;
      reader.readAsDataURL(file);
    }
  }
  // Delete account
deleteAccount() {
  if (confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone!")) {
    this.userService.deleteUserByEmail(this.email).subscribe({
      next: () => {
        alert("Your account has been deleted.");
        // Optionally redirect to login page
        window.location.href = '/login';
      },
      error: err => alert("Error deleting account: " + err.message)
    });
  }
}

// Clear vault
clearVault() {
  if (confirm("Do you really want to clear your vault? All data will be lost!")) {
    this.userService.clearUserVault(this.email).subscribe({
      next: () => alert("Vault cleared successfully."),
      error: err => alert("Error clearing vault: " + err.message)
    });
  }
}

// Revoke active sessions
revokeSessions() {
  if (confirm("Do you want to revoke all your active sessions?")) {
    this.userService.revokeUserSessions(this.email).subscribe({
      next: () => alert("All active sessions have been revoked."),
      error: err => alert("Error revoking sessions: " + err.message)
    });
  }
}

// Disable new device protection
disableDeviceProtection() {
  if (confirm("Do you want to disable protection for new devices?")) {
    this.userService.disableDeviceProtection(this.email).subscribe({
      next: () => alert("New device protection has been disabled."),
      error: err => alert("Error disabling protection: " + err.message)
    });
  }
}


  triggerFileInput(fileInput: HTMLInputElement) { fileInput.click(); }
  getInitials(): string {
    return `${this.lastName.charAt(0).toUpperCase()}${this.firstName.charAt(0).toUpperCase()}`;
  }

  openModal() { this.tempAvatarColor = this.avatarColor; this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }
  saveColor() { this.avatarColor = this.tempAvatarColor; this.closeModal(); }
  setCustomColor(color: string) { this.tempAvatarColor = color; }
  
chooseCustomColor() {}
}
