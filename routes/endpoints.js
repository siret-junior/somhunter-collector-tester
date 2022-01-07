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

  fs.readFile('../sql/display_selection_insert.sql', (err, disp_sel_sql) => {
    pool.query(disp_sel_sql, disp_sel_data, (err, res) => {
      if (err)
        throw err;

      console.log('Display ', user, displayId, " is saved");

      // update user status
      fs.readFile('../sql/user_progress_select.sql', (err, sql) => {
        pool.query(sql, [user],
          (err, res) => {
            if (err)
              throw err;

            console.log('User ', user, " state has been updated: ", res);

            exports.getNextScreen(req, response);
          });
      });
    });
  });
};

exports.getNextScreen = function (req, response) {
  user = req.session.user;

  console.log("Calling getNextScreen", user);

  // Load current user progress

  fs.readFile('../sql/user_progress_select.sql', (err, sql) => {
    pool.query(sql, [user], (err, res) => {
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
  });
};
