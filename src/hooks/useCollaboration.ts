import { useEffect, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useCanvasStore } from '../stores/canvasStore';
import { useRoomStore } from '../stores/roomStore';
import { useUserStore } from '../stores/userStore';
import { Stroke, User } from '../types';

export const useCollaboration = (roomId: string) => {
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const { strokes, setStrokes, addStroke: addLocalStroke } = useCanvasStore();
  const { addParticipant, removeParticipant, setConnected } = useRoomStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!roomId) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      `doodle-sign-${roomId}`,
      ydoc,
      { connect: true }
    );

    ydocRef.current = ydoc;
    providerRef.current = provider;

    const strokesArray = ydoc.getArray<Stroke>('strokes');
    const usersMap = ydoc.getMap<User>('users');

    strokesArray.observe(() => {
      const allStrokes = strokesArray.toArray();
      setStrokes(allStrokes);
    });

    provider.awareness.on('change', () => {
      const states = provider.awareness.getStates();
      const users: User[] = [];

      states.forEach((state, clientId) => {
        if (state.user) {
          users.push(state.user);
        }
      });

      users.forEach((user) => {
        addParticipant(user);
      });
    });

    provider.on('status', (event: { status: string }) => {
      setConnected(event.status === 'connected');
    });

    if (currentUser) {
      provider.awareness.setLocalStateField('user', currentUser);
    }

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomId, currentUser]);

  const addStroke = useCallback((stroke: Stroke) => {
    if (!ydocRef.current) return;

    const ydoc = ydocRef.current;
    const strokesArray = ydoc.getArray<Stroke>('strokes');

    ydoc.transact(() => {
      strokesArray.push([stroke]);
    });
  }, []);

  const updateCursorPosition = useCallback((x: number, y: number) => {
    if (!providerRef.current || !currentUser) return;

    providerRef.current.awareness.setLocalStateField('cursor', {
      x,
      y,
      user: currentUser,
    });
  }, [currentUser]);

  const clearAllStrokes = useCallback(() => {
    if (!ydocRef.current) return;

    const ydoc = ydocRef.current;
    const strokesArray = ydoc.getArray<Stroke>('strokes');

    ydoc.transact(() => {
      strokesArray.delete(0, strokesArray.length);
    });
  }, []);

  return {
    addStroke,
    updateCursorPosition,
    clearAllStrokes,
    isConnected: providerRef.current?.wsconnected ?? false,
  };
};
