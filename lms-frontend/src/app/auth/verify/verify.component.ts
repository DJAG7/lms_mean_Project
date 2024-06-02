import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth-api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent {
  token: string;
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      // console.log('hello');
      this.storeService.verifyStudent(this.token).subscribe((data) => {
        this.router.navigate(['']);
      });
    });
  }
}
