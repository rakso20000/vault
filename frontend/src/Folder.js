const Folder = ({folder, setSelected}) => {
	
	const select = () => {
		
		setSelected(folder);
		
	};
	
	return <div>
		<button onClick={select}>{folder.name}</button>
	</div>;
	
};

export default Folder;