import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent {
  searchText: string = '';
  inviteFormVisible = false;
  newMemberEmail = '';
  members = [
    { name: 'zainebHamouda', email: 'zaineb.hamouda09@gmail.com', role: 'Propriétaire', collection: 'Collection par défaut', status: 'Tous' },
    { name: 'JohnDoe', email: 'john.doe@gmail.com', role: 'Utilisateur', collection: 'Collection par défaut', status: 'Invité' }
  ];

  get filteredMembers() {
    if (!this.searchText) return this.members;
    const term = this.searchText.toLowerCase();
    return this.members.filter(m =>
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.role.toLowerCase().includes(term) ||
      m.collection.toLowerCase().includes(term) ||
      m.status.toLowerCase().includes(term)
    );
  }

  openInviteForm() {
    this.inviteFormVisible = true;
  }

  closeInviteForm() {
    this.inviteFormVisible = false;
    this.newMemberEmail = '';
  }

  addMember() {
    if(this.newMemberEmail.trim()) {
      this.members.push({
        name: this.newMemberEmail.split('@')[0],
        email: this.newMemberEmail,
        role: 'Utilisateur',
        collection: 'Collection par défaut',
        status: 'Invité'
      });
      this.closeInviteForm();
    }
  }
openMemberOptions: number | null = null;

toggleMemberOptions(index: number, event: Event) {
  event.stopPropagation(); // empêche la sélection du membre
  this.openMemberOptions = this.openMemberOptions === index ? null : index;
}

deleteMember(index: number) {
  if (!confirm(`Are you sure you want to delete ${this.filteredMembers[index].name}?`)) return;

  this.filteredMembers.splice(index, 1);

  if (this.selectedOrgId) {
    localStorage.setItem(
      `org_${this.selectedOrgId}_members`,
      JSON.stringify(this.filteredMembers)
    );
  }

  this.openMemberOptions = null;
}
selectedOrgId: number = history.state?.orgId || 0;
organizationId: number = history.state?.orgId || 0;
}
