const crypto = window.crypto;
const subtle = crypto.subtle;

let resolveKey;
let rejectKey;

let keyPromise = new Promise((resolve, reject) => {
	
	resolveKey = resolve;
	rejectKey = reject;
	
});

const base64Encode = bytes => {
	
	let binaryString = '';
	
	bytes.forEach(byte => binaryString += String.fromCharCode(byte));
	
	return window.btoa(binaryString);
	
};

const base64Decode = base64 => {
	
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

const hashPassword = async (password, salt) => {
	
	const textEncoder = new TextEncoder();
	const passwordData = textEncoder.encode(password);
	const saltData = base64Decode(salt);
	const data = new Uint8Array([...passwordData, ...saltData]);
	
	const digest = await subtle.digest('SHA-512', data);
	
	return base64Encode(new Uint8Array(digest));
	
};

const calculateKey = (password, salt) => {
	
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

const encryptText = async text => {
	
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
	
	return base64Encode(new Uint8Array([...iv, ...new Uint8Array(ciphertextData)]));
	
};

const decryptText = async ciphertext => {
	
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