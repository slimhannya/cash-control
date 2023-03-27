import { Component, inject, OnInit } from '@angular/core';
import { PersistanceService } from '@common/services/persistance.service';
import { ThemeService } from '@common/services/theme.service';
import { Store } from '@ngrx/store';
import { CategoriesActions } from '@store/categories';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from '@auth/services/auth.service';
import { take, tap } from 'rxjs';
import firebase from 'firebase/compat';
import { AuthActions } from '@store/auth';
import { isLightMode } from '@common/constants/is-light-mode';

@Component({
  selector: 'ctrl-root',
  template: `
    <main><router-outlet></router-outlet></main>

    <p-toast position="top-right"></p-toast>
    <p-confirmDialog />
  `,
})
export class AppComponent implements OnInit {
  private primengConfig: PrimeNGConfig = inject(PrimeNGConfig);
  private store: Store = inject(Store);
  private themeService: ThemeService = inject(ThemeService);
  private authState: AuthService = inject(AuthService);

  private isLightMode: boolean = inject(PersistanceService).get(isLightMode);

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.themeService.setTheme(this.isLightMode);

    this.authState.authState$
      .pipe(
        take(1),
        tap((user: firebase.User | null): void => {
          user && this.dispatchStoreActions();
        })
      )
      .subscribe();
  }

  private dispatchStoreActions(): void {
    this.store.dispatch(CategoriesActions.getCategories());
    this.store.dispatch(AuthActions.loadUserData());
  }
}
