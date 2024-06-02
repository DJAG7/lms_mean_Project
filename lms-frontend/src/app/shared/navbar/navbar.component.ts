import {
  Component,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { User } from 'src/app/types/user.type';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: any;
  showsidebtn: boolean = false;
  @Input() showSidebar: Boolean = false;
  @Output() emitSidebarOpen: EventEmitter<any> = new EventEmitter();
  constructor(
    public storeService: StoreService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {}
  ngOnInit() {
    this.storeService.loggedInUser$.subscribe({
      next: (data) => {
        // console.log(data);
        this.user = data;
        this.ref.detectChanges();
      },
      error: () => {},
    });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd)
        if (e.url == '/auth/login' || e.url == '/auth/signup') {
          this.showsidebtn = false;
        } else {
          this.showsidebtn = true;
        }
    });
  }
  openSidebar() {
    this.emitSidebarOpen.emit();
  }
  navigateProfile() {
    this.router.navigate(['profile/student/' + this.user._id]);
  }
  logout() {
    this.storeService.logout();
  }
}
