import { makeStateKey } from '@angular/core';
import { User } from '../../shared/interfaces/user';

export const USER_STATE_KEY = makeStateKey<User | null>('auth-user');
export const ACCESS_TOKEN_STATE_KEY = makeStateKey<string | null>('auth-token');
