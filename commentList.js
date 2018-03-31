var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres:ta_user:ta_pass@localhost:5432/ratemyclass";

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

function getClassCommentsFromDB(classcode, callback) {
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

module.exports = {handleGetClassComments: handleGetClassComments};