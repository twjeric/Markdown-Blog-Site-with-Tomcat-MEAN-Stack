import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import * as jwt_decode from "jwt-decode";

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function getUsername() {
  return jwt_decode(getCookie('jwt')).usr;
}

@Injectable()
export class BlogService {

  private posts: Post[];

  constructor(
    private http: HttpClient,
    private router: Router
  ) { this.fetchPosts(); }

  fetchPosts(): void {
    this.posts = [];
    let username = getUsername();
    this.http.get<Post[]>('/api/'+username).subscribe(posts => {
      this.posts = posts;
    });
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getPost(id : number): Post {
    return this.posts.find(post => post.postid == id);
  }

  newPost(): Post {
    let post: Post = { 'postid': 0, 'created': new Date(), 'modified': new Date(), 'title': '', 'body': '' };
    post.postid = this.posts.reduce((post1, post2) => post1.postid > post2.postid ? post1 : post2).postid + 1;
    this.posts.push(post);
    let username = getUsername();
    this.http.post('/api/'+username+"/"+post.postid, {title: post.title, body: post.body}).subscribe(
      res => console.log(),
      error => {
        if (error.status == 201) {
          console.log();
        }
        else {
          alert('new post error');
          this.posts.splice(this.posts.length - 1, 1);
          this.router.navigate(['/']);
        }
      }
    );
    return post;
  }

  updatePost(post: Post): void {
    let oldPost = this.posts.find(p => p.postid == post.postid);
    if (oldPost) {
      let idx = this.posts.indexOf(oldPost);
      this.posts[idx].title = post.title;
      this.posts[idx].body = post.body;
      this.posts[idx].modified = new Date();
      let username = getUsername();
      this.http.put('/api/'+username+"/"+post.postid, {title: post.title, body: post.body}).subscribe(
        res => console.log(),
        error => {
          if (error.status == 200) {
            console.log();
          }
          else {
            alert('edited post error');
          }
        }
      );
    }
  }

  deletePost(postid: number): void {
    let post = this.posts.find(post => post.postid == postid);
    if (post) {
      let idx = this.posts.indexOf(post);
      this.posts.splice(idx, 1);
      let username = getUsername();
      this.http.delete('/api/'+username+"/"+post.postid).subscribe(
        res => console.log(),
        error => {
          if (error.status == 204) {
            console.log();
          }
          else {
            alert('delete post error');
          }
        }
      );
    }
  }

}
