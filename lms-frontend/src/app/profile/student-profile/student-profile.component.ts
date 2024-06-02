import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounce, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { frontendUrl } from 'src/app/services/api/contants';
@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent {
  profileDetails: any;
  visibilitySwitch: any = false;
  repos: any = [];
  commits: any = [];
  languages: any = [];
  userId: string;
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
  visibilityChange: Subject<any> = new Subject();
  editProfile: boolean = false;
  profileForm: FormGroup;
  organizationOptions: { value: string; label: string }[];
  editorStyle = {
    backgroundColor: '#ffffff',
  };
  modules: any = {
    toolbar: [
      ['bold', 'italic', 'underline'],

      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],

      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
    ],
  };
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private storeService: StoreService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      name_public: [false],
      phone: [''],
      phone_public: [false],
      education: [''],
      education_public: [false],
      organization: ['', Validators.required],
      organization_public: [false],
      description: [''],
      description_public: [false],
      websiteURL: [''],
      websiteURL_public: [false],
      leetcode: [''],
      leetcode_public: [false],
      codeforces: [''],
      codeforces_public: [false],
    });
    this.route.params.subscribe((params) => {
      this.userId = params['userid'];
      console.log(this.userId);
      this.apiService.getOrganizations().subscribe((data) => {
        this.organizationOptions = data['organizations'].map((item: any) => {
          return { value: item, label: item };
        });
        console.log(this.organizationOptions);
      });
      this.apiService.getStudentProfile(params['userid'], 'owner').subscribe({
        next: (data) => {
          if (data.access) {
            this.access = true;
            this.profileDetails = data.data;
            console.log(this.profileDetails);
            this.visibilitySwitch = this.profileDetails.profileVisibility;
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
          } else {
            if (data.redirect) {
              window.location.href =
                frontendUrl + '/profile/public/student/' + params['userid'];
            }
          }
        },
        error: (err) => {
          console.log(err);
          this.storeService.logout();
          window.location.href = 'http://localhost:4200/';
        },
      });
    });
    this.visibilityChange.pipe(debounceTime(1000)).subscribe({
      next: (visibility: any) => {
        this.apiService
          .toggleStudentProfileVisibility(
            this.profileDetails?.email?.value,
            visibility
          )
          .subscribe({
            next: (data) => {
              this.toastr.success('Successfully changed visibility');
            },
            error: (error) => {
              console.log(error);
            },
          });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleGithubConnect() {
    window.location.href =
      'https://github.com/login/oauth/authorize?scope=user public_repo&client_id=2c0a7950c0f3f5126279&state=' +
      this.profileDetails.email.value;
  }
  removeGithubAccess() {
    this.apiService
      .removeGithubAccess(this.profileDetails.email.value)
      .subscribe({
        next: (data) => {
          this.profileDetails.gitHub.givenAccess = false;
          this.toastr.success('Successfully removed github access');
        },
        error: (err) => {},
      });
  }
  handleVisibility(data: any) {
    this.visibilityChange.next(this.visibilitySwitch);
  }
  handleEditProfile() {
    console.log(this.profileDetails);
    let initialProfile = {
      name: this.profileDetails?.name.value,
      name_public: this.profileDetails?.name.public,
      phone: this.profileDetails.phone.value,
      phone_public: this.profileDetails.phone.public,
      organization: this.profileDetails.organization.value,
      organization_public: this.profileDetails.organization.public,
      description: this.profileDetails.description.value,
      description_public: this.profileDetails.description.public,
      education: this.profileDetails.education.value,
      education_public: this.profileDetails.education.public,
      leetcode: this.profileDetails.leetcode.value,
      leetcode_public: this.profileDetails.leetcode.public,
      codeforces: this.profileDetails.codeforces.value,
      codeforces_public: this.profileDetails.codeforces.public,
      websiteURL: this.profileDetails.websiteURL.value,
      websiteURL_public: this.profileDetails.websiteURL.public,
    };
    this.profileForm.patchValue(initialProfile);
    console.log(this.profileForm.value);
    this.editProfile = true;
  }
  openFileInput(): void {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    console.log(this.userId);
    if (file) {
      this.apiService
        .editProfilePicture({ file: file, userId: this.userId })
        .subscribe({
          next: (data: any) => {
            this.profileDetails.profilePicture = data.location;
          },
          error: (err) => {},
        });
    }
  }

  cancelEditProfile() {
    this.editProfile = false;
  }
  saveProfile() {
    let profileVal = this.profileForm.value;
    let payload = {
      userId: this.userId,
      name: {
        value: profileVal.name,
        public: profileVal.name_public,
      },
      description: {
        value: profileVal.description,
        public: profileVal.description_public,
      },
      phone: {
        value: profileVal.phone,
        public: profileVal.phone_public,
      },
      organization: {
        value: profileVal.organization,
        public: profileVal.organization_public,
      },
      websiteURL: {
        value: profileVal.websiteURL,
        public: profileVal.websiteURL_public,
      },
      leetcode: {
        value: profileVal.leetcode,
        public: profileVal.leetcode_public,
      },
      codeforces: {
        value: profileVal.codeforces,
        public: profileVal.codeforces_public,
      },
      education: {
        value: profileVal.education,
        public: profileVal.education_public,
      },
    };
    this.apiService.editProfileDetails(payload).subscribe({
      next: (data) => {
        this.profileDetails.name = payload.name;
        this.storeService.setUserDetails('name', this.profileDetails.name);
        this.profileDetails.organization = payload.organization;
        this.profileDetails.description = payload.description;
        this.profileDetails.phone = payload.phone;
        this.profileDetails.education = payload.education;
        this.profileDetails.leetcode = payload.leetcode;
        this.profileDetails.codeforces = payload.codeforces;
        this.profileDetails.websiteURL = payload.websiteURL;
        this.toastr.success('Successfully updated profile');
        this.editProfile = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
