import { Component, EventEmitter, Output } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Student } from 'src/app/types/student.type';
import { User } from 'src/app/types/user.type';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  user: User;
  userSubscription: Subscription;
  @Output() emitClose:EventEmitter<any> = new EventEmitter();
  constructor(private storeService: StoreService, private router: Router) {}
  ngOnInit() {
    this.userSubscription = this.storeService.loggedInUser$.subscribe({
      next: (data) => {
        this.user = data;
        // console.log(this.user);
      },
      error: () => {},
    });
  }
  closeSideBar(){
    this.emitClose.emit();
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
