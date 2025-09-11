export default defineEventHandler(async (event) => {
  // Add CORS headers
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (getMethod(event) === 'OPTIONS') {
    return new Response(null, { status: 200 })
  }

  try {
    // Parse request body
    let body
    try {
      body = await readBody(event)
    } catch (error) {
      const rawBody = await readRawBody(event)
      if (rawBody) {
        body = JSON.parse(rawBody.toString())
      } else {
        throw new Error('No body provided')
      }
    }

    const { username, firstName, lastName, email, phone, bio } = body

    // Validate required fields
    if (!email) {
      return {
        success: false,
        error: 'Email is required'
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    // Validate username if provided
    if (username && username.length < 3) {
      return {
        success: false,
        error: 'Username must be at least 3 characters long'
      }
    }

    // Validate phone format if provided
    if (phone && phone.length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        return {
          success: false,
          error: 'Invalid phone number format'
        }
      }
    }

    // Mock user update (in a real app, this would update the database)
    const updatedUser = {
      id: "1",
      email: email,
      username: username || "demo_user",
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      bio: bio || "",
      name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || "Demo User",
      role: "USER",
      emailVerified: true,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    }

  } catch (error: any) {
    console.error('Profile update error:', error)
    return {
      success: false,
      error: error.message || 'Failed to update profile'
    }
  }
})
