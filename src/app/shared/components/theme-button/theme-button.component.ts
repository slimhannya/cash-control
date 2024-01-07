import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PrimeIcons } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { isLightMode } from '#core/constants';
import { PersistanceService } from '#core/services';

const imports = [ToggleButtonModule, FormsModule];

@Component({
  selector: 'org-theme-button',
  template: `
    <p-toggleButton [onIcon]="PrimeIcons.SUN" [offIcon]="PrimeIcons.MOON" [(ngModel)]="isLightMode" (onChange)="toggleTheme()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports,
})
export class ThemeButtonComponent {
  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly persistanceService: PersistanceService
  ) {
    this.#themeLink = this.document.getElementById('theme-link') as HTMLLinkElement;
  }

  isLightMode: boolean = !!inject(PersistanceService).get(isLightMode);
  readonly PrimeIcons: typeof PrimeIcons = PrimeIcons;

  #themeLink: HTMLLinkElement;

  public toggleTheme(): void {
    this.#themeLink.href = this.isLightMode ? 'light-theme.css' : 'dark-theme.css';
    this.persistanceService.set(isLightMode, this.isLightMode);
  }
}
