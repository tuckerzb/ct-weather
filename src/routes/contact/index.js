import { h } from 'preact';
import axios from 'axios';
import style from './style.css';
import {useState} from 'preact/hooks';


const Contact = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [response, setResponse] = useState('');
	const [botCheck, setBotCheck] = useState('');
	const [error, setError] = useState('');

	const validateEmail = (toTest) => {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return regex.test(toTest.toLowerCase());
	}

	const sendMessage = (e) => {
		e.preventDefault();
		setError('');
		setResponse('');
		if (botCheck !== 'denver') {
			setError('You did not pass the bot check test! Please select the city that holds a CT terminus.');
			return;
		} else if (!email || !validateEmail(email)) {
			setError('Please enter a valid email address so I know where to send my reply!')
			return;
		}
		console.log(`Sending Message`);
		axios({
			method: 'POST',
			url: `https://cdt-weather-backend.herokuapp.com/api/sendMessage`,
			data: {
				name,
				email,
				message
			}
		}).then(resp => {
			setResponse(resp.data.message);
		}, error => console.log(error));
	}
	
	return (<div class={style.container}>
		<div class={style.headerBlock}>
			<h1>Contact</h1>
			<p>Please use the below form to submit comments, suggestions, and concerns.</p>
			{/* <p>Please note that Zach is likely on trail, and responses may be delayed.</p> */}
		</div>
		{response && <div class={style.messageBlock}>{response}</div>}
		{error && <div class={style.errorBlock}>{error}</div>}
		<div class={style.formContainer}>
			<div>
				<label for='name'>Your Name:</label>
				<input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} />
			</div>
			<div>
				<label for='name'>Your Email:</label>
				<input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
			</div>
			<div>
				<label for='name'>Your Message:</label>
				<textarea id='message' value={message} rows={5} onChange={(e) => setMessage(e.target.value)} />
			</div>
			<div>
				<label for='botcheck'><strong>Bot Check: Select the Colorado Trail Terminus City</strong></label>
				<select value={botCheck} id='botcheck' class={style.botCheck} onChange={(e) => setBotCheck(e.target.value)}>
					<option value=''>Please Select</option>
					<option value='moscow'>Moscow</option>
					<option value='paris'>Paris</option>
					<option value='houston'>Houston, TX</option>
					<option value='denver'>Denver, CO</option>
				</select>
			</div>
			<button type='submit' onClick={sendMessage}>Send Message</button>
		</div>
	</div>);
};

export default Contact;
