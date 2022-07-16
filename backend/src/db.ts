import pgPromise, {IDatabase} from 'pg-promise';
import {IClient} from 'pg-promise/typescript/pg-subset';
import {configPromise} from './config';

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
				PRIMARY KEY (id),
				FOREIGN KEY (owner)
					REFERENCES public.users(name)
					ON UPDATE CASCADE
					ON DELETE CASCADE
			);
		`);
		
		const createFiles = t.none(`
			CREATE TABLE IF NOT EXISTS files (
				id SERIAL,
				folder INT NOT NULL,
				cipher_name TEXT UNIQUE NOT NULL,
				cipher_type TEXT NOT NULL,
				oid INT UNIQUE NOT NULL,
				PRIMARY KEY (id),
				FOREIGN KEY (folder)
					REFERENCES public.folders(id)
					ON UPDATE CASCADE
					ON DELETE CASCADE
			);
		`);
		
		await Promise.all([createUsers, createFolders, createFiles]);
		
	});
	
}

const initDB = async () => {
	
	const config = await configPromise;
	
	const pgp = pgPromise();
	
	db = pgp(config.databaseURL);
	
	await setupTables();
	
};

export {initDB, db};