import { makeStateKey } from '@angular/core';
import { AuthUser } from '../../shared/interfaces/user';

export const USER_STATE_KEY = makeStateKey<AuthUser | null>('auth-user');
export const ACCESS_TOKEN_STATE_KEY = makeStateKey<string | null>('auth-token');
