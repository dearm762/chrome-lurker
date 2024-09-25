import { getServerSession } from 'next-auth'
import SignInForm from './sign-in.form'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/")
  return (
    <div className="min-h-screen bg-[#08060a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-white text-lg">Sign in to access your account</p>
      </div>
      <SignInForm />
    </div>
  )
}