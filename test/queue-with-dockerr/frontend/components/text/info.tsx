import TextProps from './text.props'

export default function Info({ text, additionalStyle }: TextProps) {
	return (
		<p className={`text-black text-center font-semibold ${additionalStyle ?? additionalStyle}`}>{ text }</p>
	)
}
