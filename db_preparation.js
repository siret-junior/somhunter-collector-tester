const { Pool } = require('pg');

// Init db connection
// const db_url = "postgres://test_user:Test1234@localhost/test_db";
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

const up_sql = `create table user_progress (
    id           integer PRIMARY KEY,
    user_string  varchar(40) UNIQUE NOT NULL,
    display      integer NOT NULL,
    last_modif   date
);`;

const ds_sql = `create table display_selection (
    id           integer PRIMARY KEY,
    user_string  varchar(40) NOT NULL,
    display      integer NOT NULL,
    target_id 	integer not null,
    created   date,
	D0_id  integer NOT NULL, D0_is_selected  varchar(10) NOT NULL, 
	D1_id  integer NOT NULL, D1_is_selected  varchar(10) NOT NULL, 
	D2_id  integer NOT NULL, D2_is_selected  varchar(10) NOT NULL, 
	D3_id  integer NOT NULL, D3_is_selected  varchar(10) NOT NULL, 
	D4_id  integer NOT NULL, D4_is_selected  varchar(10) NOT NULL, 
	D5_id  integer NOT NULL, D5_is_selected  varchar(10) NOT NULL, 
	D6_id  integer NOT NULL, D6_is_selected  varchar(10) NOT NULL, 
	D7_id  integer NOT NULL, D7_is_selected  varchar(10) NOT NULL, 
	D8_id  integer NOT NULL, D8_is_selected  varchar(10) NOT NULL, 
	D9_id  integer NOT NULL, D9_is_selected  varchar(10) NOT NULL, 
	D10_id  integer NOT NULL, D10_is_selected  varchar(10) NOT NULL, 
	D11_id  integer NOT NULL, D11_is_selected  varchar(10) NOT NULL, 
	D12_id  integer NOT NULL, D12_is_selected  varchar(10) NOT NULL, 
	D13_id  integer NOT NULL, D13_is_selected  varchar(10) NOT NULL, 
	D14_id  integer NOT NULL, D14_is_selected  varchar(10) NOT NULL, 
	D15_id  integer NOT NULL, D15_is_selected  varchar(10) NOT NULL, 
	D16_id  integer NOT NULL, D16_is_selected  varchar(10) NOT NULL, 
	D17_id  integer NOT NULL, D17_is_selected  varchar(10) NOT NULL, 
	D18_id  integer NOT NULL, D18_is_selected  varchar(10) NOT NULL, 
	D19_id  integer NOT NULL, D19_is_selected  varchar(10) NOT NULL, 
	D20_id  integer NOT NULL, D20_is_selected  varchar(10) NOT NULL, 
	D21_id  integer NOT NULL, D21_is_selected  varchar(10) NOT NULL, 
	D22_id  integer NOT NULL, D22_is_selected  varchar(10) NOT NULL, 
	D23_id  integer NOT NULL, D23_is_selected  varchar(10) NOT NULL, 
	D24_id  integer NOT NULL, D24_is_selected  varchar(10) NOT NULL, 
	D25_id  integer NOT NULL, D25_is_selected  varchar(10) NOT NULL, 
	D26_id  integer NOT NULL, D26_is_selected  varchar(10) NOT NULL, 
	D27_id  integer NOT NULL, D27_is_selected  varchar(10) NOT NULL, 
	D28_id  integer NOT NULL, D28_is_selected  varchar(10) NOT NULL, 
	D29_id  integer NOT NULL, D29_is_selected  varchar(10) NOT NULL, 
	D30_id  integer NOT NULL, D30_is_selected  varchar(10) NOT NULL, 
	D31_id  integer NOT NULL, D31_is_selected  varchar(10) NOT NULL, 
	D32_id  integer NOT NULL, D32_is_selected  varchar(10) NOT NULL, 
	D33_id  integer NOT NULL, D33_is_selected  varchar(10) NOT NULL, 
	D34_id  integer NOT NULL, D34_is_selected  varchar(10) NOT NULL, 
	D35_id  integer NOT NULL, D35_is_selected  varchar(10) NOT NULL, 
	D36_id  integer NOT NULL, D36_is_selected  varchar(10) NOT NULL, 
	D37_id  integer NOT NULL, D37_is_selected  varchar(10) NOT NULL, 
	D38_id  integer NOT NULL, D38_is_selected  varchar(10) NOT NULL, 
	D39_id  integer NOT NULL, D39_is_selected  varchar(10) NOT NULL, 
	D40_id  integer NOT NULL, D40_is_selected  varchar(10) NOT NULL, 
	D41_id  integer NOT NULL, D41_is_selected  varchar(10) NOT NULL, 
	D42_id  integer NOT NULL, D42_is_selected  varchar(10) NOT NULL, 
	D43_id  integer NOT NULL, D43_is_selected  varchar(10) NOT NULL, 
	D44_id  integer NOT NULL, D44_is_selected  varchar(10) NOT NULL, 
	D45_id  integer NOT NULL, D45_is_selected  varchar(10) NOT NULL, 
	D46_id  integer NOT NULL, D46_is_selected  varchar(10) NOT NULL, 
	D47_id  integer NOT NULL, D47_is_selected  varchar(10) NOT NULL, 
	D48_id  integer NOT NULL, D48_is_selected  varchar(10) NOT NULL, 
	D49_id  integer NOT NULL, D49_is_selected  varchar(10) NOT NULL, 
	D50_id  integer NOT NULL, D50_is_selected  varchar(10) NOT NULL, 
	D51_id  integer NOT NULL, D51_is_selected  varchar(10) NOT NULL, 
	D52_id  integer NOT NULL, D52_is_selected  varchar(10) NOT NULL, 
	D53_id  integer NOT NULL, D53_is_selected  varchar(10) NOT NULL, 
	D54_id  integer NOT NULL, D54_is_selected  varchar(10) NOT NULL, 
	D55_id  integer NOT NULL, D55_is_selected  varchar(10) NOT NULL, 
	D56_id  integer NOT NULL, D56_is_selected  varchar(10) NOT NULL, 
	D57_id  integer NOT NULL, D57_is_selected  varchar(10) NOT NULL, 
	D58_id  integer NOT NULL, D58_is_selected  varchar(10) NOT NULL, 
	D59_id  integer NOT NULL, D59_is_selected  varchar(10) NOT NULL, 
	D60_id  integer NOT NULL, D60_is_selected  varchar(10) NOT NULL, 
	D61_id  integer NOT NULL, D61_is_selected  varchar(10) NOT NULL, 
	D62_id  integer NOT NULL, D62_is_selected  varchar(10) NOT NULL, 
	D63_id  integer NOT NULL, D63_is_selected  varchar(10) NOT NULL
);`;

const seq_sql = `CREATE SEQUENCE somsequence
INCREMENT 1
START 100;`;

const user_sql = `insert into user_progress (id, user_string, display, last_modif) values (nextval('somsequence'), $1, 0, CURRENT_DATE)`;

exports.prepare_db = function (users) {

	pool.query(up_sql, [], (err, res) => {
		if (err)
			console.log(err);
		else
			console.log('User progress created');


		pool.query(seq_sql, [], (err, res) => {
			if (err)
				console.log(err);
			else
				console.log('Sequence created');
				
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

	pool.query(ds_sql, [], (err, res) => {
		if (err)
			console.log(err);
		else
			console.log('Display selection created');
	});
}
