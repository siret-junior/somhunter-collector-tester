let userProgress = {}

exports.getNextScreen = function (req, res) {
  user = req.session.user;

  const body = req.body;
  const targetImgId = body.targetImgId;
  const viewData = body.viewData;

  const clientID = Number(req.query.clientID);

  const fs = require('fs');

  let DisplayId = 0;

  if(user in userProgress)
  {
    if(clientID === -1) {
      DisplayId = userProgress[user]
    }
    else{
      userProgress[user] += 1
      DisplayId = userProgress[user]
    }    
  }
  else {
    userProgress[user] = 0
    DisplayId = 0
  }

  // create log if user did not disconnected
  if(clientID !== -1){

    // append data about user and session
    let appendData = user + ',' + String(DisplayId - 1) + ',' + String(targetImgId);

    // append data about frame grid
    for (let i = 1; i < viewData.length; ++i) {
      appendData += ',' + viewData[i].id + ',' + viewData[i].liked
    }

    fs.appendFile('./logs/' + Date.now() + '.csv', appendData, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  } 

  let frameData = []
  const data = fs.readFileSync("./data/" + DisplayId, {encoding:'utf8', flag:'r'});
 
  const allLines = data.split(/\r\n|\n/);

  // Reading line by line
  allLines.forEach((line) => {
    var res = line.split(',');

    object = { id: Number(res[0]), src: res[1], liked: false}
    frameData.push(object)
  });
  frameData = frameData.slice(0, 65);
  res.status(200).jsonp({ viewData: frameData, clientID: DisplayId });
};
