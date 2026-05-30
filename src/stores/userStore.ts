import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User, CURSOR_COLORS } from '../types';

interface UserState {
  currentUser: User | null;
  setUser: (user: User) => void;
  createUser: (name: string, isAnonymous: boolean) => User;
  updateCursorPosition: (position: { x: number; y: number }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,

      setUser: (user) => set({ currentUser: user }),

      createUser: (name, isAnonymous) => {
        const colorIndex = Math.floor(Math.random() * CURSOR_COLORS.length);
        const user: User = {
          id: uuidv4(),
          name,
          isAnonymous,
          cursorColor: CURSOR_COLORS[colorIndex],
        };
        set({ currentUser: user });
        return user;
      },

      updateCursorPosition: (position) => {
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,
              cursorPosition: position,
            },
          });
        }
      },

      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: 'doodle-user-storage',
    }
  )
);
