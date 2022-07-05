import './TextInput.css';

const TextInput = ({value, setValue, errorMessage, setErrorMessage, type = 'text', onSubmit}) => {
	
	const handleChange = event => {
		
		setValue(event.target.value);
		
		if (errorMessage)
			setErrorMessage('');
		
	};
	
	const handleKeydown = event => {
		
		if (event.key === 'Enter')
			onSubmit?.();
		
	};
	
	return <div className="textInput">
		<input value={value} type={type} className={errorMessage ? "errorInput" : "input"} onChange={handleChange} onKeyDown={handleKeydown} />
		{errorMessage ? <p className="errorMessage">{errorMessage}</p> : null}
	</div>;
	
};

export default TextInput;