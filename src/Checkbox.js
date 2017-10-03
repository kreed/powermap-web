import React from 'react';

export default function Checkbox(props) {
	return (
		<label>
			<input
				type="checkbox"
				checked={props.checked}
				onChange={props.handler}
				/>
			{props.label}
		</label>
	);
}
