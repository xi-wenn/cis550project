var express = require('express')
var path = require('path')
var app = express()


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'fling.seas.upenn.edu',
  user     : '',
  password : '',
  database : ''
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.get('/index', function(request, response) {
  response.sendFile(path.join(__dirname, '/', 'index.html'));
})

app.get('/bikes', function(request, response) {
  response.sendFile(path.join(__dirname, '/', 'bikes.html'));
})

app.get('/friendships', function(request, response) {
  response.sendFile(path.join(__dirname, '/', 'friendships.html'));
})

app.get('/friendshipdata', function(req, res) {
  queryStr = 'select p.name as name, IFNULL(fc.friendCount, 0) as friendCount' +
           ' from Person p' +
           ' left join (' +
           '  select login, count(friend) as friendCount ' +
           '  from Friends ' +
           '  group by login' +
           ' ) fc on p.login = fc.login;';
  connection.query(queryStr, function (error, results, fields) {
    if (error) throw error;
    res.json(JSON.stringify(results))
  })
})

app.post('/familydata', jsonParser, function(req, res) {
  reqName = req.body.data;
  console.log(req.body.data);
  queryStr = 'select p2.login, p2.name, f.role, p2.sex, p2.relationshipStatus, p2.birthyear' +
            ' from Person p' +
            ' inner join Family f on f.login = p.login' +
            ' left join Person p2 on f.member = p2.login' +
            ' where p.name = "' + reqName + '"';
  connection.query(queryStr, function (error, results, fields) {
    if (error) throw error;
    res.json(JSON.stringify(results))
  })
})

app.get('/script.js', function(request, response) {
  response.sendFile(path.join(__dirname, '/', 'script.js'));
})

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'))
})
