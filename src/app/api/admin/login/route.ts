import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    console.log('Admin login attempt:', { username, password })

    // Validate against hardcoded credentials
    if (username === "admin" && password === "admin123") {
      console.log('Admin login successful')
      
      // Create response with success message
      const response = NextResponse.json({ 
        success: true,
        message: 'Login successful'
      })
      
      // Set admin session cookie with simpler options
      response.cookies.set('adminAuthenticated', 'true', {
        path: '/',
        maxAge: 60 * 60 // 1 hour
      })
      
      return response
    }

    console.log('Admin login failed: Invalid credentials')
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 