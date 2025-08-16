import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Race = 'Draeven' | 'Sylven' | 'Lunari';
export type LookingFor = 'Draeven' | 'Sylven' | 'Lunari' | 'Todos';

export interface User {
  id: string;
  username: string;
  age: number;
  race: Race;
  family?: string;
  lookingFor: LookingFor;
  about: string;
  avatar?: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  isNew: boolean;
}

interface SupernaturalState {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  likedUsers: string[];
  passedUsers: string[];
  superLikes: string[];
  
  // Actions
  login: (username: string) => User | null;
  logout: () => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (userData: Omit<User, 'id' | 'createdAt'>) => User | null;
  deleteUser: (userId: string) => void;
  likeUser: (userId: string) => Match | null;
  passUser: (userId: string) => void;
  superLikeUser: (userId: string) => Match | null;
  markMatchAsRead: (matchId: string) => void;
  
  // Getters
  getAvailableUsers: () => User[];
  getMatches: () => Match[];
  getNewMatches: () => Match[];
}

export const useSupernaturalStore = create<SupernaturalState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      matches: [],
      likedUsers: [],
      passedUsers: [],
      superLikes: [],

      login: (username: string) => {
        const user = get().users.find(u => u.username === username);
        if (user) {
          set({ currentUser: user });
          return user;
        }
        return null;
      },

      logout: () => {
        set({ currentUser: null });
      },

      createUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        
        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser
        }));
        
        return newUser;
      },

      updateUser: (userData) => {
        const state = get();
        const currentUser = state.currentUser;
        
        if (!currentUser) return null;
        
        const updatedUser: User = {
          ...currentUser,
          ...userData,
        };
        
        set(prevState => ({
          users: prevState.users.map(u => 
            u.id === currentUser.id ? updatedUser : u
          ),
          currentUser: updatedUser
        }));
        
        return updatedUser;
      },

      deleteUser: (userId: string) => {
        set(state => ({
          users: state.users.filter(u => u.id !== userId),
          matches: state.matches.filter(m => m.user1Id !== userId && m.user2Id !== userId),
          currentUser: state.currentUser?.id === userId ? null : state.currentUser
        }));
      },

      likeUser: (userId: string) => {
        const state = get();
        const currentUser = state.currentUser;
        
        if (!currentUser || state.likedUsers.includes(userId)) return null;
        
        set(prevState => ({
          likedUsers: [...prevState.likedUsers, userId]
        }));
        
        // Check if the other user also liked current user
        const otherUserLikes = state.users.find(u => u.id === userId);
        const existingMatch = state.matches.find(m => 
          (m.user1Id === currentUser.id && m.user2Id === userId) ||
          (m.user1Id === userId && m.user2Id === currentUser.id)
        );
        
        if (otherUserLikes && !existingMatch) {
          // For demo purposes, simulate 50% chance of mutual like
          if (Math.random() > 0.5) {
            const match: Match = {
              id: crypto.randomUUID(),
              user1Id: currentUser.id,
              user2Id: userId,
              createdAt: new Date(),
              isNew: true
            };
            
            set(prevState => ({
              matches: [...prevState.matches, match]
            }));
            
            return match;
          }
        }
        
        return null;
      },

      passUser: (userId: string) => {
        set(state => ({
          passedUsers: [...state.passedUsers, userId]
        }));
      },

      superLikeUser: (userId: string) => {
        const state = get();
        const currentUser = state.currentUser;
        
        if (!currentUser || state.superLikes.includes(userId)) return null;
        
        set(prevState => ({
          superLikes: [...prevState.superLikes, userId]
        }));
        
        // Super like always creates a match for demo
        const match: Match = {
          id: crypto.randomUUID(),
          user1Id: currentUser.id,
          user2Id: userId,
          createdAt: new Date(),
          isNew: true
        };
        
        set(prevState => ({
          matches: [...prevState.matches, match]
        }));
        
        return match;
      },

      markMatchAsRead: (matchId: string) => {
        set(state => ({
          matches: state.matches.map(m => 
            m.id === matchId ? { ...m, isNew: false } : m
          )
        }));
      },

      getAvailableUsers: () => {
        const state = get();
        const currentUser = state.currentUser;
        
        if (!currentUser) return [];
        
        return state.users.filter(user => {
          if (user.id === currentUser.id) return false;
          if (state.likedUsers.includes(user.id)) return false;
          if (state.passedUsers.includes(user.id)) return false;
          if (state.superLikes.includes(user.id)) return false;
          
          // Filter by looking for preference
          if (currentUser.lookingFor !== 'Todos' && user.race !== currentUser.lookingFor) {
            return false;
          }
          
          return true;
        });
      },

      getMatches: () => {
        const state = get();
        return state.matches;
      },

      getNewMatches: () => {
        const state = get();
        return state.matches.filter(m => m.isNew);
      }
    }),
    {
      name: 'supernatural-store',
    }
  )
);