'use client';

import { useState } from 'react';

export default function TicketChanger() {
	const [tid, setTid] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		fetch('/setting/', {
			method: 'POST',
			body: JSON.stringify({
				tid, password
			})
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				console.log('Success:', data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="tid"
				value={tid}
				onChange={({ target: { value } }) => setTid(value)}
			/>
			<input
				type="password"
				name="pass"
				value={password}
				onChange={({ target: { value } }) => setPassword(value)}
			/>
			<button type="submit">Submit</button>
		</form>
	);
}
