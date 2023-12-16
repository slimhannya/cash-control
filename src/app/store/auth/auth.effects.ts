import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase/compat';
import { catchError, exhaustMap, from, map, of, takeUntil, tap } from 'rxjs';

import { AuthApiService } from '#auth/services';
import { AppPaths, ToastStatus } from '#common/enums';
import { DbSubscriptionService, ToastService } from '#common/services';
import { setUser } from '#common/utils/set-user';
import { AuthActions } from '#store/auth';
import { ActionTypes } from '#store/auth/action-types';

@Injectable()
export class AuthEffects {
  private readonly router: Router = inject(Router);
  private readonly actions$: Actions = inject(Actions);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly authApiService: AuthApiService = inject(AuthApiService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly dbSubscriptionService: DbSubscriptionService = inject(DbSubscriptionService);

  public signInWithGoogle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signInWithGoogle),
      exhaustMap(() => {
        return from(this.authApiService.signinWithGoogle()).pipe(
          map(({ user }: firebase.auth.UserCredential) => AuthActions.userAuthenticated({ user: setUser(user!) })),
          tap(() => this.router.navigateByUrl(AppPaths.DASHBOARD)),
          catchError(() => of(AuthActions.userNotAuthenticated()))
        );
      })
    );
  });

  public signInWithGoogleSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.userAuthenticated),
        exhaustMap(({ user }) => this.authApiService.addUserToDatabase$(user))
      );
    },
    { dispatch: false }
  );

  public signOut$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signOut),
      exhaustMap((): Promise<void> => this.authApiService.signOut()),
      map(() => AuthActions.userNotAuthenticated()),
      tap(() => this.router.navigateByUrl(`/${AppPaths.AUTHENTICATION}`))
    );
  });

  public signInWithEmailAndPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signInWithEmailAndPassword),
      exhaustMap(({ payload }) => {
        return from(this.authApiService.signInWithEmailAndPassword(payload)).pipe(
          map(() => AuthActions.signInWithEmailAndPasswordSuccess()),
          tap(() => this.router.navigateByUrl(`/${AppPaths.DASHBOARD}`)),
          catchError(({ message }: HttpErrorResponse) => of(AuthActions.signInWithEmailAndPasswordFailure({ errorMessage: message })))
        );
      })
    );
  });

  public signUpWithEmailAndPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActionTypes.SIGN_UP_WITH_EMAIL_AND_PASSWORD),
      exhaustMap(({ payload }) => {
        return from(this.authApiService.signUpWithEmailAndPassword(payload)).pipe(
          map(({ user }) => AuthActions.userAuthenticated({ user: setUser(user!) })),
          tap(() => this.router.navigateByUrl(`/${AppPaths.DASHBOARD}`)),
          catchError(({ message }: HttpErrorResponse) => of(AuthActions.signUpWithEmailAndPasswordFailure({ errorMessage: message })))
        );
      })
    );
  });

  public signUpWithEmailAndPasswordSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.userAuthenticated),
        exhaustMap(({ user }) => this.authApiService.addUserToDatabase$(user))
      );
    },
    { dispatch: false }
  );

  public loadUserData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUserData),
      exhaustMap(({ uid }) =>
        this.authApiService.loadUserData$(uid).pipe(
          map((user) => AuthActions.loadUserDataSuccess({ user })),
          takeUntil(this.dbSubscriptionService.unsubscribe$)
        )
      )
    );
  });

  public updateAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.updateAccount),
      exhaustMap(({ updatedUserData }) => {
        return from(this.authApiService.updateUser$(updatedUserData)).pipe(
          map(() => AuthActions.updateAccountSuccess()),
          tap(() => this.toastService.showMessage(ToastStatus.SUCCESS, this.tr('success'), this.tr('accUpdateSuccess'))),
          catchError(() => of(AuthActions.updateAccountFailure()))
        );
      })
    );
  });

  private tr(path: string): string {
    return this.translateService.instant('toastMessage.' + path);
  }
}
