import WrapperProps from './props'

export default function Wrapper({ children, additionalStyles }: WrapperProps) {
	return (
		<div className={`w-full max-w-[425px] ${additionalStyles ?? ''}`}>
			{children}
		</div>
	)
}
