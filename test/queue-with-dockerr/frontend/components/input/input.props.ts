import { Dispatch, SetStateAction } from 'react'

interface inputProps {
	value: string
	setValue: Dispatch<SetStateAction<string>>
	customWidth?: string
	customPlaceholder?: string,
	type?: string
}

export default inputProps
