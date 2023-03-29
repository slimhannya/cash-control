export enum ActionTypes {
  USER_AUTHENTICATED = '[Auth] User authenticated',
  USER_NOT_AUTHENTICATED = '[Auth] User not authenticated',

  SIGN_IN_WITH_GOOGLE = '[Auth] Sign in with Google',

  SIGN_OUT = '[Auth] Sign out',

  SIGN_IN_WITH_EMAIL_AND_PASSWORD = '[Auth] Sign in with email and password',
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_SUCCESS = '[Auth] Sign in with email and password success',
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_FAILURE = '[Auth] Sign in with email and password failure',

  SIGN_UP_WITH_EMAIL_AND_PASSWORD = '[Auth] Sign up with email and password',

  LOAD_USER_DATA = '[Auth] Load User',
}
