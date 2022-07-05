const Folder = ({folder, setSelected}) => {
	
	const select = () => {
		
		setSelected(folder);
		
	};
	
	return <div>
		<button onClick={select}>{folder}</button>
	</div>;
	
};

export default Folder;