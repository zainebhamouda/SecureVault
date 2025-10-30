import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VaultService } from '../../services/vault.service';
import{Vault}from '../../services/vault.service';


@Component({
  selector: 'app-vaults',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css']
})
export class VaultsComponent {
  
  // ---- État global ----
  searchText = '';
  selectedVault = 'all';
  selectedType = 'all';
  selectedFolder = 'none';
  selectedCollection = 'Default collection';

  showTypeSelector = false;   // popup choix type
  showAddForm = false;        // formulaire affiché
  currentVaultType: string | null = null;
  userEmail: string = 'john@gmail.com';  // ton email principal
  organizationMembers: { email: string }[] = [
    { email: 'member1@org.com' },
    { email: 'member2@org.com' }
    // ajouter tous les membres des organisations
  ];
  // ---- Liste des types disponibles ----
  vaultTypes = [
    { key: 'login', label: 'Identifiant' },
    { key: 'card', label: 'Carte de paiement' },
    { key: 'identity', label: 'Identité' },
    { key: 'note', label: 'Note' },
    { key: 'ssh', label: 'Clé SSH' },
    { key: 'folder', label: 'Dossier' },
    { key: 'collection', label: 'Collection' }
  ];

  // ---- Champs du formulaire ----
  newVaultName = '';
  newVaultOwner = 'john@gmail.com';
  newVaultFolder = 'Aucun dossier';
  newVaultUsername = '';
  newVaultPassword = '';
  newVaultCardNumber = '';
  newVaultCardExpiry = '';
  newVaultCardCVV = '';
  newVaultNote = '';
  newVaultIdentity = '';
  newVaultSSHKey = '';

  // ---- Données ----
  vaults: Vault[] = [];
  allSelected = false;
  organizations: string[] = ['All Vaults', 'My Vault'];
  folders: string[] = ['No Folder'];
  orgCollectionsMap: { [key: string]: string[] } = {};

  constructor(private router: Router, private vaultService: VaultService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { newOrg?: string };
    if (state?.newOrg) {
      this.addNewOrganization(state.newOrg);
    }
  }

  // ---- Gestion organisations ----
  addNewOrganization(name: string) {
    if (!this.organizations.includes(name)) {
      this.organizations.push(name);
      this.orgCollectionsMap[name] = ['Default collection'];
    }
    this.selectedVault = name;
    this.selectedCollection = this.orgCollectionsMap[name][0];
  }

  goToNewOrganization() {
    this.selectedVault = 'newOrg';
    this.router.navigate(['/dashboard/new-organization']);
  }
  passwordVisible = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.passwordVisible ? 'text' : 'password';
    }
  }
  // ---- Gestion vaults ----
  // ---- Gestion vaults ----
