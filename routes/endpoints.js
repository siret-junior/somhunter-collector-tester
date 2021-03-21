
exports.getNextScreen = function (req, res) {

  const DisplayId = Number(req.query.displayId);

  const fs = require('fs');

  let frameData = [];
  const data = fs.readFileSync("./data/" + DisplayId, {encoding:'utf8', flag:'r'});
 
  const allLines = data.split(/\r\n|\n/);

  // Reading line by line
  allLines.forEach((line) => {
    var res = line.split(',');

    object = { id: Number(res[0]), src: res[1]}
    frameData.push(object)
  });
  console.log(frameData)
  frameData = frameData.slice(0, 65);
  res.status(200).jsonp({ viewData: frameData });
};

exports.likeFrame = function (req, res) {
  
  res.status(200).jsonp({ isLiked: true });
};
exports.unlikeFrame = function (req, res) {
  
  res.status(200).jsonp({ isLiked: false });
};