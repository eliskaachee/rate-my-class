var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres:ta_user:ta_pass@localhost:5432/ratemyclass";

function handleGetClassList(req, res, next) {
  getClassListFromDB(function(error, result) {
    if(error || result == null) {
      res.status(500);
      res.json({success: false});
    } else {
      res.status(200);
      var selectClass = "<select name=\"coursecode\" id=\"coursecode\">";
      var course;
      for(course in result) {
        selectClass += "<option value=\"" + result[course].id + "\">" + result[course].course_code + "</option>";
      }
      selectClass += "</select>";
      req.selectClass = selectClass;
    }
  });
  next();
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


module.exports = {handleGetClassList: handleGetClassList};