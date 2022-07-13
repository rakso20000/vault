import pgPromise, {IDatabase} from 'pg-promise';
import {IClient} from 'pg-promise/typescript/pg-subset';

let db: IDatabase<{}, IClient>

const setupTables = async () => {
	
	await db.task(async t => {
		
		const createUsers = t.none(`
			CREATE TABLE IF NOT EXISTS users (
				name TEXT,
				password_hash CHAR(88) NOT NULL,
				password_salt CHAR(44) NOT NULL,
				PRIMARY KEY (name)
			);
		`);
		
		const createFolders = t.none(`
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
		
	});
	
}

const initDB = async () => {
	
	const pgp = pgPromise();
	
	db = pgp('postgres://vault:1234@localhost/vault');
	
	await setupTables();
	
};

export {initDB, db};