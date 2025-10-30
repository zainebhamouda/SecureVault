import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notification {
  id: number;
  type: 'invite' | 'alert' | 'info';
  message: string;
  time: string;
  from?: string;
  organization?: string;
}

@Component({
  selector: 'app-notifications-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.css']
})
export class NotificationsSettingsComponent {
  // Préférences de réception
  emailNotifications = true;
  pushNotifications = false;
  smsNotifications = false;

  // Liste des notifications dynamiques
  notifications: Notification[] = [
    {
      id: 1,
      type: 'invite',
      from: 'ayml',
      organization: 'Team SecureVault',
      message: 'vous a invité à rejoindre l’organisation',
      time: 'Il y a 2 minutes'
    },
    {
      id: 2,
      type: 'alert',
      message: 'Nouvelle connexion détectée depuis Tunisie, Chrome.',
      time: 'Il y a 1 heure'
    },
    {
      id: 3,
      type: 'info',
      message: 'Votre mot de passe principal doit être mis à jour régulièrement.',
      time: 'Hier'
    }
  ];

  // Sauvegarde des préférences
  saveSettings(): void {
    alert('Préférences de notification enregistrées ✅');
  }

  // Actions spécifiques
  acceptInvite(notification: Notification): void {
    alert(`Invitation acceptée pour rejoindre ${notification.organization}`);
    this.removeNotification(notification.id);
  }

  declineInvite(notification: Notification): void {
    alert(`Invitation refusée de ${notification.from}`);
    this.removeNotification(notification.id);
  }

  // Supprimer une notification
  private removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}
