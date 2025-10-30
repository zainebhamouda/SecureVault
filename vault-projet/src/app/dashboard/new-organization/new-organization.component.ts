import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-organization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-organization.component.html',
  styleUrls: ['./new-organization.component.css']
})
export class NewOrganizationComponent  {
  constructor(private router: Router) {}

  orgName: string = '';
  billingEmail: string = '';
  plan: string = '';
  extraStorage: number = 0;
  cardNumber: string = '';
  cardExpiration: string = '';
  cardCvv: string = '';
  country: string = '';
  postalCode: string = '';

  orgNameTouched: boolean = false;
  billingEmailTouched: boolean = false;
  planTouched: boolean = false;
  extraStorageTouched: boolean = false;
  cardNumberTouched: boolean = false;
  cardExpirationTouched: boolean = false;
  cardCvvTouched: boolean = false;
  countryTouched: boolean = false;
  postalCodeTouched: boolean = false;

  mode: 'admin' | 'manager' | null = null;


   ngOnInit() {
    // Récupérer le mode depuis le DashboardComponent via history.state ou localStorage
    const navState: any = history.state;
    if (navState?.mode) {
      this.mode = navState.mode;
    } else {
      // fallback si non défini (par ex. page reload)
      const storedMode = localStorage.getItem('isAdminMode');
      this.mode = storedMode === 'true' ? 'admin' : 'manager';
    }
  }

  onSubmit() {
    const orgs = JSON.parse(localStorage.getItem('organizations') || '[]');
    const newOrg = {
      id: Date.now(),
      name: this.orgName,
      plan: this.plan
    };
    orgs.unshift(newOrg);
    localStorage.setItem('organizations', JSON.stringify(orgs));

    // 🔹 Navigation selon le mode exact
    if (this.mode === 'admin') {
      this.router.navigate([`/dashboard/organisation/${newOrg.id}`], {
        state: { orgId: newOrg.id, orgName: newOrg.name }
      });
    } else {
      this.router.navigate(['/dashboard/vaults'], { state: { newOrg: newOrg.name } });
    }

    // Reset formulaire
    this.orgName = '';
    this.plan = '';
  }

}
