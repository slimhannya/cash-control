import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@common/models/user.model';
import { CashFlowService } from '@dashboard/services/cash-flow.service';
import { AuthService } from '@auth/services/auth.service';
import { ToastStatus } from '@common/enums/toast-status.enum';
import { ToastService } from '@common/services/toast.service';
import { setUser } from '@common/utils/set-user';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '@store/auth';
import { ActionTypes } from '@store/auth/action-types';
import firebase from 'firebase/compat';
import { catchError, EMPTY, exhaustMap, from, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$: Actions = inject(Actions);
  private toastService: ToastService = inject(ToastService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private cashFlowService = inject(CashFlowService);

  public signInWithGoogle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signInWithGoogle),
      exhaustMap(() => {
        return from(this.authService.signinWithGoogle()).pipe(
          map(({ user }: firebase.auth.UserCredential) => {
            if (user !== null) {
              return AuthActions.signInWithGoogleSuccess({ user: setUser(user) });
            }

            console.error('Provided account does not exist');
            return AuthActions.userNotAuthenticated();
          }),
          map(() => AuthActions.loadUserData()),
          tap((): void => {
            this.router.navigateByUrl('/dashboard');
          }),

          catchError((e) => {
            this.toastService.showMessage(
              ToastStatus.ERROR,
              'Error!',
              'Something went wrong during google authorisation'
            );

            console.error(e);
            return of(AuthActions.userNotAuthenticated());
          })
        );
      })
    );
  });

  public signInWithGoogleSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signInWithGoogleSuccess),
      switchMap(() => of(AuthActions.loadUserData()))
    );
  });

  public signOut$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signOut),
      exhaustMap((): Promise<void> => this.authService.signOut()),
      map(() => AuthActions.userNotAuthenticated()),
      tap((): void => {
        this.router.navigateByUrl('/authentication');
        this.toastService.showMessage(ToastStatus.INFO, 'Success!', 'You were successfully logged out');
      })
    );
  });

  public signInWithEmailAndPassword$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.signInWithEmailAndPassword),
        exhaustMap(({ payload }) => {
          return from(this.authService.signInWithEmailAndPassword(payload)).pipe(
            tap(() => {
              this.router.navigateByUrl('/dashboard');
            }),

            catchError(() => {
              this.toastService.showMessage(
                ToastStatus.ERROR,
                'Error!',
                'Something went wrong during google authorization'
              );

              return EMPTY;
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  public signUpWithEmailAndPassword$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ActionTypes.SIGN_UP_WITH_EMAIL_AND_PASSWORD),
        exhaustMap(({ payload }) => {
          return from(this.authService.signUpWithEmailAndPassword(payload)).pipe(
            tap(() => {
              this.router.navigateByUrl('/dashboard');
            }),

            catchError(() => {
              this.toastService.showMessage(
                ToastStatus.ERROR,
                'Error!',
                'Something went wrong during google authorization'
              );
              return EMPTY;
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  public loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUserData),
      exhaustMap(() => this.authService.authState$),
      switchMap((user: firebase.User | null) => {
        return this.authService.loadUserData(user).pipe(
          map((user: User | undefined) => {
            if (user) {
              return AuthActions.userAuthenticated({ user });
            }

            return AuthActions.userNotAuthenticated();
          }),

          catchError((e) => {
            this.toastService.showMessage(ToastStatus.ERROR, 'Error!', 'Something went wrong during fetch user data');
            console.error(e);
            AuthActions.userNotAuthenticated();
            return EMPTY;
          })
        );
      })
    );
  });

  public loadUserData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.userAuthenticated),
        switchMap(({ user }) => this.cashFlowService.loadUserCashFlowData$(user.uid)),
        map((data) => {
          console.log(data);
          return data;
        })
      );
    },
    { dispatch: false }
  );
}
