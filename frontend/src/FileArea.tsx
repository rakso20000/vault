import {ChangeEventHandler, DragEventHandler, FC, useEffect, useState} from 'react';
import style from './styles/FileArea.module.scss';
import {Folder} from './Main';
import {apiCall, classes, showError, useAsyncEffect} from './util';
import FileSelector, {FileData} from './FileSelector';
import {decryptText, encryptData, encryptText} from './crypto';
import plusIcon from './assets/plus.svg';

type Props = {
	folder: Folder;
};

const FileArea: FC<Props> = ({folder}) => {
	
	const [files, setFiles] = useState<FileData[]>([]);
	const [isDragTarget, setIsDragTarget] = useState(false);
	
	const handleGlobalDrag = (event: DragEvent) => {
		
		if (event.dataTransfer)
			event.dataTransfer.dropEffect = 'none';
		
	};
	
	useEffect(() => {
		
		window.document.body.ondragenter = handleGlobalDrag;
		window.document.body.ondragover = handleGlobalDrag;
		
		return () => {
			
			window.document.body.ondragenter = null;
			window.document.body.ondragover = null;
			
		};
		
	}, []);
	
	useAsyncEffect(async () => {
		
		try {
			
			const cipherFiles: {name: string, type: string}[] = await apiCall('POST', 'getFiles', {
				cipherFolderName: folder.key
			});
			
			const files: FileData[] = await Promise.all(cipherFiles.map(async cipherFile => {
				
				const [
					name,
					type
				] = await Promise.all([
					decryptText(cipherFile.name),
					decryptText(cipherFile.type)
				]);
				
				return({
					key: cipherFile.name,
					name,
					type,
					origin: 'server',
					isLoading: type.startsWith('image/')
				});
				
			}));
			
			setFiles(prevFiles => [...files, ...prevFiles.filter(file => file.origin === 'client')]);
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to load files');
			
		}
		
	}, [folder.originalKey]);
	
	const handleDrag: DragEventHandler<HTMLDivElement> = event => {
		
		event.preventDefault();
		event.stopPropagation();
		
		if (event.type === 'dragenter' || event.type === 'dragover') {
			
			if (event.dataTransfer.types.includes('Files')) {
				
				event.dataTransfer.dropEffect = 'copy';
				setIsDragTarget(true);
				
			} else {
				
				event.dataTransfer.dropEffect = 'none';
				
			}
			
		} else {
			
			setIsDragTarget(false);
			
		}
		
	};
	
	const uploadFile = async (fileData: FileData) => {
		
		const {key, type, data} = fileData;
		
		if (data === undefined)
			throw new Error('data should not be undefined');
		
		const [
			cipherFileType,
			encryptedFile
		] = await Promise.all([
			encryptText(type),
			encryptData(await data.arrayBuffer())
		]);
		
		try {
			
			await apiCall('PUT', 'uploadFile', {
				cipherFolderName: folder.key,
				cipherFileName: key,
				cipherFileType
			}, encryptedFile);
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to upload file');
			
			setFiles(prevFiles => prevFiles.filter(file => file.key !== key));
			
			return;
			
		}
		
		setFiles(prevFiles => prevFiles.map(file => file.key === key ? {...file, isLoading: false} : file));
		
	};
	
	const addFiles = async (files: FileList) => {
		
		const selectedFiles: File[] = [];
		
		for (let i = 0; i < files.length; ++i) {
			
			const file = files.item(i);
			
			if (file === null)
				continue;
			
			selectedFiles.push(file);
			
		}
		
		const newFiles: FileData[] = await Promise.all(selectedFiles.map(async file => ({
			key: await encryptText(file.name),
			name: file.name,
			type: file.type,
			data: file,
			origin: 'client',
			isLoading: true
		})));
		
		setFiles(prevFiles => prevFiles.concat(newFiles));
		
		for (const fileData of newFiles)
			uploadFile(fileData).catch(console.error);
		
	};
	
	const handleDrop: DragEventHandler<HTMLDivElement> = async event => {
		
		event.preventDefault();
		event.stopPropagation();
		
		setIsDragTarget(false);
		
		await addFiles(event.dataTransfer.files);
		
	};
	
	const handleChange: ChangeEventHandler<HTMLInputElement> = async event => {
		
		const files = event.target.files;
		
		if (files === null)
			return;
		
		await addFiles(files);
		
	};
	
	return <div className={classes(style.main)} onDragEnter={handleDrag} onDragOver={handleDrag}>
		{files.map(file =>
			<FileSelector key={file.key} fileData={file} setFiles={setFiles} />
		)}
		<label className={style.uploadButton}>
			<input type="file" onChange={handleChange} />
			<img src={plusIcon} alt="Upload" />
		</label>
		{isDragTarget ?
			<div className={style.dragQueen} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} /> : null
		}
	</div>;
	
};

export default FileArea;