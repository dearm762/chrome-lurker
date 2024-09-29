import type { ReactNode } from 'react'

type ReadOnlyChild = Readonly<{
	children: ReactNode
}>

export default ReadOnlyChild
