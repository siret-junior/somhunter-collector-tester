const { Pool } = require('pg');
const fs = require('fs');

// Init db connection
// const db_url = "postgres://test_user:Test1234@localhost/test_db";
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

exports.prepare_db = function (users) {
	const up_sql = fs.readFileSync("sql/user_progress_create.sql");
	pool.query(up_sql, [], (err, res) => {
		if (err)
			console.log(err);
		else
			console.log('User progress created');

		const seq_sql = fs.readFileSync("sql/somsequence_create.sql");
		pool.query(seq_sql, [], (err, res) => {
			if (err)
				console.log(err);
			else
				console.log('Sequence created');
				
			const user_sql = fs.readFileSync("sql/user_progress_insert.sql");
			for (var el in users) {
				pool.query(user_sql, [el], (err, res) => {
					if (err)
						console.log(err);
					else
						console.log('user ' + res + ' created');
				});
			}
		});

	});

	const ds_sql = fs.readFileSync("sql/display_selection_create.sql");
	pool.query(ds_sql, [], (err, res) => {
		if (err)
			console.log(err);
		else
			console.log('Display selection created');
	});
}
