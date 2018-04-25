import { Component } from '@angular/core';

import { Post, BlogService } from './blog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title : string;

  constructor(private blogService: BlogService) { 
    this.title = 'Angular Blog';
  }
}
