import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Offering } from '@/shared/types/offering';

interface OfferingsState {
  offerings: Offering[];

  setOfferings: (offerings: Offering[]) => void;
  addOffering: (offering: Omit<Offering, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOffering: (offering: Offering) => void;
  removeOffering: (offeringId: string) => void;
  clearOfferings: () => void;
  getOfferingById: (id: string) => Offering | undefined;
}

export const useOfferingsStore = create<OfferingsState>()(
  persist(
    (set, get) => ({
      offerings: [],

      setOfferings: (offerings) => set({ offerings }),

      addOffering: (offering) => {
        //simple unique ID generation for assesment purposes
        const now = Date.now();
        const id = `offering-${now}-${Math.random().toString(36).substring(2, 9)}`;
        const newOffering: Offering = {
          ...offering,
          id,
          createdAt: now,
          updatedAt: now,
        } as Offering;

        set((state) => ({
          offerings: [...state.offerings, newOffering],
        }));
      },

      updateOffering: (updatedOffering) =>
        set((state) => ({
          offerings: state.offerings.map((offering) =>
            offering.id === updatedOffering.id ? updatedOffering : offering,
          ),
        })),

      removeOffering: (offeringId) =>
        set((state) => ({
          offerings: state.offerings.filter((offering) => offering.id !== offeringId),
        })),

      clearOfferings: () => set({ offerings: [] }),

      getOfferingById: (id: string) => get().offerings.find((offering) => offering.id === id),
    }),
    {
      name: 'offerings-storage', // localStorage key
    },
  ),
);
