var express = require('express');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var commonmark = require('commonmark');

var index = require('./routes/index');
var blogs = require('./routes/blogs');
var login = require('./routes/login');

var config = require('./config');
var mongoUtil = require('./mongoUtil');
var parser = new commonmark.Parser();
var renderer = new commonmark.HtmlRenderer();

var app = express();

// configure
app.set('superSecret', config.secret);

// CORS
var cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Editor authentication. */
var jwt = require('jsonwebtoken');
app.all('/edit*', function(req, res, next) {
  var token = req.cookies.jwt || req.body.token || req.query.token || req.headers['x-access-token'];
  jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
    if (err) {
      res.redirect('/login?redirect=/edit/');
    }
    else {
      next();
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', blogs);
app.use('/login', login);

/* Show the post. */
app.get('/blog/:username/:postid', function(req, res, next) {
  mongoUtil.getBlog(req.params.username, Number(req.params.postid), function(post) {
    post.title = renderer.render(parser.parse(post.title));
    post.body = renderer.render(parser.parse(post.body));
    post.created = new Date(post.created).toString();
    post.modified = new Date(post.modified).toString();
    res.render('blog', { post: post });
  });
});

/* Show at most 5 posts with postid no less than 'startId'. */
app.get('/blog/:username', function(req, res, next) {
  let startId = Number(req.query.start);
  if (!startId) startId = 1;
  mongoUtil._getBlogs(req.params.username, startId, function(posts) {
    let nextUrl = url.parse(req.url).pathname;
    if (posts.length > 5) {
      nextUrl += ('?start=' + posts[5].postid);
      posts = posts.slice(0, 5);
    }
    else {
      nextUrl = '';
    }
    for (let post of posts) {
      post.title = renderer.render(parser.parse(post.title));
      post.body = renderer.render(parser.parse(post.body));
      post.created = new Date(post.created).toString();
      post.modified = new Date(post.modified).toString();
    }
    res.render('blogs', { posts: posts, nextUrl: nextUrl });
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
