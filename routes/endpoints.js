const { Pool } = require('pg');
const fs = require('fs');

// Init db connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
})

const disp_sel_sql = `insert into display_selection values (nextval('somsequence'),$1,$2,$3,
current_date,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,
$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,
$52,$53,$54,$55,$56,$57,$58,$59,$60,$61,$62,$63,$64,$65,$66,$67,$68,$69,$70,$71,$72,$73,$74,
$75,$76,$77,$78,$79,$80,$81,$82,$83,$84,$85,$86,$87,$88,$89,$90,$91,$92,$93,$94,$95,$96,$97,
$98,$99,$100,$101,$102,$103,$104,$105,$106,$107,$108,$109,$110,$111,$112,$113,$114,$115,$116,
$117,$118,$119,$120,$121,$122,$123,$124,$125,$126,$127,$128,$129,$130,$131);`;



exports.postNextScreen = function (req, response) {
  user = req.session.user;

  const body = req.body;
  const targetImgId = body.targetImgId;
  const viewData = body.viewData;
  const displayId = Number(body.displayId);

  // save selection data
  let disp_sel_data = [user, displayId, targetImgId];

  for (let i = 1; i < viewData.length; ++i) {
    disp_sel_data.push(viewData[i].id);
    disp_sel_data.push(viewData[i].liked);
  }

  pool.query(disp_sel_sql, disp_sel_data, (err, res) => {
    if (err)
      throw err;

    console.log('Display ', user, displayId, " is saved");

    // update user status
    pool.query('update user_progress set display = display + 1, last_modif = CURRENT_DATE WHERE user_string = $1', [user],
      (err, res) => {
        if (err)
          throw err;

        console.log('User ', user, " state has been updated: ", res);

        exports.getNextScreen(req, response);
      });
  });
};

exports.getNextScreen = function (req, response) {
  user = req.session.user;

  console.log("Calling getNextScreen", user);

  // Load current user progress
  pool.query('SELECT display FROM user_progress WHERE user_string = $1', [user], (err, res) => {
    if (err)
      throw err;

    console.log('user ', user, ' is on display:', res.rows[0]);
    let displayId = res.rows[0].display;


    // Load new data
    if (displayId < 50) {

      fs.readFile("./data/" + displayId, { encoding: 'utf8', flag: 'r' }, (err, data) => {
        if (err)
          throw err;

        let frameData = [];
        const allLines = data.split(/\r\n|\n/);
        console.log("Loaded lines, first line: ", allLines[0]);

        // Reading line by line
        allLines.forEach((line) => {
          var splitted = line.split(',');

          if (splitted.length == 2) {
            object = { id: Number(splitted[0]), src: splitted[1], liked: false };
            frameData.push(object);
          }
        });


        response.status(200).jsonp({ viewData: frameData, displayId: displayId });
      });
    } else
      response.status(204).jsonp({ viewData: [], displayId: displayId });
  });
};
