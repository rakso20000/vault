const crypto = window.crypto;
const subtle = crypto.subtle;

let resolveKey: (key: CryptoKey) => void;
let rejectKey: (reason?: any) => void;

let keyPromise = new Promise<CryptoKey>((resolve, reject) => {
	
	resolveKey = resolve;
	rejectKey = reject;
	
});

const base64Encode = (bytes: Uint8Array) => {
	
	let binaryString = '';
	
	bytes.forEach(byte => binaryString += String.fromCharCode(byte));
	
	return window.btoa(binaryString);
	
};

const base64Decode = (base64: string) => {
	
	const binaryString = window.atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	
	for (let i = 0; i < binaryString.length; ++i)
		bytes[i] = binaryString.charCodeAt(i);
	
	return bytes;
	
};

const generateSalt = () => {
	
	const saltData = crypto.getRandomValues(new Uint8Array(32));
	
	return base64Encode(saltData);
	
};

const hashPassword = async (password: string, salt: string) => {
	
	const textEncoder = new TextEncoder();
	const passwordData = textEncoder.encode(password);
	const saltData = base64Decode(salt);
	
	const data = new Uint8Array(passwordData.length + saltData.length);
	data.set(passwordData);
	data.set(saltData, passwordData.length);
	
	const digest = await subtle.digest('SHA-512', data);
	
	return base64Encode(new Uint8Array(digest));
	
};

const calculateKey = (password: string, salt: string) => {
	
	const generateKey = async () => {
		
		const textEncoder = new TextEncoder();
		const passwordData = textEncoder.encode(password);
		const saltData = base64Decode(salt);
		
		const passwordKey = await subtle.importKey(
			'raw',
			passwordData,
			'PBKDF2',
			false,
			['deriveKey']
		);
		
		return await subtle.deriveKey(
			{
				name: 'PBKDF2',
				hash: 'SHA-256',
				salt: saltData,
				iterations: 1000000
			},
			passwordKey,
			{
				name: 'AES-GCM',
				length: 256
			},
			false,
			['encrypt', 'decrypt']
		);
		
	};
	
	generateKey().then(resolveKey).catch(rejectKey);
	
};

const encryptText = async (text: string) => {
	
	const key = await keyPromise;
	
	const textEncoder = new TextEncoder();
	const textData = textEncoder.encode(text);
	
	const iv = crypto.getRandomValues(new Uint8Array(12));
	
	const ciphertextData = await subtle.encrypt(
		{
			name: 'AES-GCM',
			iv
		},
		key,
		textData
	);
	
	const ciphertextDataArray = new Uint8Array(ciphertextData);
	const data = new Uint8Array(iv.length + ciphertextDataArray.length);
	data.set(iv);
	data.set(ciphertextDataArray, iv.length);
	
	return base64Encode(data);
	
};

const decryptText = async (ciphertext: string) => {
	
	const key = await keyPromise;
	
	const ciphertextData = base64Decode(ciphertext);
	
	const iv = ciphertextData.slice(0, 12);
	const data = ciphertextData.slice(12);
	
	const textData = await subtle.decrypt(
		{
			name: 'AES-GCM',
			iv
		},
		key,
		data
	);
	
	const textDecoder = new TextDecoder();
	return textDecoder.decode(textData);
	
};

export {
	generateSalt,
	hashPassword,
	calculateKey,
	encryptText,
	decryptText
};