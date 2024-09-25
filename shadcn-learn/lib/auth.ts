import NextAuth from "next-auth"
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				// Implement a secure validation method for credentials
				if (credentials?.email === "misterfighter1990@gmail.com" && credentials?.password === "Aktau7292") {
					return { id: "1", name: "Sakenov Abdurrauf", email: "misterfighter1990@gmail.com" }
				}
				return null
			},
		}),
	],
	pages: {
		signIn: '/auth/sign-in',
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
