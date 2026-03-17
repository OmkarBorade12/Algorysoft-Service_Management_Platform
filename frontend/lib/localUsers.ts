'use client';

const STORAGE_KEY = 'algorysoft_registered_users';

export interface LocalUser {
    id: number;
    name: string;
    email: string;
    password: string; // stored plaintext for demo (no real backend)
    role: 'customer' | 'admin';
    mobile?: string;
    city?: string;
    createdAt: string;
}

/** Return all registered users from localStorage */
export function getRegisteredUsers(): LocalUser[] {
    if (typeof window === 'undefined') return [];

    // ADDED: Initialize a default admin user on first load
    try {
        let currentUsers = localStorage.getItem(STORAGE_KEY);
        let parsedUsers = currentUsers ? JSON.parse(currentUsers) : [];
        const hasAdmin = parsedUsers.some((u: LocalUser) => u.email === 'admin@algorysoft.com');
        if (!hasAdmin) {
            parsedUsers.push({
                id: 1,
                name: 'AlgorySoft Admin',
                email: 'admin@algorysoft.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedUsers));
        }
    } catch (e) {
        console.error('Failed to seed admin', e);
    }
    
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/** Save a new user to localStorage (registration) */
export function registerUser(user: Omit<LocalUser, 'id' | 'createdAt'>): LocalUser | null {
    const users = getRegisteredUsers();
    // Check for duplicate email
    if (users.find((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
        return null; // already exists
    }
    const newUser: LocalUser = {
        ...user,
        id: Date.now(),
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return newUser;
}

/** Find a user by email + password for login validation */
export function loginUser(email: string, password: string): LocalUser | null {
    const users = getRegisteredUsers();
    return users.find(
        (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
    ) || null;
}
