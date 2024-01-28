import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, EnvironmentProviders, isDevMode, NgModule, Provider } from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterOutlet, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Environment } from 'src/environments';
import { environment } from 'src/environments/environment';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { STORE_ROOT_REDUCERS, AppComponent, routes } from '#app/index';
import { AuthEffects } from '#auth/store';
import { CashFlowEffects } from '#cash-flow/store';
import { ConfigEffects } from '#core/config/store';
import { injectThemeLink$, ThemeInitService } from '#core/services';
import { CustomTranslateHttpLoader, initializeTranslations } from '#core/utils';
import { DriveEffects } from '#drive/store';
import { TaskerEffects } from '#tasker/store';

const storeEffects = [ConfigEffects, CashFlowEffects, AuthEffects, TaskerEffects, DriveEffects];
const declarations = [AppComponent];
const imports = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  RouterOutlet,

  StoreModule.forRoot(STORE_ROOT_REDUCERS),
  EffectsModule.forRoot(storeEffects),
  StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),

  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAnalytics(() => getAnalytics()),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  AngularFireAuthModule,

  TranslateModule.forRoot({
    loader: { provide: TranslateLoader, useClass: CustomTranslateHttpLoader },
  }),
];
const providers: Array<Provider | EnvironmentProviders> = [
  provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
  { provide: Environment, useValue: environment },
  { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  { provide: APP_INITIALIZER, useFactory: injectThemeLink$, deps: [ThemeInitService], multi: true },
  { provide: APP_INITIALIZER, useFactory: initializeTranslations, deps: [TranslateService], multi: true },
  DatePipe,
  MessageService,
  ConfirmationService,
  ScreenTrackingService,
  UserTrackingService,
  DialogService,
];

@NgModule({ declarations, imports, providers, bootstrap: [AppComponent] })
export class AppModule {}
