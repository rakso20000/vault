import pg from 'pg';
const {Client} = pg;

let dbClient;

const setupTables = async () => {
	
	const createUsers = dbClient.query(`
		CREATE TABLE IF NOT EXISTS users (
			name TEXT,
			password_hash CHAR(88) NOT NULL,
			password_salt CHAR(44) NOT NULL,
			PRIMARY KEY (name)
		);
	`);
	
	const createFolders = dbClient.query(`
		CREATE TABLE IF NOT EXISTS folders (
			id SERIAL,
			owner TEXT NOT NULL,
			cipher_name TEXT UNIQUE NOT NULL,
			PRIMARY KEY(id),
			FOREIGN KEY (owner)
				REFERENCES public.users(name)
				ON UPDATE CASCADE
				ON DELETE CASCADE
		);
	`);
	
	await Promise.all([createUsers, createFolders]);
	
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