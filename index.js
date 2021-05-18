var express = require('express');
const session = require("express-session");
// API endpoints
const endpoints = require("./routes/endpoints");
const dpPrep = require("./db_preparation");
const bodyParser = require('body-parser');

// auth credentials
const creds = require("./user.json");

var app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));
app.use(bodyParser.json()); 

/*
 * Turn on sessions
 */
app.use(session({ secret: "matfyz", resave: false, saveUninitialized: true }));

/*
 * HTTP authentication
 */
app.use((req, res, next) => {
  
  // Parse login and password from headers
  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = new Buffer(b64auth, "base64").toString().split(":");

  // Verify login and password are set and correct
  if (req.session.user || (login && password && creds[login] && password === creds[login])) {
    if (!req.session.user)
      req.session.user = login;
    // Access granted
    return next();
  }

  // Access denied
  res.set("WWW-Authenticate", "Basic realm='401'");
  res.status(401).send("Authentication required.");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port " + process.env.PORT || 3000)
  });

app.get('/', function (req, res) {
  res.render('home', {});
});
app.get('/get_next_screen', endpoints.getNextScreen);
app.post("/get_next_screen", endpoints.postNextScreen);

dpPrep.prepare_db(creds);
