var express = require('express');
const session = require("express-session");
// API endpoints
const endpoints = require("./routes/endpoints");
const dpPrep = require("./db_preparation");
const bodyParser = require('body-parser');

// auth credentials
const creds = {"test12345": "test112345"  ,"test54321": "test54321", "User_0": "MZCoQh8uM5swkkx0JNxc", "User_1": "v0bxRDLb7uGl5v8RyWA6", "User_2": "PB7po99U9YR2Z4cKYgui", "User_3": "Mrdy7nX5iz0btBU7gR8h", "User_4": "UInqJXNdb9f1Pd1CrzRH", "User_5": "j9JnEVohnw749NupSrU0", "User_6": "xzy777SOCoSaygixaRhx", "User_7": "kYqhIIG6ePM5OBgihlHG", "User_8": "V2w9xKIRNvAIaIKUncae", "User_9": "z2nMAioozP7mYFMWZ8Fd", "User_10": "DKwMSoQCJmFg6YvBbPS9", "User_11": "40fBBRRtD9k52ByM9Ga4", "User_12": "A94ZmOcMfhAi9KGYPRxo", "User_13": "61FFxOZW9W5Zl9MbcWKW", "User_14": "3q6WbbB1wKFGas9b0RzF", "User_15": "fF2d2k36qLxeZHfvkVpG", "User_16": "i76fpCct76JszcstFgZO", "User_17": "GNMrNakB4yXwEDPIg7pz", "User_18": "V4Z7WbaV9leKF62iOIsV", "User_19": "pctx13GxZkWhJLNt9IV9", "User_20": "yIyCrTrb1Ip8OJGdGnuV", "User_21": "t3hgcqGVl6Yv2vTDLLSY", "User_22": "1hAAHuDGBUGe78VsdIWq", "User_23": "RBDCT0fI7OKxCWT0EI7G", "User_24": "Z8uFwGcryPE15cNTxXFU", "User_25": "vwbAPbzqNGiQ1VMCP2zI", "User_26": "Xyxm75g4JStahTpnlYwo", "User_27": "BHbFwvYy598v55vWZPfo", "User_28": "1Q7KGh07RReMdfSFZDUI", "User_29": "2NZpmX7PDsq3sB52zKz0", "User_30": "9wil0a55aUHF91VyNS0a", "User_31": "p8MevC2clzpYKv4CnBeU", "User_32": "WDT9ZelpzzVuMJG9DKw5", "User_33": "j1eJHZEj5s5Fa3eSdpxp", "User_34": "2bWBFAtxlXI7GG8YQKlc", "User_35": "aGNjQRCmlETb8YXIwqzh", "User_36": "Czjz9HYOgd50XSkC3Jyu", "User_37": "84JjKixIWIVJrWMFxw9F", "User_38": "KlW2mwyIODqW9tVyvm6s", "User_39": "WJl8OsligBnEZs5Up0eI", "User_40": "lyZ6uJ0wp4MS0P5MnE5e", "User_41": "IwCQkrUlij5Rq8LgTmNP", "User_42": "iXA5beCKLshVSavZqgyS", "User_43": "dJf7Es8R1MAjzsM9cSmX", "User_44": "B95tBh8OMacmB947Wy3G", "User_45": "L0f5RSFS8Uup1uk7KJIs", "User_46": "t4rUOWnoEa011cpw4klj", "User_47": "FphLlxB0h5BJzh57XBBK", "User_48": "OJA1qiG0tmBVCmTI8frY", "User_49": "eUybj3DX6Se23G1arFUW"} 

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
