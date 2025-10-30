import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-performance-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './performance-settings.component.html',
  styleUrls: ['./performance-settings.component.css']
})
export class PerformanceSettingsComponent {
  timeout = 15;
  language = 'default';
  theme = 'light';

  constructor(private renderer: Renderer2) {}

  saveSettings(): void {
    this.applyTheme();
    this.applyLanguage();
    alert('Settings saved');
  }

  public applyTheme(): void {
    if (this.theme === 'dark') {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  public applyLanguage(): void {
    if (this.language === 'fr') {
      localStorage.setItem('lang', 'fr');
      location.reload();
    } else if (this.language === 'en') {
      localStorage.setItem('lang', 'en');
      location.reload();
    } else {
      localStorage.removeItem('lang');
      location.reload();
    }
  }
  
}
