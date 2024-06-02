import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { StoreService } from './store.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storeService: StoreService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // console.log("CAN ACTIVAte",route,state);
    // console.log("");

    return this.storeService.loggedInUser$.pipe(
      map((user) => {
        let isAuth = !!user;
        if (isAuth) {
          console.log(route);
          if (route.data['role'] == user.role) {
            return true;
          }
          // else{
          //   alert("You are not authorised");
          //   // return false;
          // }
        }
        return this.router.createUrlTree(['auth', 'login']);
      })
    );
  }
}