addVault(
  name: string,
  type: string,
  folder: string,
  owner: string,
  organization: string
) {
  const newVault: Vault = {
    name,
    type,
    folder,
    owner,
    organization,
    selected: false,
    color: this.getVaultColor(type),
    icon: this.getVaultIcon(type)
  };

  this.vaults.push(newVault);

  if (!this.organizations.includes(organization)) {
    this.organizations.push(organization);
    this.orgCollectionsMap[organization] = ['Default collection'];
  }

  this.resetForm();
}

  // Add this property to control dropdown visibility
  showDropdown: boolean = false;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.new-item-dropdown')) {
      this.showDropdown = false;
    }
  }
  // ---- Sélection type et formulaire ----
  toggleDropdown(): void {
  this.showDropdown = !this.showDropdown;
 }

  selectVaultType(type: string): void {
  this.currentVaultType = type;
  this.showDropdown = false; // Close the dropdown
  this.showAddForm = true;
  }
  closeForm() {
    this.showAddForm = false;
    this.currentVaultType = null;
    this.resetForm();
  }

  // ---- Table Vaults ----
  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredVaults().forEach(v => (v.selected = checked));
    this.allSelected = checked;
  }

  checkIfAllSelected() {
    this.allSelected = this.filteredVaults().every(v => v.selected);
  }

  selectVault(v: string) {
    this.selectedVault = v;
    this.selectedCollection = this.orgCollectionsMap[v]?.[0] || 'Default collection';
  }

  selectType(t: string) { this.selectedType = t; }
  selectFolder(f: string) { this.selectedFolder = f; }
  selectCollection(c: string) { this.selectedCollection = c; }

  filteredVaults(): Vault[] {
    if (this.selectedVault === 'all') return this.vaults;
    if (this.selectedVault === 'my') return this.vaults.filter(v => v.organization === 'My Vault');
    return this.vaults.filter(v => v.organization === this.selectedVault);
  }

  showAddNewItemButton(): boolean {
    return !!this.orgCollectionsMap[this.selectedVault];
  }

  showCollections(): boolean {
    return !!this.orgCollectionsMap[this.selectedVault];
  }

  // ---- Utils ----
  public resetForm() {
    this.newVaultName = '';
    this.newVaultFolder = 'Aucun dossier';
    this.newVaultOwner = '';
    this.newVaultUsername = '';
    this.newVaultPassword = '';
    this.newVaultCardNumber = '';
    this.newVaultCardExpiry = '';
    this.newVaultCardCVV = '';
    this.newVaultNote = '';
    this.newVaultIdentity = '';
    this.newVaultSSHKey = '';
    this.identityFirstName = '';
    this.identityLastName = '';
    this.identityEmail = '';
    this.identityPhone = '';
    this.identityDOB = '';
    this.identityGender = '';
    this.identityAddress = '';
    this.identityCity = '';
    this.identityZipCode = '';
    this.identityCountry = '';
    this.identityPassport = '';
    this.identityLicense = '';
    this.noteCategory = '';
    this.noteTags = [];
    this.notePriority = 'medium';
    this.characterCount = 0;
    this.wordCount = 0;
    this.folderDescription = '';
    this.selectedFolderColor = '#1e88e5';
  }
 

// ouvrir le formulaire pour + New Item
openAddForm() {
  this.currentVaultType = null;  // formulaire général
  this.showAddForm = true;
}


saveVaultByType() {
  if (!this.currentVaultType) return;

  switch (this.currentVaultType) {
    case 'login':
      this.addVault(
        this.newVaultName,
        'login',
        this.newVaultFolder,
        this.newVaultOwner,
        'My Vault'
      );
      break;
    case 'card':
      this.addVault(
        this.newVaultName,
        'card',
        this.newVaultFolder,
        this.newVaultOwner,
        'My Vault'
      );
      break;
    case 'note':
      this.addVault(
        this.newVaultName,
        'note',
        this.newVaultFolder,
        this.newVaultOwner,
        'My Vault'
      );
      break;
    // Ajouter les autres types si besoin : identity, ssh, folder, collection
  }

  // Réinitialiser le formulaire
  this.resetForm();
  this.showAddForm = false;
}
cvvVisible = false;

toggleCVVVisibility(): void {
  this.cvvVisible = !this.cvvVisible;
  const cvvInput = document.querySelector('input[name="cvv"]') as HTMLInputElement;
  if (cvvInput) {
    cvvInput.type = this.cvvVisible ? 'text' : 'password';
  }
}

formatCardNumber(event: any): void {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 16) {
    value = value.slice(0, 16);
  }
  
  // Add spaces every 4 digits
  value = value.replace(/(\d{4})/g, '$1 ').trim();
  this.newVaultCardNumber = value;
}

formatExpiryDate(event: any): void {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 4) {
    value = value.slice(0, 4);
  }
  
  // Add slash after 2 digits
  if (value.length > 2) {
    value = value.slice(0, 2) + '/' + value.slice(2);
  }
  this.newVaultCardExpiry = value;
}
//typescript for identity form 
identityFirstName: string = '';
identityLastName: string = '';
identityEmail: string = '';
identityPhone: string = '';
identityDOB: string = '';
identityGender: string = '';
identityAddress: string = '';
identityCity: string = '';
identityZipCode: string = '';
identityCountry: string = '';
identityPassport: string = '';
identityLicense: string = '';
// Phone number formatting
formatPhoneNumber(event: any): void {
  let value = event.target.value.replace(/\D/g, '');
  
  if (value.length > 10) {
    value = value.slice(0, 10);
  }
  
  // Format as (555) 123-4567
  if (value.length > 6) {
    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
  } else if (value.length > 3) {
    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
  } else if (value.length > 0) {
    value = `(${value}`;
  }
  
  this.identityPhone = value;
}

