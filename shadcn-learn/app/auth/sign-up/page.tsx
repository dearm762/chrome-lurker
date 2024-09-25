import { authOptions } from '@/lib/auth'
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import SignUpForm from './sign-up.form'

export default async function SignUpPage() {
	const session = await getServerSession(authOptions)
	if (session) redirect("/")

	return (
		<div className="min-h-screen bg-[#08060a] flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md text-center mb-8">
				<h1 className="text-4xl font-bold text-white mb-2">Create an Account</h1>
				<p className="text-white text-lg">Sign up to get started</p>
			</div>
			<SignUpForm />
		</div>
	)
}