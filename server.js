var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var classListEngine = require('./classList.js');
var addCommentEngine = require('./addComment.js');
var commentListEngine = require('./commentList.js');
var professorListEngine = require('./professorList.js');
var app = express();
const PORT = process.env.PORT || 5000;

app.set('port', PORT)
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}))
   .use(express.static(__dirname + '/public'))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
   .post('/addComment', addCommentEngine.handleAddComment)
   .get('/getClassComments/:classcode', commentListEngine.handleGetClassComments)
   .get('/getClassList', classListEngine.handleGetClassList)
   .get('/homepage', classListEngine.handleGetClassList, professorListEngine.handleGetProfessorList)
   .listen(app.get('port'));