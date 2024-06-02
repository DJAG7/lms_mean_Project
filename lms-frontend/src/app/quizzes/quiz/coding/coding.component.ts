import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-coding',
  templateUrl: './coding.component.html',
  styleUrls: ['./coding.component.css'],
})
export class CodingComponent {
  output:string = '';
  constructor(private apiService: ApiService) {}
  customrun(data: { code: string; input: string; language: string }) {
    this.apiService.runCustomCode(data).subscribe({
      next: (data) => {
        this.output = data.Output;
      },
    });
  }
}
