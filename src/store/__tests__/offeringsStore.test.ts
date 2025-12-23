import { useOfferingsStore } from '../offeringsStore';
import { mockSolarOffering, mockWindOffering } from '@/testing/offering-fixtures';
import { resetOfferingsStore, createTestSolarOffering } from './test-helpers';

describe('useOfferingsStore', () => {
  beforeEach(() => {
    resetOfferingsStore();
  });

  it('should initialize with empty offerings', () => {
    expect(useOfferingsStore.getState().offerings).toEqual([]);
  });

  it('should set offerings', () => {
    useOfferingsStore.getState().setOfferings([mockSolarOffering, mockWindOffering]);
    expect(useOfferingsStore.getState().offerings).toEqual([mockSolarOffering, mockWindOffering]);
  });

  it('should add an offering and generate id/timestamps', () => {
    const addOffering = useOfferingsStore.getState().addOffering;
    addOffering(createTestSolarOffering());
    const added = useOfferingsStore.getState().offerings[0];
    expect(added.id).toBeDefined();
    expect(added.createdAt).toBeDefined();
    expect(added.updatedAt).toBeDefined();
    expect(added.vendor).toBe('TestVendor');
    expect(added.sourceType).toBe('solar');
    expect(added.capacity).toBe(200);
  });

  it('should update an offering', () => {
    useOfferingsStore.getState().setOfferings([mockSolarOffering]);
    const updated = { ...mockSolarOffering, vendor: 'UpdatedVendor' };
    useOfferingsStore.getState().updateOffering(updated);
    expect(useOfferingsStore.getState().offerings[0].vendor).toBe('UpdatedVendor');
  });

  it('should remove an offering', () => {
    useOfferingsStore.getState().setOfferings([mockSolarOffering, mockWindOffering]);
    useOfferingsStore.getState().removeOffering(mockSolarOffering.id);
    expect(useOfferingsStore.getState().offerings).toEqual([mockWindOffering]);
  });

  it('should clear all offerings', () => {
    useOfferingsStore.getState().setOfferings([mockSolarOffering, mockWindOffering]);
    useOfferingsStore.getState().clearOfferings();
    expect(useOfferingsStore.getState().offerings).toEqual([]);
  });

  it('should get offering by id', () => {
    useOfferingsStore.getState().setOfferings([mockSolarOffering, mockWindOffering]);
    const found = useOfferingsStore.getState().getOfferingById(mockWindOffering.id);
    expect(found).toEqual(mockWindOffering);
  });
});
