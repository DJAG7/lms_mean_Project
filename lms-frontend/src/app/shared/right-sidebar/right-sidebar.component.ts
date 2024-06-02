import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css'],
})
export class RightSidebarComponent {
  @Input() sidebarShow: boolean = false;
  output: any;
  @Output() sidebarShowChange = new EventEmitter<any>();
  constructor(private apiService: ApiService) {}
  toggleSidebar() {
    console.log('hello');
    this.sidebarShowChange.emit();
  }
  customrun(data: { code: string; input: string; language: string }) {
    this.apiService.runCustomCode(data).subscribe({
      next: (data) => {
        this.output = data.Output;
      },
    });
  }
}
