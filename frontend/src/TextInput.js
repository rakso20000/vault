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
	
	return <>
		<input value={value} type={type} className={errorMessage ? "errorInput" : "input"} onChange={handleChange} onKeyDown={handleKeydown} />
		{errorMessage ? <p className="errorMessage">{errorMessage}</p> : null}
	</>;
	
};

export default TextInput;