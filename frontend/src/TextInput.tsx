import {FC, ChangeEventHandler, KeyboardEventHandler} from 'react';
import style from './TextInput.module.css';
import {State} from './util';

type Props = {
	value: State<string>;
	errorMessage: State<null | string>;
	type?: string;
	onSubmit: () => void;
};

const TextInput: FC<Props> = ({value: [value, setValue], errorMessage: [errorMessage, setErrorMessage], type = 'text', onSubmit}) => {
	
	const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
		
		setValue(event.target.value);
		
		if (errorMessage)
			setErrorMessage(null);
		
	};
	
	const handleKeydown: KeyboardEventHandler<HTMLInputElement> = event => {
		
		if (event.key === 'Enter')
			onSubmit?.();
		
	};
	
	return <>
		<input value={value} type={type} className={errorMessage ? style.errorInput : style.input} onChange={handleChange} onKeyDown={handleKeydown} />
		{errorMessage ? <p className={style.errorMessage}>{errorMessage}</p> : null}
	</>;
	
};

export default TextInput;