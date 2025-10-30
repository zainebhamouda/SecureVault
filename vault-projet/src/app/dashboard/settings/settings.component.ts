import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  organization: { id: number; name: string; billingEmail: string; fingerprint: string } = {
    id: 0,
    name: 'Diva',
    billingEmail: 'zaineb.hamouda09@gmail.com',
    fingerprint: 'wackiness-refund-estate-uplifting-egging'
  };

  organizations: { id: number; name: string; billingEmail?: string; fingerprint?: string }[] = [];
  selectedOrgId: number | null = null;
  currentOrgName = '';
  pageTitle = 'Settings';

  // 5 collection management options
  collectionOptions = [
    { key: 'ownersManageAll', label: 'Owners and Administrators can manage all collections', enabled: true },
    { key: 'usersCreateCollections', label: 'Users can create their own collections', enabled: false },
    { key: 'requireApproval', label: 'Require approval for new collections', enabled: false },
    { key: 'defaultAccess', label: 'New members have default access to collections', enabled: true },
    { key: 'allowDelete', label: 'Allow owners to delete collections', enabled: true }
  ];

  constructor(private router: Router) {
    // Charger toutes les organisations depuis le localStorage
    this.organizations = JSON.parse(localStorage.getItem('organizations') || '[]');

    // Retrouver l’organisation active depuis l’état de navigation
    const currentId = history.state?.orgId;
    if (currentId) {
      const found = this.organizations.find(o => o.id === currentId);
      if (found) {
        this.organization = {
          id: found.id,
          name: found.name,
          billingEmail: found.billingEmail || '',
          fingerprint: found.fingerprint || ''
        };
        this.selectedOrgId = found.id;
        this.currentOrgName = found.name;
      }
    }
  }

  saveOrganization(): void {
    console.log('Organization saved:', this.organization);
    alert('Organization information saved successfully!');
  }

  saveCollections(): void {
    console.log('Collections settings updated:', this.collectionOptions);
    alert('Collection settings saved!');
  }

  deleteOrganization(): void {
  if (!confirm('Are you sure you want to delete this organization? This cannot be undone.')) return;

  let orgs: any[] = JSON.parse(localStorage.getItem('organizations') || '[]');

  // Supprimer l’organisation courante
  orgs = orgs.filter(org => org.id !== this.organization.id);
  localStorage.setItem('organizations', JSON.stringify(orgs));

  // Rediriger vers la prochaine organisation si existe
  if (orgs.length > 0) {
    const nextOrg = orgs[0];
    this.router.navigate(['/dashboard/organisation', nextOrg.id], {
      state: { orgId: nextOrg.id, reload: true } // 🔹 ajouter un flag reload
    });
  } else {
    this.router.navigate(['/dashboard']); // aucune org restante
  }

  alert('Organization deleted successfully.');
}


  wipeVault(): void {
    if (confirm('Are you sure you want to wipe the vault? All items will be permanently removed.')) {
      console.log('Vault wiped');
      alert('Vault wiped successfully.');
    }
  }
}
