import pg from 'pg';
const {Client} = pg;

let dbClient;

const setupTables = async () => {
	
	await dbClient.query(`
		CREATE TABLE IF NOT EXISTS users (
			username TEXT PRIMARY KEY,
			password_hash CHAR(88) NOT NULL,
			password_salt CHAR(44) NOT NULL
		);
	`);
	
}

const initDB = async () => {
	
	dbClient = new Client({
		user: 'vault',
		password: '1234',
		database: 'vault'
	});
	
	await dbClient.connect();
	
	await setupTables();
	
};

export {initDB, dbClient};