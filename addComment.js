var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres:ta_user:ta_pass@localhost:5432/ratemyclass";

function handleAddComment(req, res) {
  
  var client = new pg.Client(connectionString);
  client.connect(function(error) {
    if(error) {
      console.log("ERROR: Could not connect to database: " + error);
      res.status(500);
      res.json({success: false});
    }
    if(req.body.professor && req.body.professor != 0) {
      var sql = "INSERT INTO comment(comment_text, student_id, course_id, professor_id) VALUES($1::text, $2::int, $3::int, $4::int) returning id";
      var parameters = [req.body.comment, 1, req.body.coursecode, req.body.professor];//req.body.student_id, req.body.course_id, req.body.professor_id];
    } else {
      var sql = "INSERT INTO comment(comment_text, student_id, course_id) VALUES($1::text, $2::int, $3::int) returning id";
      var parameters = [req.body.comment, 1, req.body.coursecode];//req.body.student_id, req.body.course_id, req.body.professor_id];
    }
    var query = client.query(sql, parameters, function(error, result) {
      client.end(function(error) {
        if(error) {
          throw error;
        }
      });

      if(error) {
        console.log("Error in query: " + error);
        res.status(500);
        res.json({success: false});
      }
      res.status(200);
      res.redirect('/');
    });
  });
}

module.exports = {handleAddComment: handleAddComment};