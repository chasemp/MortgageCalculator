import { useState } from 'react';
import { MortgageInputs } from '../types';

interface PropertyDetailsSectionProps {
  inputs: MortgageInputs;
  onUpdateInputs: (updates: Partial<MortgageInputs>) => void;
}

export function PropertyDetailsSection({ inputs, onUpdateInputs }: PropertyDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field: keyof MortgageInputs, value: any) => {
    onUpdateInputs({ [field]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
          Property Details
          <span className="text-sm text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        </h2>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Property Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Link (Optional)
            </label>
            {inputs.propertyLink ? (
              <div className="space-y-2">
                <a
                  href={inputs.propertyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm break-all"
                >
                  {inputs.propertyLink}
                </a>
                <button
                  onClick={() => handleInputChange('propertyLink', '')}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
                >
                  Clear link
                </button>
              </div>
            ) : (
              <>
                <input
                  type="url"
                  value={inputs.propertyLink || ''}
                  onChange={(e) => handleInputChange('propertyLink', e.target.value)}
                  placeholder="https://zillow.com/homedetails/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Paste a link from Zillow, Realtor.com, or other listing sites
                </p>
              </>
            )}
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Property Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Property Address
                </label>
                <input
                  type="text"
                  value={inputs.propertyAddress || ''}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="123 Main St, City, ST 12345"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter address manually if auto-fetch doesn't work
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Property Image URL
                </label>
                <input
                  type="url"
                  value={inputs.propertyImageUrl || ''}
                  onChange={(e) => handleInputChange('propertyImageUrl', e.target.value)}
                  placeholder="https://example.com/property-image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add a direct link to a property image
                </p>
              </div>

              {/* Manual Entry Display */}
              {(inputs.propertyAddress || inputs.propertyImageUrl) && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                  {inputs.propertyImageUrl && (
                    <img 
                      src={inputs.propertyImageUrl} 
                      alt={inputs.propertyAddress || 'Property'}
                      className="w-full h-32 object-cover rounded-md mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {inputs.propertyAddress && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {inputs.propertyAddress}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Property Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={inputs.propertyNotes || ''}
              onChange={(e) => handleInputChange('propertyNotes', e.target.value)}
              placeholder="Add any notes about this property..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Freeform notes for your reference
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

