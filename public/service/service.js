// service.js
const API_BASE_URL = 'http://localhost:3000/api/users'; // Replace with your actual API base URL

// Function to register a user
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Failed to register: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in registerUser:', error);
        throw error;
    }
};

// Function to login a user
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`Failed to login: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in loginUser:', error);
        throw error;
    }
};
