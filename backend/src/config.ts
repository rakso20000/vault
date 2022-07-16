import fs, {FileHandle} from 'node:fs/promises';
import path from 'node:path';

type Config = {
	port: number;
	databaseURL: string;
};


const getConfig = async (): Promise<Config> => {
	
	const defaultConfig: Config = {
		port: 14151,
		databaseURL: 'postgres://vault:password@localhost/vault'
	};
	
	const filePath = path.join(__dirname, '..', '..', 'config.json');
	
	const parsedConfig: {
		port?: number;
		databaseURL?: string;
	} = {};
	
	let file: FileHandle | null = null;
	
	try {
		
		file = await fs.open(filePath);
		
		const contents = await file.readFile({
			encoding: 'utf-8'
		});
		
		const parsedContents = JSON.parse(contents);
		
		if (typeof parsedContents.port === 'number')
			parsedConfig.port = parsedContents.port;
		
		if (typeof parsedContents.databaseURL === 'string')
			parsedConfig.databaseURL = parsedContents.databaseURL;
		
	} catch (error: any) {
		
		if (error?.code !== 'ENOENT') {
			
			console.error('Error occurred trying to read config file');
			
			throw error;
			
		}
		
	} finally {
		
		await file?.close();
		
	}
	
	const config: Config = {
		port: parsedConfig.port ?? defaultConfig.port,
		databaseURL: parsedConfig.databaseURL ?? defaultConfig.databaseURL
	};
	
	await fs.writeFile(filePath, JSON.stringify(config, null, '\t'));
	
	return config;
	
};

const configPromise = getConfig();

export {
	configPromise
};