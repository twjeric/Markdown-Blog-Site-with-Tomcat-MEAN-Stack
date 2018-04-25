import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

const POSTS = [
  { 'postid': 1, 'created': new Date(), 'modified': new Date(), 'title': '# Example', 'body': '*Body Title*\n\nBody Text' },
  { 'postid': 2, 'created': new Date(), 'modified': new Date(), 'title': '**Hello World!**', 'body': 'Content\n\n- L1\n- L2\n- L3' }
];

@Injectable()
export class BlogService {

  private posts: Post[];

  constructor() { this.fetchPosts(); }

  fetchPosts(): void {
    localStorage.setItem("posts", JSON.stringify(POSTS));
    this.posts = JSON.parse(localStorage.getItem("posts"));
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getPost(id : number): Observable<Post> {
    return of(this.posts.find(post => post.postid == id));
  }

  newPost(): Post {
    let post: Post = { 'postid': 0, 'created': new Date(), 'modified': new Date(), 'title': '', 'body': '' }
    post.postid = this.posts.reduce((post1, post2) => post1.postid > post2.postid ? post1 : post2).postid + 1;
    this.posts.push(post);
    localStorage.setItem("posts", JSON.stringify(this.posts));
    return post;
  }

  updatePost(post: Post): void {
    let oldPost = this.posts.find(p => p.postid == post.postid);
    if (oldPost) {
      let idx = this.posts.indexOf(oldPost);
      this.posts[idx].title = post.title;
      this.posts[idx].body = post.body;
      this.posts[idx].modified = new Date();
      localStorage.setItem("posts", JSON.stringify(this.posts));
    }
  }

  deletePost(postid: number): void {
    let post = this.posts.find(post => post.postid == postid);
    if (post) {
      let idx = this.posts.indexOf(post);
      this.posts.splice(idx, 1);
      localStorage.setItem("posts", JSON.stringify(this.posts));
    }
  }

}
