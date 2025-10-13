import { useState, useEffect } from 'react';
import { savedPropertiesStorage, SavedProperty } from '../utils/savedProperties';
import { MortgageInputs } from '../types';

interface SavedPropertiesSectionProps {
  onLoadProperty: (inputs: MortgageInputs) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function SavedPropertiesSection({ onLoadProperty, onShowToast }: SavedPropertiesSectionProps) {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = () => {
    const properties = savedPropertiesStorage.getAll();
    setSavedProperties(properties);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this saved property?')) {
      try {
        savedPropertiesStorage.delete(id);
        loadProperties();
        onShowToast('Property deleted', 'success');
      } catch (error) {
        console.error('Failed to delete property:', error);
        onShowToast('Failed to delete property', 'error');
      }
    }
  };

  const handleLoad = (property: SavedProperty) => {
    onLoadProperty(property.inputs);
    onShowToast('Property loaded into calculator', 'success');
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (savedProperties.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Saved Properties
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Save properties from the Calculator tab to compare them later. Each saved property includes all your calculations and details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Saved Properties ({savedProperties.length})
        </h2>
        {savedProperties.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all saved properties?')) {
                savedPropertiesStorage.clear();
                loadProperties();
                onShowToast('All properties cleared', 'success');
              }
            }}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedProperties.map((property) => {
          const { inputs } = property;
          const displayTitle = inputs.propertyTitle || inputs.propertyAddress || 'Untitled Property';
          
          return (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Property Image */}
              {inputs.propertyImageUrl && (
                <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={inputs.propertyImageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Property Details */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Saved {formatDate(property.savedAt)}
                  </p>
                </div>

                {/* Key Details */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Price:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(inputs.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Down:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {inputs.downPaymentPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {inputs.aprPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Term:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {inputs.termYears} years
                    </span>
                  </div>
                </div>

                {/* Address */}
                {inputs.propertyAddress && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    📍 {inputs.propertyAddress}
                  </p>
                )}

                {/* Notes Preview */}
                {inputs.propertyNotes && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    📝 {inputs.propertyNotes}
                  </p>
                )}

                {/* Property Link */}
                {inputs.propertyLink && (
                  <a
                    href={inputs.propertyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline block truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🔗 View Listing
                  </a>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleLoad(property)}
                    className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 text-sm font-medium transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

