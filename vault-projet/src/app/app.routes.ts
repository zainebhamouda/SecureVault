import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { VaultsComponent } from './dashboard/vaults/vaults.component';
import { DashboardStatiqueComponent } from './dashboard/dashboard-statique/dashboard-statique.component';
import { NewOrganizationComponent } from './dashboard/new-organization/new-organization.component';
import { PerformanceSettingsComponent } from './dashboard/performance-settings/performance-settings.component';
import { NotificationsSettingsComponent } from './dashboard/notifications-settings/notifications-settings.component';
import { SecuritySettingsComponent } from './dashboard/security-settings/security-settings.component';
import { PasswordGeneratorComponent } from './dashboard/password-generator/password-generator.component';
import { OrganisationComponent } from './dashboard/organisation/organisation.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { MembersComponent } from './dashboard/members/members.component';
import { ChatbotComponent } from './dashboard/chatbot/chatbot.component';


export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'vaults', component: VaultsComponent },
      { path: 'statique', component: DashboardStatiqueComponent },
      { path: 'new-organization', component: NewOrganizationComponent },
      { path: 'notifications', component: NotificationsSettingsComponent },
      { path: 'performance', component: PerformanceSettingsComponent },
      { path: 'security', component: SecuritySettingsComponent },
      { path: 'password-generator', component: PasswordGeneratorComponent },
      { path: 'organisation', component: OrganisationComponent },
      { path: 'organisation/:id', component: OrganisationComponent },
      { path: 'organisation/:id/members', component: MembersComponent },
      { path: 'organisation/:id/settings', component: SettingsComponent },
      { path: 'chat', component: ChatbotComponent }
    ]
  },
  
];
