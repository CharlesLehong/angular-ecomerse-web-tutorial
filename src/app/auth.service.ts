import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  user$: Observable<any> = new Observable<firebase.User>();
  
  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth, 
    private route: ActivatedRoute) {
    this.user$ = afAuth.authState;
  }

  login(): void{
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout(): void {
    console.log(this.user$);
    this.afAuth.signOut();
  }

  appUser$(): Observable<any> {
    return this.user$.pipe(switchMap(user => {
      if(user)
        return this.userService.get(user.uid).valueChanges();

      return of(null);
    }))
  }
}
