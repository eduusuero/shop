import { computed, Injectable, signal } from '@angular/core';
import { User } from '@auth/interfaces/user.interfaces';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');

  private _user = signal<User|null>(null);
  private _token = signal<string|null>(null);


  authStatus = computed<AuthStatus>(() => {
    if( this._authStatus() === 'checking' )
      return 'checking';

    if( this._user())
      return 'authenticated';

    return 'not-authenticated';
  });

  user = computed(() => this._user());

  token = computed(this._token);
}
