import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  file:File | null = null;
  @Input() control:FormControl;
  constructor(private apiService:ApiService){}
  uploadFile(event:any){
    if(event)
    {
      var file = event.target.files[0];
      this.apiService.uploadFile({file:file}).subscribe({
        next:(data:any)=>{
          this.control.patchValue(data.location);
        },
        error:(err)=>{}
      })
    }
  }
}
