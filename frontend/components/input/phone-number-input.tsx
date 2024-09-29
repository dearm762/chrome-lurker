import React from 'react'

interface PhoneNumberInputProps {
	value: string
	onChange: (value: string) => void
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
	value,
	onChange,
}) => {
	const formatPhoneNumber = (input: string) => {
		// Удаляем все символы, кроме цифр
		const digits = input.replace(/\D/g, '')

		// Если первые цифры не "7", добавляем "7" автоматически
		let formatted = '+7'
		if (digits.length > 1) {
			formatted += ` (${digits.substring(1, 4)}`
		}
		if (digits.length >= 5) {
			formatted += `) ${digits.substring(4, 7)}`
		}
		if (digits.length >= 8) {
			formatted += `-${digits.substring(7, 9)}`
		}
		if (digits.length >= 10) {
			formatted += `-${digits.substring(9, 11)}`
		}

		return formatted
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let inputValue = e.target.value
		if (!inputValue.startsWith('+7')) {
			inputValue = '+7 ' + inputValue.replace(/\D/g, '') // добавляем +7, если не введено
		}

		const formattedValue = formatPhoneNumber(inputValue)
		onChange(formattedValue)
	}

	return (
		<label className='input input-bordered flex items-center gap-2 w-full max-w-96'>
			<input
				className='grow w-ful'
				type='tel'
				id='phone-number'
				name='phone-number'
				value={value}
				onChange={handleChange}
				placeholder='+7 (___) ___-__-__'
				required
			/>
		</label>
	)
}

export default PhoneNumberInput
