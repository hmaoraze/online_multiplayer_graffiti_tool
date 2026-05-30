import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Room, TemplateType, AccessType, User } from '../types';

interface RoomState {
  currentRoom: Room | null;
  participants: User[];
  isConnected: boolean;
  createRoom: (
    name: string,
    template: TemplateType,
    accessType?: AccessType,
    maxParticipants?: number
  ) => Room;
  joinRoom: (room: Room) => void;
  leaveRoom: () => void;
  setParticipants: (users: User[]) => void;
  addParticipant: (user: User) => void;
  removeParticipant: (userId: string) => void;
  setConnected: (connected: boolean) => void;
  lockRoom: () => void;
  unlockRoom: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  participants: [],
  isConnected: false,

  createRoom: (name, template, accessType = 'public', maxParticipants = 50) => {
    const room: Room = {
      id: uuidv4().slice(0, 8),
      name,
      template,
      accessType,
      isLocked: false,
      maxParticipants,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    set({ currentRoom: room });
    return room;
  },

  joinRoom: (room) => set({ currentRoom: room }),

  leaveRoom: () =>
    set({
      currentRoom: null,
      participants: [],
      isConnected: false,
    }),

  setParticipants: (users) => set({ participants: users }),

  addParticipant: (user) =>
    set((state) => ({
      participants: [...state.participants.filter((p) => p.id !== user.id), user],
    })),

  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== userId),
    })),

  setConnected: (connected) => set({ isConnected: connected }),

  lockRoom: () => {
    const { currentRoom } = get();
    if (currentRoom) {
      set({ currentRoom: { ...currentRoom, isLocked: true } });
    }
  },

  unlockRoom: () => {
    const { currentRoom } = get();
    if (currentRoom) {
      set({ currentRoom: { ...currentRoom, isLocked: false } });
    }
  },
}));
