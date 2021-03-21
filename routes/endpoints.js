exports.getNextScreen = function (req, res) {
    let frameData = [];
    for (i = 0; i < 64; i++) {
        object = { liked: false, src: 'nothing.jpg', id: 0}
        frameData.push(object)
      } 
    res.status(200).jsonp({ viewData: frameData });
};