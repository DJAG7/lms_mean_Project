import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/api/auth-api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
})
export class ForgotComponent {
  selectedRole = 'student';
  newpassword: string = '';
  confirmpassword: string = '';
  token: string;
  constructor(
    private storeService: StoreService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private authApiService: AuthService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }
  reset() {
    this.authApiService.studentChangePassword(this.newpassword,this.confirmpassword,this.token).subscribe({
      next:(data)=>{
        // console.log(data);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
