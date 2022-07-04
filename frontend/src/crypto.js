const crypto = window.crypto;
const subtle = crypto.subtle;

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

export {
	generateSalt,
	hashPassword
};