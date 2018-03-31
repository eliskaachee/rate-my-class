var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres:ta_user:ta_pass@localhost:5432/ratemyclass";

function handleGetProfessorList(req, res) {
  getProfessorListFromDB(function(error, result) {
    if(error || result == null) {
      res.status(500);
      res.json({success: false});
    } else {
      res.status(200);
      var selectProfessor = "<select name=\"professor\" id=\"professor\">";
      selectProfessor += "<option value=\"0\">None</option>";
      var professor;
      for(professor in result) {
        selectProfessor += "<option value=\"" + result[professor].id + "\">" + result[professor].last_name + ", " + result[professor].first_name + "</option>";
      }
      selectProfessor += "</select>";
      var params = {selectClass: req.selectClass, selectProfessor: selectProfessor};
      
      res.set('Content-Type', 'text/html');
      res.render('homepage', params);
    }
  });
}

function getProfessorListFromDB(callback) {
  var client = new pg.Client(connectionString);
  client.connect(function(error) {
    if(error) {
      console.log("ERROR: Could not connect to database: " + error);
      callback(error, null);
    }
    var sql = "SELECT * FROM professor";
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

module.exports = {handleGetProfessorList: handleGetProfessorList};