import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Vault } from '../../services/vault.service';

interface VaultItem {
  id: number;
  type: string;
  name: string;
  owner: string;
  selected?: boolean;
}

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {

  // ---- Sidebar / filtre ----
  selectedType: string = 'all';
  searchText: string = '';
  selectedVault: string = 'all';
  selectedFolder: string = 'none';
  selectedCollection: string = 'Default collection';

  // ---- Vaults / Items ----
  vaultItems: VaultItem[] = [];
  vaults: Vault[] = [];
  allSelected: boolean = false;

  // ---- Dropdown + formulaire ----
  showDropdown: boolean = false;
  showTypeSelector: boolean = false;
  showAddForm: boolean = false;
  currentVaultType: string | null = null;

  // ---- Nouveau Vault ----
  newVaultName: string = '';
  newVaultOwner: string = 'zaineb.hamouda09@gmail.com';
  newVaultFolder: string = 'Aucun dossier';
  newVaultUsername = '';
  newVaultPassword = '';
  newVaultCardNumber = '';
  newVaultCardExpiry = '';
  newVaultCardCVV = '';
  newVaultNote = '';
  newVaultIdentity = '';
  newVaultSSHKey = '';

  // ---- Organisation courante ----
  currentOrgName: string = 'My Organization';
  currentOrgId: number | null = null;

  // ---- Identity ----
  identityFirstName = '';
  identityLastName = '';
  identityEmail = '';
  identityPhone = '';
  identityDOB = '';
  identityGender = '';
  identityAddress = '';
  identityCity = '';
  identityZipCode = '';
  identityCountry = '';
  identityPassport = '';
  identityLicense = '';

  // ---- Note ----
  noteCategory = '';
  noteTags: string[] = [];
  notePriority = 'medium';
  characterCount = 0;
  wordCount = 0;

  @ViewChild('noteTextarea', { static: false }) noteTextarea!: ElementRef;

  // ---- Folder ----
  folderDescription = '';
  selectedFolderColor = '#1e88e5';
  folderColors = ['#1e88e5', '#43a047', '#fbc02d', '#ff7043', '#e53935', '#9c27b0', '#00acc1', '#795548'];

  // ---- Organisations / collections ----
  userEmail: string = 'zaineb.hamouda09@gmail.com';
  organizationMembers: { email: string }[] = [
    { email: 'member1@org.com' },
    { email: 'member2@org.com' }
  ];
  organizations: string[] = ['All Vaults', 'My Vault'];
  folders: string[] = ['No Folder'];
  orgCollectionsMap: { [key: string]: string[] } = {};
  vaultTypes = [
    { key: 'login', label: 'Identifiant' },
    { key: 'card', label: 'Carte de paiement' },
    { key: 'identity', label: 'Identité' },
    { key: 'note', label: 'Note' },
    { key: 'ssh', label: 'Clé SSH' },
    { key: 'folder', label: 'Dossier' },
    { key: 'collection', label: 'Collection' }
  ];

  // ---- Password / CVV visibility ----
  passwordVisible = false;
  cvvVisible = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { newOrg?: string };
    if (state?.newOrg) {
      this.addNewOrganization(state.newOrg);
    }
  }

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.router.routerState.root.paramMap.subscribe(params => {
      const orgId = params.get('id');
      if (orgId) this.currentOrgId = +orgId;
    });

    // Charger les items
    this.vaultItems = JSON.parse(localStorage.getItem('vaultItems') || '[]');
  }

  // ---- Filtrage / Table ----
  selectType(type: string) { this.selectedType = type; }
  selectVault(v: string) { 
    this.selectedVault = v; 
    this.selectedCollection = this.orgCollectionsMap[v]?.[0] || 'Default collection';
  }
  selectFolder(f: string) { this.selectedFolder = f; }
  selectCollection(c: string) { this.selectedCollection = c; }

  filteredVaults(): Vault[] {
    if (this.selectedVault === 'all') return this.vaults;
    if (this.selectedVault === 'my') return this.vaults.filter(v => v.organization === 'My Vault');
    return this.vaults.filter(v => v.organization === this.selectedVault);
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredVaults().forEach(v => (v.selected = checked));
    this.allSelected = checked;
  }

  checkIfAllSelected() {
    this.allSelected = this.filteredVaults().every(v => v.selected);
  }

  // ---- Dropdown / Form ----
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.new-item-dropdown')) this.showDropdown = false;
  }

  toggleDropdown() { this.showDropdown = !this.showDropdown; }
  selectVaultType(type: string) {
    this.currentVaultType = type;
    this.showAddForm = true;
    this.showDropdown = false;
  }

  openAddForm() {
    this.currentVaultType = null;
    this.showAddForm = true;
  }

  closeForm() {
    this.showAddForm = false;
    this.currentVaultType = null;
    this.resetForm();
  }

  resetForm() {
    this.newVaultName = '';
    this.newVaultOwner = '';
    this.newVaultFolder = 'Aucun dossier';
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

  // ---- Vault CRUD ----
  addVault(name: string, type: string, folder: string, owner: string, organization: string) {
    const newVault: Vault = { name, type, folder, owner, organization, selected: false };
    this.vaults.push(newVault);

    if (!this.organizations.includes(organization)) {
      this.organizations.push(organization);
      this.orgCollectionsMap[organization] = ['Default collection'];
    }

    this.resetForm();
  }

  saveVaultByType() {
    if (!this.currentVaultType) return;
    this.addVault(
      this.newVaultName,
      this.currentVaultType,
      this.newVaultFolder,
      this.newVaultOwner,
      'My Vault'
    );
    this.closeForm();
  }

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

  // ---- Password / CVV ----
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const input = document.querySelector('input[name="password"]') as HTMLInputElement;
    if (input) input.type = this.passwordVisible ? 'text' : 'password';
  }

  toggleCVVVisibility() {
    this.cvvVisible = !this.cvvVisible;
    const input = document.querySelector('input[name="cvv"]') as HTMLInputElement;
    if (input) input.type = this.cvvVisible ? 'text' : 'password';
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '').slice(0, 16);
    this.newVaultCardNumber = value.replace(/(\d{4})/g, '$1 ').trim();
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '').slice(0, 4);
    this.newVaultCardExpiry = value.length > 2 ? value.slice(0, 2) + '/' + value.slice(2) : value;
  }

  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '').slice(0, 10);
    if (value.length > 6) value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
    else if (value.length > 3) value = `(${value.slice(0,3)}) ${value.slice(3)}`;
    else if (value.length > 0) value = `(${value}`;
    this.identityPhone = value;
  }

  saveIdentity() {
    if (!this.newVaultName && (this.identityFirstName || this.identityLastName)) {
      this.newVaultName = `${this.identityFirstName} ${this.identityLastName}`.trim();
    }
    this.addVault(this.newVaultName, 'identity', this.newVaultFolder, this.identityEmail || this.newVaultOwner, 'My Vault');
  }

  // ---- Note ----
  updateCharacterCount() {
    this.characterCount = this.newVaultNote.length;
    this.wordCount = this.newVaultNote.trim() ? this.newVaultNote.trim().split(/\s+/).length : 0;
  }

  formatText(format: string) {
    if (!this.noteTextarea) return;
    const textarea = this.noteTextarea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.newVaultNote.substring(start, end);
    let formattedText = '';
    let wrapStart = '';
    let wrapEnd = '';

    switch (format) {
      case 'bold': wrapStart = '**'; wrapEnd = '**'; break;
      case 'italic': wrapStart = '_'; wrapEnd = '_'; break;
      case 'underline': wrapStart = '__'; wrapEnd = '__'; break;
      case 'ul': formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n'); break;
      case 'ol': formattedText = selectedText.split('\n').map((line, idx) => `${idx + 1}. ${line}`).join('\n'); break;
    }

    if (format === 'ul' || format === 'ol') {
      this.newVaultNote = this.newVaultNote.substring(0, start) + formattedText + this.newVaultNote.substring(end);
      setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + formattedText.length, start + formattedText.length); });
    } else {
      this.newVaultNote = this.newVaultNote.substring(0, start) + wrapStart + selectedText + wrapEnd + this.newVaultNote.substring(end);
      setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + wrapStart.length + selectedText.length + wrapEnd.length, start + wrapStart.length + selectedText.length + wrapEnd.length); });
    }

    this.updateCharacterCount();
  }

  insertCurrentDateTime() {
    if (!this.noteTextarea) return;
    const now = new Date();
    const dateTime = now.toLocaleString();
    const textarea = this.noteTextarea.nativeElement;
    const start = textarea.selectionStart;
    this.newVaultNote = this.newVaultNote.substring(0, start) + dateTime + this.newVaultNote.substring(start);
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + dateTime.length, start + dateTime.length); });
    this.updateCharacterCount();
  }

  addTag(input: HTMLInputElement) {
    const tag = input.value.trim();
    if (tag && !this.noteTags.includes(tag)) this.noteTags.push(tag);
    input.value = '';
    input.focus();
  }

  removeTag(index: number) { this.noteTags.splice(index, 1); }
  handleBackspace(input: HTMLInputElement) { if (input.value === '' && this.noteTags.length > 0) this.noteTags.pop(); }

  getNotePreview(): string {
    let preview = this.newVaultNote;
    preview = preview.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                     .replace(/_(.*?)_/g, '<em>$1</em>')
                     .replace(/__(.*?)__/g, '<u>$1</u>')
                     .replace(/^- (.*)$/gm, '• $1')
                     .replace(/^\d+\. (.*)$/gm, '$1')
                     .replace(/\n/g, '<br>');
    return preview;
  }

  // ---- Folder ----
  updateFolderName() { if (this.newVaultName.length > 50) this.newVaultName = this.newVaultName.slice(0, 50); }
  selectFolderColor(color: string) { this.selectedFolderColor = color; }

  openTypeSelector() { this.showTypeSelector = true; }

  saveFolder() {
    if (!this.newVaultName.trim()) return;
    const folderName = this.newVaultName.trim();
    if (!this.folders.includes(folderName)) this.folders.push(folderName);
    this.addVault(folderName, 'folder', 'None', this.newVaultOwner, 'My Vault');
    this.resetForm();
    this.closeForm();
  }
}
