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

    try {
        let currentUsers = localStorage.getItem(STORAGE_KEY);
        let parsedUsers: LocalUser[] = currentUsers ? JSON.parse(currentUsers) : [];

        // MIGRATION: Remove old admin@algorysoft.com if it still exists
        const hasOldAdmin = parsedUsers.some((u: LocalUser) => u.email === 'admin@algorysoft.com');
        if (hasOldAdmin) {
            parsedUsers = parsedUsers.filter((u: LocalUser) => u.email !== 'admin@algorysoft.com');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedUsers));
        }

        // Seed the correct admin account if not already present
        const hasAdmin = parsedUsers.some((u: LocalUser) => u.email === 'algorysoft@gmail.com');
        if (!hasAdmin) {
            parsedUsers.push({
                id: 1,
                name: 'AlgorySoft Admin',
                email: 'algorysoft@gmail.com',
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
