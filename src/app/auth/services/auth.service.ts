import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '@auth/interfaces/user.interfaces';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');

  private _user = signal<User|null>(null);
  private _token = signal<string|null>(localStorage.getItem('token'));

  private http = inject(HttpClient);


  //Este metodo se dispara apenas se inyecta el servicio
  //por lo tanto llamo al metodo checkStatus para ver si
  //ya tengo autenticado el usuario.
  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });


  authStatus = computed<AuthStatus>(() => {
    if( this._authStatus() === 'checking' )
      return 'checking';

    if( this._user())
      return 'authenticated';

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);

  //Obtengo true si tiene el rol de admin, false en caso contrario
  isAdmin = computed( () => this._user()?.roles.includes('admin') ?? false )

  login( email: string, password: string ):Observable<boolean>{

    return this.http.post<AuthResponse>(`${ baseUrl }/auth/login`,{
      email: email,
      password: password,
    }).pipe(
      map( resp => this.handleAuthSucess(resp) ),
      catchError((error:any) => this.handleAuthError(error))
    )
  }

  checkStatus():Observable<boolean>{

    const token =  localStorage.getItem('token');

    //Si no tengo token es que no esta logeado.
    if(!token){
      this.logout();
      return of(false);
    }

    //Si tengo token tengo que verificarlo
    return this.http.get<AuthResponse>(`${ baseUrl }/auth/check-status`, {
      // headers:{
      //   Authorization: `Bearer ${ token }`,
      // }
    }).pipe(
      map( resp => this.handleAuthSucess(resp) ),
      catchError((error:any) => this.handleAuthError(error))
    )

  }

  logout(){
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);

    localStorage.removeItem('token');

  }

  private handleAuthSucess( resp: AuthResponse){
        this._user.set(resp.user);
        this._authStatus.set('authenticated');
        this._token.set(resp.token);

        localStorage.setItem('token',resp.token);

        return true;
  }

  private handleAuthError( error: any ){
    this.logout();
    return of(false);
  }

}