// Save identity method
saveIdentity(): void {
  // Combine first and last name for the vault name if not provided
  if (!this.newVaultName && (this.identityFirstName || this.identityLastName)) {
    this.newVaultName = `${this.identityFirstName} ${this.identityLastName}`.trim();
  }
  
  this.addVault(
    this.newVaultName,
    'identity',
    this.newVaultFolder,
    this.identityEmail || this.newVaultOwner,
    'My Vault'
  );
}
//typescript for note form 
// Add to your component class - Note Properties
noteCategory: string = '';
noteTags: string[] = [];
notePriority: string = 'medium';
characterCount: number = 0;
wordCount: number = 0;

// ViewChild for textarea access - FIXED
@ViewChild('noteTextarea', { static: false }) noteTextarea!: ElementRef;

// Character and word count
updateCharacterCount(): void {
  this.characterCount = this.newVaultNote.length;
  this.wordCount = this.newVaultNote.trim() ? this.newVaultNote.trim().split(/\s+/).length : 0;
}

// Text formatting - FIXED
formatText(format: string): void {
  if (!this.noteTextarea) return;
  
  const textarea = this.noteTextarea.nativeElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = this.newVaultNote.substring(start, end);
  
  let formattedText = '';
  let wrapStart = '';
  let wrapEnd = '';
  
  switch (format) {
    case 'bold':
      wrapStart = '**';
      wrapEnd = '**';
      break;
    case 'italic':
      wrapStart = '_';
      wrapEnd = '_';
      break;
    case 'underline':
      wrapStart = '__';
      wrapEnd = '__';
      break;
    case 'ul':
      formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
      break;
    case 'ol':
      formattedText = selectedText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
      break;
  }
  
  if (format === 'ul' || format === 'ol') {
    this.newVaultNote = this.newVaultNote.substring(0, start) + formattedText + this.newVaultNote.substring(end);
    const newPosition = start + formattedText.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    });
  } else {
    this.newVaultNote = this.newVaultNote.substring(0, start) + wrapStart + selectedText + wrapEnd + this.newVaultNote.substring(end);
    const newPosition = start + wrapStart.length + selectedText.length + wrapEnd.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    });
  }
  
  this.updateCharacterCount();
}

// Insert current date/time
insertCurrentDateTime(): void {
  if (!this.noteTextarea) return;
  
  const now = new Date();
  const dateTime = now.toLocaleString();
  const textarea = this.noteTextarea.nativeElement;
  const start = textarea.selectionStart;
  
  this.newVaultNote = this.newVaultNote.substring(0, start) + dateTime + this.newVaultNote.substring(start);
  
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + dateTime.length, start + dateTime.length);
  });
  
  this.updateCharacterCount();
}

// Tags management
addTag(input: HTMLInputElement): void {
  const tag = input.value.trim();
  if (tag && !this.noteTags.includes(tag)) {
    this.noteTags.push(tag);
  }
  input.value = '';
  input.focus();
}

removeTag(index: number): void {
  this.noteTags.splice(index, 1);
}

handleBackspace(input: HTMLInputElement): void {
  if (input.value === '' && this.noteTags.length > 0) {
    this.noteTags.pop();
  }
}

// Note preview with basic formatting - FIXED
getNotePreview(): string {
  let preview = this.newVaultNote;
  
  // Basic Markdown-like formatting - FIXED the string replacement syntax
  preview = preview.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  preview = preview.replace(/_(.*?)_/g, '<em>$1</em>');
  preview = preview.replace(/__(.*?)__/g, '<u>$1</u>');
  preview = preview.replace(/^- (.*)$/gm, '• $1');
  preview = preview.replace(/^\d+\. (.*)$/gm, '$1');
  
  // Preserve line breaks
  preview = preview.replace(/\n/g, '<br>');
  
  return preview;
}




