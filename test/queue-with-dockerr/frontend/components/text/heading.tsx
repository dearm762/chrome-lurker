import TextProps from './text.props'

export default function Heading({ text, additionalStyle }: TextProps) {
	return (
		<h2 className={`text-2xl font-bold text-ticket-text ${additionalStyle ?? additionalStyle}`}>{text}</h2>
	)
}