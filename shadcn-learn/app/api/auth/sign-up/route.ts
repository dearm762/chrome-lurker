export async function POST(req: Request) {
	const { name, email, password } = await req.json()
	console.log(name + email + password)
	// Validate the input and create a new user in your database
	// For this example, we'll just return a success message
	// Remember to hash the password before storing it in a real application

	return new Response(JSON.stringify({ message: 'User registered successfully' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	})
}
