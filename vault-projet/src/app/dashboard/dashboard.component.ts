import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Navigation } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'My Profile';
  profileImage: string | null = null;
  currentOrgName = '';
  openSubmenu: string | null = null;
  isAdminMode = false;

  // Liste d’organisations
  organizations: { id: number; name: string }[] = [];

  selectedOrgId: number | null = null;
  selectedOrgName: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    // Toujours recharger la liste des organisations depuis localStorage
    this.organizations = JSON.parse(localStorage.getItem('organizations') || '[]');

    // Vérifier si on a besoin de sélectionner l'organisation passée dans state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { orgId?: number; reload?: boolean };

    if (state?.orgId) {
      const found = this.organizations.find(o => o.id === state.orgId);
      if (found) {
        this.selectedOrgId = found.id;
        this.selectedOrgName = found.name;
      }
    }

    this.updatePageTitle(this.router.url);
  }
});

  }
private updatePageTitle(url: string): void {
  this.currentOrgName = ''; // Reset par défaut

  // Profil
  if (url.includes('/dashboard/profile')) {
    this.pageTitle = 'My Profile';
  } 
  // Vaults
  else if (url.includes('/dashboard/vaults')) {
    const nav: Navigation | null = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { newOrg?: string };
    this.pageTitle = state?.newOrg ?? 'My Vaults';
  } 
  // Nouvelle organisation
  else if (url.includes('/dashboard/new-organization')) {
    this.pageTitle = 'New Organization';
  } 
  // Dashboard statique
  else if (url.includes('/dashboard/statique')) {
    this.pageTitle = 'Dashboard';
  } 
  // Organisation overview
  else if (url.match(/\/dashboard\/organisation\/\d+$/)) {
    this.pageTitle = 'Organisation';
    this.currentOrgName = this.selectedOrgName;
  }
  // Members spécifiques
  else if (url.includes('/dashboard/organisation') && url.includes('/members')) {
    this.pageTitle = 'Members';
    this.currentOrgName = this.selectedOrgName;
  } 
  // Settings spécifiques
  else if (url.includes('/dashboard/organisation') && url.includes('/settings')) {
    this.pageTitle = 'Settings';
    this.currentOrgName = this.selectedOrgName;
  } 
  // Settings généraux
  else if (url.includes('/dashboard/security')) {
    this.pageTitle = 'Settings - Security';
  } else if (url.includes('/dashboard/performance')) {
    this.pageTitle = 'Settings - Performance';
  } else if (url.includes('/dashboard/notifications')) {
    this.pageTitle = 'Settings - Notification';
  } 
  // Tools
  else if (url.includes('/dashboard/password-generator')) {
    this.pageTitle = 'Tools - Password Generator';
  } 
  // Admin
  else if (url.includes('/admin')) {
    this.pageTitle = 'Admin Console';
  } 
  else if (url.includes('/dashboard/chat')) {
    this.pageTitle = 'SecureVault Chatbot';
  } 
  // Default
  else {
    this.pageTitle = 'My Profile';
  }
}


  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSubmenu(menu: string): void {
    this.openSubmenu = this.openSubmenu === menu ? null : menu;
  }

goToNewOrganization(event: Event) {
  event.stopPropagation();
  const mode = this.isAdminMode ? 'admin' : 'manager';
  this.router.navigate(['/dashboard/new-organization'], { state: { mode } });
  this.pageTitle = 'New Organization';
}

  

setMode(mode: 'manager' | 'admin'): void {
  this.isAdminMode = (mode === 'admin');
  localStorage.setItem('isAdminMode', this.isAdminMode.toString());

  if (this.isAdminMode) {
    this.pageTitle = 'Admin Console';
    this.router.navigate(['/admin']);
  } else {
    this.pageTitle = 'My Profile';  // titre par défaut
    this.router.navigate(['/dashboard/profile']); // naviguer vers profile
  }
}




  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  
selectOrganization(org: { id: number; name: string }, event?: Event): void {
  event?.stopPropagation();

  this.selectedOrgId = org.id;
  this.selectedOrgName = org.name;

  // Naviguer vers l’overview de l’organisation
  this.router.navigate(['/dashboard/organisation', org.id]);
}

navigateToMembers(): void {
  if (!this.selectedOrgId) return;
  this.router.navigate(['/dashboard/organisation', this.selectedOrgId, 'members']);
}

navigateToSettings(): void {
  if (!this.selectedOrgId) return;
  this.router.navigate(['/dashboard/organisation', this.selectedOrgId, 'settings']);
}


  openOptionsId: number | null = null;

toggleOptions(orgId: number, event: Event) {
  event.stopPropagation(); // éviter que le clic sélectionne l’organisation
  this.openOptionsId = this.openOptionsId === orgId ? null : orgId;
}
deleteOrganization(orgId: number) {
  // Récupérer la liste
  let orgs = JSON.parse(localStorage.getItem('organizations') || '[]');
  orgs = orgs.filter((org: any) => org.id !== orgId);
  localStorage.setItem('organizations', JSON.stringify(orgs));

  // Mettre à jour la liste affichée
  this.organizations = orgs;
  this.openOptionsId = null;

  // Si l'organisation supprimée était sélectionnée -> reset
  if (this.selectedOrgId === orgId) {
    this.selectedOrgId = null;
    this.currentOrgName = '';
    this.pageTitle = 'Admin console';  // ✅ on force le retour
  }

  // Si plus aucune organisation n’existe
  if (this.organizations.length === 0) {
    this.selectedOrgId = null;
    this.currentOrgName = '';
    this.pageTitle = 'Admin console';
  }
}

}





