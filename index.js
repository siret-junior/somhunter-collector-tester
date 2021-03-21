var express = require('express');
var app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

// API endpoints
const endpoints = require("./routes/endpoints");

app.use(express.static('public'));

app.listen(3000, function(){
    console.log("Listening on port 3000!")
  });

app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.get('/hello', function (req, res) {
    res.render('hello', { title: 'Hello', message: 'Hello there!' })
});
app.get("/get_next_screen", endpoints.getNextScreen);
