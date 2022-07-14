import {FC} from 'react';
import style from './styles/FileSelector.module.scss';
import {apiCall, SetState, showError, useAsyncEffect} from './util';
import {decryptData} from './crypto';
import fileIcon from './assets/file.svg';
import loadingIcon from './assets/loading_spinner.svg';
import downloadIcon from './assets/download.svg';

type FileData = {
	key: string;
	name: string;
	type: string;
	data?: Blob;
	origin: 'server' | 'client';
	isLoading: boolean
};

type Props = {
	fileData: FileData;
	setFiles: SetState<FileData[]>;
};

const FileSelector: FC<Props> = ({fileData: {key, name, type, data, origin, isLoading}, setFiles}) => {
	
	const showPreview = type.startsWith('image/');
	
	const loadData = async () => {
		
		let cipherFileData;
		
		try {
			
			cipherFileData = await apiCall('POST', 'downloadFile', {
				cipherFileName: key
			});
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to download file');
			return;
			
		}
		
		const decryptedData = await decryptData(cipherFileData);
		
		return new Blob([decryptedData], {type});
		
	};
	
	useAsyncEffect(async () => {
		
		if (!showPreview || !isLoading || origin === 'client')
			return;
		
		const data = await loadData();
		
		//error occurred
		if (data === undefined)
			return;
		
		setFiles(prevFiles => prevFiles.map(file => file.key === key ? {...file, isLoading: false, data} : file));
		
	}, [key]);
	
	let url: (string | null) = null;
	
	if (showPreview && data !== undefined)
		url = URL.createObjectURL(data);
	
	const download = async () => {
		
		let downloadData = data;
		
		if (downloadData === undefined) {
			
			downloadData = await loadData();
			
			//error occurred
			if (downloadData === undefined)
				return;
			
			setFiles(prevFiles => prevFiles.map(file => file.key === key ? {...file, data} : file));
			
		}
		
		const url = URL.createObjectURL(downloadData);
		
		const a = window.document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = name;
		window.document.body.appendChild(a);
		a.click();
		
		URL.revokeObjectURL(url);
		
	};
	
	return <div className={style.main}>
		<div className={style.imageContainer}>
			{!showPreview ?
				<img className={style.imagePreview} src={fileIcon} alt="" /> :
				url == null ?
					<img className={style.imagePreview} src={loadingIcon} alt="" /> :
					<img className={style.imagePreview} src={url} alt="" />
			}
		</div>
		<p className={style.label}>{origin === 'server' || !isLoading ? name : 'Uploading'}</p>
		<div className={style.overlay}>
			<button className={style.iconButton} onClick={download}>
				<img className={style.icon} src={downloadIcon} alt="Edit" />
			</button>
		</div>
	</div>;
	
};

export type {
	FileData
};

export default FileSelector;