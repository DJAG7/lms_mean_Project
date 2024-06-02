import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounce, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-public-student-profile',
  templateUrl: './public-student-profile.component.html',
  styleUrls: ['./public-student-profile.component.css'],
})
export class PublicStudentProfileComponent {
  profileDetails: any;
  visibilitySwitch: any = false;
  repos: any = [];
  commits: any = [];
  languages: any = [];
  colors: any = [
    'bg-primary',
    'bg-warning',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-info',
  ];
  access: boolean = false;
  showGitDataLoading = false;
  userId: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.userId = params['userid'];
      this.apiService.getStudentProfile(params['userid'], 'viewer').subscribe({
        next: (data) => {
          this.userId = params['userid'];
          if (data.access) {
            this.access = true;
            this.profileDetails = data.data;
            if (this.profileDetails.gitHub?.givenAccess) {
              this.showGitDataLoading = true;
              this.apiService.getStudentRepos(this.userId).subscribe({
                next: (data) => {
                  this.showGitDataLoading = false;
                  this.repos = data.data.repos;
                  this.commits = data.data.commits;
                  this.languages = data.data.languages;
                },
                error: (err) => {
                  console.log(err);
                },
              });
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }
}
