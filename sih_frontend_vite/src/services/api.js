const API_BASE_URL = "http://localhost:8000";

export async function registerUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
    }

    return data;
}


export async function loginUser(credentials) {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Login failed");
    }

    return data;
}


export async function getCurrentUser() {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/me`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to get user");
    }

    return data;
}