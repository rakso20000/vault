import {DragEventHandler, FC, useEffect, useState} from 'react';
import style from './styles/FileArea.module.scss';
import {Folder} from './Main';
import {apiCall, classes, showError, useAsyncEffect} from './util';
import FileSelector, {FileData} from './FileSelector';
import {decryptText, encryptData, encryptText} from './crypto';

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
					uploaded: true
				});
				
			}));
			
			setFiles(prevFiles => [...files, ...prevFiles]);
			
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
		
		const {key, type, file} = fileData;
		
		if (file === undefined)
			throw new Error('file should not be undefined');
		
		const [
			cipherFileType,
			encryptedFile
		] = await Promise.all([
			encryptText(type),
			encryptData(await file.arrayBuffer())
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
		
		setFiles(prevFiles => prevFiles.map(file => file.key === key ? {...file, uploaded: true} : file));
		
	};
	
	const handleDrop: DragEventHandler<HTMLDivElement> = async event => {
		
		event.preventDefault();
		event.stopPropagation();
		
		setIsDragTarget(false);
		
		const selectedFiles: File[] = [];
		
		for (let i = 0; i < event.dataTransfer.files.length; ++i) {
			
			const file = event.dataTransfer.files.item(i);
			
			if (file === null)
				continue;
			
			selectedFiles.push(file);
			
		}
		
		const newFiles: FileData[] = await Promise.all(selectedFiles.map(async file => ({
			key: await encryptText(file.name),
			name: file.name,
			type: file.type,
			file,
			uploaded: false
		})));
		
		setFiles(files.concat(newFiles));
		
		for (const fileData of newFiles)
			uploadFile(fileData).catch(console.error);
		
	};
	
	return <div className={classes(style.main)} onDragEnter={handleDrag} onDragOver={handleDrag}>
		{files.map(file =>
			<FileSelector key={file.key} fileData={file} folder={folder} />
		)}
		{isDragTarget ?
			<div className={style.dragQueen} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} /> : null
		}
	</div>;
	
};

export default FileArea;