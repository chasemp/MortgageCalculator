import { MortgageInputs } from '../types';

export interface SavedProperty {
  id: string;
  savedAt: string; // ISO date string
  inputs: MortgageInputs;
}

const STORAGE_KEY = 'morty_saved_properties';

export const savedPropertiesStorage = {
  getAll(): SavedProperty[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as SavedProperty[];
    } catch (error) {
      console.error('Error reading saved properties:', error);
      return [];
    }
  },

  save(inputs: MortgageInputs): SavedProperty {
    const properties = this.getAll();
    const newProperty: SavedProperty = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
      inputs: { ...inputs }
    };
    
    properties.unshift(newProperty); // Add to beginning
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
      return newProperty;
    } catch (error) {
      console.error('Error saving property:', error);
      throw new Error('Failed to save property');
    }
  },

  delete(id: string): void {
    const properties = this.getAll();
    const filtered = properties.filter(p => p.id !== id);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw new Error('Failed to delete property');
    }
  },

  update(id: string, inputs: MortgageInputs): void {
    const properties = this.getAll();
    const index = properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    properties[index] = {
      ...properties[index],
      inputs: { ...inputs }
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (error) {
      console.error('Error updating property:', error);
      throw new Error('Failed to update property');
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved properties:', error);
      throw new Error('Failed to clear properties');
    }
  }
};

