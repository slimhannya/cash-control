import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '#pages/auth/models';
import { AuthSelectors } from '#store/auth';

@Component({
  selector: 'ctrl-user-info',
  styleUrl: './user-info.component.scss',
  template: `
    @if (user$ | async; as user) {
      <div class="user-info gap-4">
        <img [src]="user.photoURL" alt="profile" class="user-info__img" lazyImg />
        <div>
          <p class="user-info__name">{{ user.displayName }}</p>
          <small>{{ user.email }}</small>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  public readonly user$: Observable<User | null> = inject(Store).select(AuthSelectors.user);
}
