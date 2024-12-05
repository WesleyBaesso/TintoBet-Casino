// Function to register a new user
export async function registerUser(userData) {
    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
}

// Function to log in a user
export async function loginUser(credentials) {
    try {
        const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return response
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}


// Function to fetch the URL for the game page
export async function fetchPage(pageName) {
    try {
        // Make an API call or fetch the game page route from the server
        const response = await fetch(`/${pageName}`);
        
        if (!response.ok) {
            throw new Error('Page not found');
        }

        // Assuming the server returns the game page URL
        return response.url;
    } catch (error) {
        console.error('Error fetching game page:', error);
        throw error;
    }
}
