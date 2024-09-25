'use client'

import { Button } from "@/components/ui/button"
import { signOut } from 'next-auth/react'

export default function SignOutButton() {

	return (
		<Button type="submit" onClick={() => signOut()} variant={'secondary'}>
			Sign Out
		</Button>
	)
}
