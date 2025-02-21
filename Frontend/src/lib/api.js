const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerUser(data) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
}

export async function loginUser(data) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
}

export async function getLoans(token) {
    const response = await fetch(`${API_BASE_URL}/loan`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch loans");
    return await response.json();
}

export async function createLoan(data, token) {
    const response = await fetch(`${API_BASE_URL}/loan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create loan");
    return await response.json();
}

export async function approveLoan(loanId, token) {
    const response = await fetch(`${API_BASE_URL}/loan/${loanId}/approve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to approve loan");
    return await response.json();
}

export async function rejectLoan(loanId, token) {
    const response = await fetch(`${API_BASE_URL}/loan/${loanId}/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to reject loan");
    return await response.json();
}
