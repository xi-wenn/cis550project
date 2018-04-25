var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'secret', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// login routes ======================================================================
require('./app/routes.js')(app, passport);
var User = require('./app/models/user.js');

// mysql onfiguration ===============================================================
var mysql = require('mysql');
var sql_connection = mysql.createConnection({
    host: 'mysql550project.cl1yl0dhh5zw.us-east-1.rds.amazonaws.com',
    user: 'liuliuliu',
    password: 'sixsixsix',
    database: 'myFlights'
});

sql_connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + sql_connection.threadId);
});

// //-------------mongodb---------------
// var Schema = mongoose.Schema;
// mongoose.connect('mongodb://liuliuliu:sixsixsix@54.147.46.161:27017/cool_db', function(err, db) {
//     if (err) {
//         throw err;
//     } else {
//         console.log("successfully connected to the database");
//     }
//     //db.close();
// });


// var User = mongoose.model('User', userSchema);
// User.find({
//     "local.email": "test1@gmail.com"
// }).exec(function(err, books) {
//     if (err) throw err;

//     console.log("user is " + books);
// });

//-------------connection test--------------
// // Create a schema
// var TodoSchema = new mongoose.Schema({
//     name: String,
//     completed: Boolean,
//     note: String,
//     updated_at: { type: Date, default: Date.now },
// });
// // Create a model based on the schema
// var Todo = mongoose.model('Todo', TodoSchema);
// // Create a todo in memory
// var todo = new Todo({ name: 'Master NodeJS', completed: false, note: 'Getting there...' });
// // Save it to database
// todo.save(function(err) {
//     if (err)
//         console.log(err);
//     else
//         console.log(todo);
// });
//---------mongodb---------------
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'index.html'));
})

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

app.get('/index', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'index.html'));
})

app.get('/search', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'search.html'));
})

// app.get('/login', function(request, response) {
//     response.sendFile(path.join(__dirname, '/', 'login.html'));
// })

app.get('/airlines', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'airlines.html'));

    // var user = request.user;
    // console.log("user local email is " + user.local.email);
})

app.get('/airlineData', function(request, response) {
    // console.log("get airline data");
    queryStr = 'select airline_id, airline_name, airline_iata from airlines where airline_iata is not null and airline_iata <> "";';
    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results));

        // update nosql history
        // var req_user = request.user;
        // if (req_user) {
        //     var past_history = req_user.history;
        //     var combined_history = past_history + ";" + queryStr;
        //     var updated_data = {
        //         history: combined_history
        //     };
        //     User.update({ _id: req_user._id }, updated_data, function(err, affected) {
        //         // console.log("past history is " + req_user.history);
        //         console.log("updated history in nosql succeeds");
        //         // console.log('affected rows %d', affected);
        //     })
        // }
    })
})


app.get('/airports', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'airports.html'));
})

app.get('/airportData', function(request, response) {
    // console.log("get airline data");
    queryStr = 'select airport_id, airport_name, airport_iata from airports where airport_iata is not null and airport_iata <> "";';
    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results));

        // // update nosql history
        // var req_user = request.user;
        // if (req_user) {
        //     var past_history = req_user.history;
        //     var combined_history = past_history + ";" + queryStr;
        //     var updated_data = {
        //         history: combined_history
        //     };
        //     User.update({ _id: req_user._id }, updated_data, function(err, affected) {
        //         // console.log("past history is " + req_user.history);
        //         console.log("updated history in nosql succeeds");
        //         // console.log('affected rows %d', affected);
        //     })
        // }
    })
})

app.get('/cityData', function(request, response) {
    // console.log("get airline data");
    queryStr = 'select city from city;';
    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results));
    })
})

app.get('/countryData', function(request, response) {
    // console.log("get airline data");
    queryStr = 'select country from country;';
    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results));
    })
})



var keyColumnMapping = {
    'airline_name': 'airline_name',
    'flight_number': 'FL_NUM',
    'flight_date': 'FL_DATE',
    'origin_airport': 'o.airport_iata',
    'destination_airport': 'd.airport_iata',
    'origin_city': 'ocity.city',
    'destination_city': 'dcity.city',
    'origin_country': 'oc.country',
    'destination_country': 'dc.country'
}

// var baseFilterQuery = 'select ' +
//           'FL_DATE as flight_date, ' +
//           'airline_name, ' +
//           'FL_NUM as flight_number, ' +
//           'o.airport_iata as origin_airport_iata, ' +
//           'ocity.city as origin_city, ' +
//           'oc.country as origin_country, ' +
//           'd.airport_iata as destination_airport_iata, ' +
//           'dcity.city as destination_city, ' +
//           'dc.country as destination_country, ' +
//           'ARR_DELAY as arrival_delay,' +
//           'DEP_DELAY as departure_delay ' +
//         'from PerformanceRaw p ' +
//         'join airlines al on al.airline_id = p.airline_id ' +
//         'join airports o on o.airport_id = p.origin_id ' +
//         'left join city ocity on o.airport_city_id = ocity.id ' +
//         'left join country oc on o.airport_country_id = oc.id ' +
//         'join airports d on  d.airport_id = p.dest_id ' +
//         'left join city dcity on d.airport_city_id = dcity.id ' +
//         'left join country dc on d.airport_country_id = dc.id ';

