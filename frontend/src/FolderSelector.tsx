import {FC} from 'react';
import {Folder} from './Main';
import {SetState} from './util';

type Props = {
	folder: Folder;
	setSelected: SetState<Folder | null>;
};

const FolderSelector: FC<Props> = ({folder, setSelected}) => {
	
	const select = () => {
		
		setSelected(folder);
		
	};
	
	return <div>
		<button onClick={select}>{folder.name}</button>
	</div>;
	
};

export default FolderSelector;