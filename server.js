var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = process.env.DATABASE_URL || "postgres:ta_user:ta_pass@localhost:5432/ratemyclass";
// var connectionString = "";
var app = express();
const PORT = process.env.PORT || 5000;

app.set('port', PORT)
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}))
   .use(express.static(__dirname + '/public'))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
   .post('/addComment', handleAddComment)
   .get('/getClassComments/:classcode', handleGetClassComments)
   .get('/getClassList', handleGetClassList)
   .get('/homepage', handleGetClassList)
   .listen(app.get('port'));

function handleAddComment(req, res) {
  console.log("Handling Add Comment");
  
  var client = new pg.Client(connectionString);
  client.connect(function(error) {
    if(error) {
      console.log("ERROR: Could not connect to database: " + error);
      res.status(500);
      res.json({success: false});
    }
    if(req.body.professor_id) {
      console.log(req.body);
      // console.log("Stuff: " + req.body.comment + req.body.student_id + req.body.course_id + req.body.professor_id);
      var sql = "INSERT INTO comment(comment_text, student_id, course_id, professor_id) VALUES($1::text, $2::int, $3::int, $4::int) returning id";
      var parameters = [req.body.comment, 1, req.body.coursecode, req.body.professor_id];//req.body.student_id, req.body.course_id, req.body.professor_id];
    } else {
      console.log(req.body);
      // console.log("Stuff: " + req.body.comment + req.body.student_id + req.body.course_id);
      var sql = "INSERT INTO comment(comment_text, student_id, course_id) VALUES($1::text, $2::int, $3::int) returning id";
      var parameters = [req.body.comment, 1, req.body.coursecode];//req.body.student_id, req.body.course_id, req.body.professor_id];
    }
    var query = client.query(sql, parameters, function(error, result) {
      client.end(function(error) {
        if(error) {
          throw error;
        } else {
          console.log ("Insert complete");
        }
      });

      if(error) {
        console.log("Error in query: " + error);
        res.status(500);
        res.json({success: false});
      }
      res.status(200);
      res.redirect('/homepage'); //json(result);
    });
  });
}

function handleGetClassComments(req, res) {
  var classcode = req.params.classcode;
  getClassCommentsFromDB(classcode, function(error, result) {
    if(error || result == null) {
      res.status(500);
      res.json({success: false});
    } else {
      res.status(200);
      res.json(result);
    }
  });
}

function handleGetClassList(req, res) {
  getClassListFromDB(function(error, result) {
    if(error || result == null) {
      res.status(500);
      res.json({success: false});
    } else {
      res.status(200);
      var html = "<select name=\"coursecode\" id=\"coursecode\">";
      var course;
      for(course in result) {
        // html += "<option name=\"" + result[course].id + "\" value=\"" + result[course].course_code + "\">" + result[course].course_code + "</option>";
        html += "<option value=\"" + result[course].id + "\">" + result[course].course_code + "</option>";
      }
      html += "</select>";
      // console.log(html);
      var params = {result: new Buffer(html)};
      res.set('Content-Type', 'text/html');
      res.render('homepage', params);
    }
  });
}

function getClassCommentsFromDB(classcode, callback) {
  console.log("Class code I got: " + classcode);
  var client = new pg.Client(connectionString);
  client.connect(function(error) {
    if(error) {
      console.log("ERROR: Could not connect to database: " + error);
      callback(error, null);
    }

    var sql = "SELECT comment_text, date_added, username, course_code, p.first_name, p.last_name FROM comment c JOIN student s ON c.student_id = s.id JOIN course co ON c.course_id = co.id LEFT JOIN professor p ON c.professor_id = p.id WHERE co.id = $1::int";
    var parameters = [classcode];
    var query = client.query(sql, parameters, function(error, result) {
      client.end(function(error) {
        if(error) {
          throw error;
        }
      });

      if(error) {
        console.log("Error in query: " + error);
        callback(error, null);
      }
      callback(null, result.rows);
    });
  });
}

function getClassListFromDB(callback) {
  var client = new pg.Client(connectionString);
  client.connect(function(error) {
    if(error) {
      console.log("ERROR: Could not connect to database: " + error);
      callback(error, null);
    }
    var sql = "SELECT * FROM course";
    var query = client.query(sql, function(error, result) {
      client.end(function(error) {
        if(error) {
          throw error;
        }
      });
      if(error) {
        console.log("Error in query: " + error);
        callback(error, null);
      }
      callback(null, result.rows);
    });
  });
}