var performanceSelectFields = 'FL_DATE as flight_date, ' +
          'airline_name, ' +
          'FL_NUM as flight_number, ' +
          'o.airport_iata as origin_airport_iata, ' +
          'ocity.city as origin_city, ' +
          'oc.country as origin_country, ' +
          'd.airport_iata as destination_airport_iata, ' +
          'dcity.city as destination_city, ' +
          'dc.country as destination_country, ' +
          'ARR_DELAY as arrival_delay,' +
          'DEP_DELAY as departure_delay ';

var baseFilterQueryJoins = 'from PerformanceRawBackup p ' +
        'join airlines al on al.airline_id = p.airline_id ' +
        'join airports o on o.airport_id = p.origin_id ' +
        'left join city ocity on o.airport_city_id = ocity.id ' +
        'left join country oc on o.airport_country_id = oc.id ' +
        'join airports d on  d.airport_id = p.dest_id ' +
        'left join city dcity on d.airport_city_id = dcity.id ' +
        'left join country dc on d.airport_country_id = dc.id ';

app.post('/performanceData', jsonParser, function(request, response) {
    console.log(request.body)
    queryParams = request.body;
    queryStr = 'select ' + performanceSelectFields + baseFilterQueryJoins;
    if (!isEmptyObject(queryParams)) {
        for (var key in queryParams) {
            if (queryParams.hasOwnProperty(key)) {
                console.log(key + ":" + queryParams[key]);
                if (queryParams[key].length > 0) {
                  if (queryStr.indexOf('where') < 0) {
                      queryStr += 'where ';
                  } else {
                      queryStr += 'and ';
                  }
                  queryStr += keyColumnMapping[key] + ' = "' + queryParams[key] + '" ';
                }
            }
        }
    }
    queryStr += " limit 1000";

    console.log(queryStr);

    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results))

        // update nosql history
        var req_user = request.user;
        if (req_user) {
            var past_history = req_user.history;
            var combined_history = past_history + ";" + queryStr;
            var updated_data = {
                history: combined_history
            };
            User.update({ _id: req_user._id }, updated_data, function(err, affected) {
                // console.log("past history is " + req_user.history);
                console.log("updated history in nosql succeeds");
                // console.log('affected rows %d', affected);
            })
        }
    })


    // response.json(JSON.stringify("abc"));
});

app.post('/avgArrDelayData', jsonParser, function(request, response) {
    console.log(request.body)
    queryParams = request.body;
    queryStr = 'select avg(ARR_DELAY) as average_delay ' + baseFilterQueryJoins;

    filterKey = Object.keys(queryParams)[0];

    queryStr += 'where ' + keyColumnMapping[filterKey] + ' = "' + queryParams[filterKey] + '" group by ' + keyColumnMapping[filterKey];

    console.log(queryStr);



    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results))

        // update nosql history
        var req_user = request.user;
        if (req_user) {
            var past_history = req_user.history;
            var combined_history = past_history + ";" + queryStr;
            var updated_data = {
                history: combined_history
            };
            User.update({ _id: req_user._id }, updated_data, function(err, affected) {
                // console.log("past history is " + req_user.history);
                console.log("updated history in nosql succeeds");
                // console.log('affected rows %d', affected);
            })
        }
    })
});

app.post('/avgDepDelayData', jsonParser, function(request, response) {
    console.log(request.body)
    queryParams = request.body;
    queryStr = 'select avg(DEP_DELAY) as average_delay ' + baseFilterQueryJoins;

    filterKey = Object.keys(queryParams)[0];

    queryStr += 'where ' + keyColumnMapping[filterKey] + ' = "' + queryParams[filterKey] + '" group by ' + keyColumnMapping[filterKey];

    console.log(queryStr);

    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results))

        // update nosql history
        var req_user = request.user;
        if (req_user) {
            var past_history = req_user.history;
            var combined_history = past_history + ";" + queryStr;
            var updated_data = {
                history: combined_history
            };
            User.update({ _id: req_user._id }, updated_data, function(err, affected) {
                // console.log("past history is " + req_user.history);
                console.log("updated history in nosql succeeds");
                // console.log('affected rows %d', affected);
            })
        }
    })
});


app.post('/incidentData', jsonParser, function(request, response) {
    console.log(request.body)
    queryAirline = request.body.airline_name;
    // queryStr = '';

    queryStr = 'select i.date as incident_date, a.airline_name, i.FlightNum as flight_number '  +
              'from incidents i ' +
              'join airlines a on i.airline_id = a.airline_id ' +
              'where airline_name = "' + queryAirline + '";'

    console.log(queryStr);

    sql_connection.query(queryStr, function(error, results, fields) {
        if (error) throw error;
        response.json(JSON.stringify(results))

        // update nosql history
        var req_user = request.user;
        if (req_user) {
            var past_history = req_user.history;
            var combined_history = past_history + ";" + queryStr;
            var updated_data = {
                history: combined_history
            };
            User.update({ _id: req_user._id }, updated_data, function(err, affected) {
                // console.log("past history is " + req_user.history);
                console.log("updated history in nosql succeeds");
                // console.log('affected rows %d', affected);
            })
        }
    });
});



app.get('/script.js', function(request, response) {
    response.sendFile(path.join(__dirname, '/', 'script.js'));
})

app.listen(app.get('port'), function() {
    console.log('Node app is running at localhost:' + app.get('port'))
})