import {FC, useEffect} from 'react';
import style from './styles/Prompt.module.scss';
import {classes, State} from './util';

type PromptData = {
	title: string;
	message: string;
	buttonText: string;
	callback: (confirmed: boolean) => void;
};

type Props = {
	promptDataQueueState: State<PromptData[]>;
};

const Prompt: FC<Props> = ({promptDataQueueState: [promptDataQueue, setPromptDataQueue]}) => {
	
	const {title, message, buttonText, callback} = promptDataQueue[0];
	
	useEffect(() => {
		
		//disable scrolling
		window.document.body.style.overflow = 'hidden';
		
		return () => {
			
			window.document.body.style.overflow = '';
			
		};
		
	}, []);
	
	const closePrompt = () => {
		
		setPromptDataQueue(promptDataQueue.slice(1));
		
	};
	
	const cancel = () => {
		
		callback(false);
		closePrompt();
		
	};
	
	const confirm = () => {
		
		callback(true);
		closePrompt();
		
	};
	
	return <div className={style.background}>
		<div className={style.prompt}>
			<div className={style.title}>{title}</div>
			<div className={style.content}>
				<p className={style.message}>{message}</p>
				<div className={style.buttonBar}>
					<button className={classes(style.button, style.neutral)} onClick={cancel}>Cancel</button>
					<button className={classes(style.button, style.reject)} onClick={confirm}>{buttonText}</button>
				</div>
			</div>
		</div>
	</div>;
	
};

export type {
	PromptData
};

export default Prompt;