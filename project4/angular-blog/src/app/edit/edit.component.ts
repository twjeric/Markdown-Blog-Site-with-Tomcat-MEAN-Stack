import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() post: Post;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => this.getPost());
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.post = this.blogService.getPost(id);
    if (this.post) {
      this.form = new FormGroup({
        'title': new FormControl(this.post.title),
        'body': new FormControl(this.post.body)
      });
    }
  }

  //get title() { return this.form.get('title'); }

  //get body() { return this.form.get('body'); }

  save(): void {
    this.blogService.updatePost(this.post);
    this.form.markAsPristine();
  }

  preview(): void {
    if (this.form.dirty) this.save();
    this.router.navigate(['preview', this.post.postid]);
  }

  delete(): void {
    this.blogService.deletePost(this.post.postid);
    this.router.navigate(['/']);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form && this.form.dirty) this.save();
    return true;
  }

}
