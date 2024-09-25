'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon } from "lucide-react"

export default function SignUpForm() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [error, setError] = useState("")
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		if (password !== confirmPassword) {
			setError("Passwords do not match")
			return
		}

		try {
			// Replace this with your actual API endpoint
			const response = await fetch("/api/auth/sign-up", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ name, email, password })
			})

			if (!response.ok) {
				throw new Error("Failed to create account")
			}

			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			})

			if (result?.error) {
				setError("Failed to sign in after registration")
			} else {
				router.replace("/")
			}
		} catch (err) {
			const error = err as Error
			setError(error.message || "Failed to create account")
		}
	}

	const handleGoogleSignUp = () => signIn("google", { callbackUrl: "/" })
	const handleGithubSignUp = () => signIn("github", { callbackUrl: "/dashboard" })

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Create a new account to get started</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="John Doe"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="john@example.com"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					<Button type="submit" className="w-full">Sign Up</Button>
					<div className="flex justify-between w-full">
						<Button variant="outline" asChild>
							<Link href="/auth/sign-in">Already have an account? Sign In</Link>
						</Button>
					</div>
					<div className="flex flex-col space-y-2 w-full">
						<Button variant="outline" onClick={handleGoogleSignUp} className="w-full">
							<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
								/>
							</svg>
							Sign up with Google
						</Button>
						<Button variant="outline" onClick={handleGithubSignUp} className="w-full">
							<GithubIcon className="w-5 h-5 mr-2" />
							Sign up with GitHub
						</Button>
					</div>
				</CardFooter>
			</form>
		</Card>
	)
}
