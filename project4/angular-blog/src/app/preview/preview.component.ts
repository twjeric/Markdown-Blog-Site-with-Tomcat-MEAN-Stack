import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Parser, HtmlRenderer } from 'commonmark';
import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  post: Post;
  parser: Parser;
  renderer: HtmlRenderer;
  html: string;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.parser = new Parser();
    this.renderer = new HtmlRenderer();
    this.route.params.subscribe(() => this.getHtml());
  }

  getHtml(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.post = this.blogService.getPost(id);
    if (this.post) {
      this.html = this.renderer.render(this.parser.parse(this.post.title));
      this.html += this.renderer.render(this.parser.parse(this.post.body));
    }
  }

  edit(): void {
    this.router.navigate(['edit', this.post.postid]);
  }

}
