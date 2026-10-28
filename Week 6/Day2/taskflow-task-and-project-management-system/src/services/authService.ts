import { User } from '../types';
import { generateId } from '../utils/id';
import { getInitials } from '../utils/formatters';
import { hashPassword, safeLocalStorage, KEYS } from './storage';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const users = safeLocalStorage.get<User[]>(KEYS.USERS, []);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const inputHash = await hashPassword(password);
    if (user.passwordHash !== inputHash) {
      throw new Error('Invalid email or password.');
    }

    const token = `jwt_mock_${user.id}_${Date.now()}`;
    safeLocalStorage.set(KEYS.CURRENT_USER, user);
    safeLocalStorage.set(KEYS.TOKEN, token);

    return { user, token };
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const users = safeLocalStorage.get<User[]>(KEYS.USERS, []);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: generateId('user'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatarInitials: getInitials(name),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    safeLocalStorage.set(KEYS.USERS, [...users, newUser]);

    const token = `jwt_mock_${newUser.id}_${Date.now()}`;
    safeLocalStorage.set(KEYS.CURRENT_USER, newUser);
    safeLocalStorage.set(KEYS.TOKEN, token);

    return { user: newUser, token };
  },

  getCurrentUser(): User | null {
    return safeLocalStorage.get<User | null>(KEYS.CURRENT_USER, null);
  },

  getToken(): string | null {
    return safeLocalStorage.get<string | null>(KEYS.TOKEN, null);
  },

  logout(): void {
    safeLocalStorage.remove(KEYS.CURRENT_USER);
    safeLocalStorage.remove(KEYS.TOKEN);
  },

  async updateProfile(userId: string, name: string, email: string): Promise<User> {
    const users = safeLocalStorage.get<User[]>(KEYS.USERS, []);
    const targetIndex = users.findIndex((u) => u.id === userId);
    if (targetIndex === -1) {
      throw new Error('User not found.');
    }

    // Check if new email is taken by another user
    const emailConflict = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== userId
    );
    if (emailConflict) {
      throw new Error('This email is already in use by another account.');
    }

    const updatedUser: User = {
      ...users[targetIndex],
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatarInitials: getInitials(name),
    };

    users[targetIndex] = updatedUser;
    safeLocalStorage.set(KEYS.USERS, users);
    safeLocalStorage.set(KEYS.CURRENT_USER, updatedUser);

    return updatedUser;
  },

  async changePassword(userId: string, currentPass: string, newPass: string): Promise<void> {
    const users = safeLocalStorage.get<User[]>(KEYS.USERS, []);
    const targetIndex = users.findIndex((u) => u.id === userId);
    if (targetIndex === -1) {
      throw new Error('User not found.');
    }

    const currentHash = await hashPassword(currentPass);
    if (users[targetIndex].passwordHash !== currentHash) {
      throw new Error('Current password is incorrect.');
    }

    const newHash = await hashPassword(newPass);
    users[targetIndex].passwordHash = newHash;
    safeLocalStorage.set(KEYS.USERS, users);
    safeLocalStorage.set(KEYS.CURRENT_USER, users[targetIndex]);
  },
};