// Add to your component class - Folder Properties
folderDescription: string = '';
selectedFolderColor: string = '#1e88e5'; // Default blue
folderColors: string[] = [
  '#1e88e5', // Blue
  '#43a047', // Green
  '#fbc02d', // Yellow
  '#ff7043', // Orange
  '#e53935', // Red
  '#9c27b0', // Purple
  '#00acc1', // Teal
  '#795548'  // Brown
];

// Update folder name validation
updateFolderName(): void {
  if (this.newVaultName.length > 50) {
    this.newVaultName = this.newVaultName.slice(0, 50);
  }
}

// Select folder color
selectFolderColor(color: string): void {
  this.selectedFolderColor = color;
}
 openTypeSelector(): void {
    this.showTypeSelector = true;
  }

// Save folder method
saveFolder(): void {
  if (!this.newVaultName.trim()) return;
  
  // Here you would typically save the folder to your backend
  // For now, we'll just add it to the folders list
  const folderName = this.newVaultName.trim();
  
  if (!this.folders.includes(folderName)) {
    this.folders.push(folderName);
  }
  
  // Create a vault entry for the folder
  this.addVault(
    folderName,
    'folder',
    'None', // Folders don't belong to other folders
    this.newVaultOwner,
    'My Vault'
  );
  
  // Reset and close form
  this.resetForm();
  this.closeForm();
}

saveVault() {
  if (!this.currentVaultType) return;

  let vaultToSave: Vault = {
    name: this.newVaultName,
    type: this.currentVaultType,
    folder: this.newVaultFolder,
    owner: this.newVaultOwner,
    organization: 'My Vault'
  };

  // Ajouter des champs spécifiques selon le type
  switch (this.currentVaultType) {
    case 'login':
      vaultToSave = { ...vaultToSave, username: this.newVaultUsername, password: this.newVaultPassword };
      break;
    case 'card':
      vaultToSave = { ...vaultToSave, cardNumber: this.newVaultCardNumber, cardExpiry: this.newVaultCardExpiry, cvv: this.newVaultCardCVV };
      break;
    case 'note':
      vaultToSave = { ...vaultToSave, note: this.newVaultNote, category: this.noteCategory, tags: this.noteTags, priority: this.notePriority };
      break;
    case 'identity':
      vaultToSave = { 
        ...vaultToSave, 
        firstName: this.identityFirstName, lastName: this.identityLastName, email: this.identityEmail, phone: this.identityPhone,
        dob: this.identityDOB, gender: this.identityGender, address: this.identityAddress,
        city: this.identityCity, zip: this.identityZipCode, country: this.identityCountry,
        passport: this.identityPassport, license: this.identityLicense
      };
      break;
    case 'folder':
      vaultToSave = { ...vaultToSave, description: this.folderDescription, color: this.selectedFolderColor };
      break;
  }

  // 1️⃣ Ajouter au tableau principal pour affichage immédiat
  this.vaults.push(vaultToSave);

  // 2️⃣ Sauvegarder dans la base de données
  this.vaultService.addVault(vaultToSave).subscribe({
    next: (res) => console.log('Vault enregistré:', res),
    error: (err) => console.error('Erreur lors de l\'enregistrement:', err)
  });

  // 3️⃣ Réinitialiser le formulaire
  this.resetForm();
  this.showAddForm = false;
  this.currentVaultType = null;
}
// Définir les couleurs pastel selon le type
getVaultColor(type: string): string {
  switch(type) {
    case 'login': return '#cce5ff';      // bleu pastel
    case 'note': return '#d4edda';       // vert pastel
    case 'card': return '#fff3cd';       // jaune pastel
    case 'identity': return '#f8d7da';   // rose pastel
    case 'ssh': return '#e2e3e5';        // gris pastel
    default: return '#f0f0f0';           // gris clair par défaut
  }
}

// Définir les icônes selon le type
getVaultIcon(type: string): string {
  switch(type) {
    case 'login': return 'fas fa-user';
    case 'note': return 'fas fa-sticky-note';
    case 'card': return 'fas fa-credit-card';
    case 'identity': return 'fas fa-id-card';
    case 'ssh': return 'fas fa-key';
    default: return 'fas fa-box';
  }
}

}