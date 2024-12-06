// Function to register a new user
export async function registerUser(userData) {
    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            credentials: 'include',
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
            credentials: 'include',
        });
        return response
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

// Function to logout a user
export async function logoutUser(credentials) {
    try {
        const response = await fetch('http://localhost:3000/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include',
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

// Function to get a user balance from the API
export async function getUserBalance() {
    try {
        const response = await fetch('http://localhost:3000/api/users/user-info', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',  // Ensure cookies (like session) are sent along
        });

        // If the response is not okay, throw an error
        if (!response.ok) {
            throw new Error('Failed to fetch user balance');
        }

        // Parse the JSON response to extract user data
        const data = await response.json();
        return data;  // { username, balance }
    } catch (error) {
        console.error('Error during getting user balance:', error);
        throw error;  // Rethrow error to be handled by the calling function
    }
}

// Function to update the user's balance
export async function updateUserBalance(balanceData) {
    try {
        const response = await fetch('http://localhost:3000/api/users/update-user-balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(balanceData), // Include the balance data (amount to update)
            credentials: 'same-origin',  // Ensure cookies (like session) are sent along
        });

        // If the response is not okay, throw an error
        if (!response.ok) {
            throw new Error('Failed to update user balance');
        }

        // Parse the JSON response to extract the updated user data (like new balance)
        const data = await response.json();
        return data;  // The response might include the updated user info or just a success message
    } catch (error) {
        console.error('Error during updating user balance:', error);
        throw error;  // Rethrow error to be handled by the calling function
    }
}

// Function to handle game request with BetValue and GameType
export async function handleGameRequest(betValue, gameType) {
    try {
        const response = await fetch('http://localhost:3000/api/games/handle-game-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ betValue, gameType }), // Send BetValue and GameType in the body
            credentials: 'same-origin',  // Ensure cookies are sent along
        });

        if (!response.ok) {
            throw new Error('Failed to process game request');
        }

        // Parse the JSON response from the server
        const data = await response.json();
        return data;  // This could be the result of the game or a success message
    } catch (error) {
        console.error('Error handling game request:', error);
        throw error;  // Rethrow error to be handled by the calling function
    }
}

