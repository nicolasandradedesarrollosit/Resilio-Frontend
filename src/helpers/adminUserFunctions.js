import { authGet, authPatch } from '../services/api/apiClient';


export async function getUsers(limit = 10, offset = 0) {
    try {
        const data = await authGet(`/api/admin/user?limit=${limit}&offset=${offset}`);
        return data || { users: [] };
    } catch (error) {
        throw error;
    }
}


export async function getAllUsers() {
    try {
        const data = await authGet('/api/admin/user?limit=10000&offset=0');
        return data?.users || [];
    } catch (error) {
        return [];
    }
}


export async function toggleBanUser(userId) {
    try {
        const data = await authPatch(`/api/admin/ban-user/${userId}`, {});
        return data;
    } catch (error) {
        throw error;
    }
}


export async function updateUser(userId, userData) {
    try {
        const data = await authPatch(`/api/admin/user-update/${userId}`, userData);
        return data;
    } catch (error) {
        throw error;
    }
}


export function filterUsers(users, searchTerm) {
    if (!searchTerm) return users;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(user => 
        (user.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (user.email?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (user.city?.toLowerCase() || '').includes(lowerSearchTerm)
    );
}
