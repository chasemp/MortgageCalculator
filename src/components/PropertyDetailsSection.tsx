import { useState } from 'react';
import { MortgageInputs } from '../types';

interface PropertyDetailsSectionProps {
  inputs: MortgageInputs;
  onUpdateInputs: (updates: Partial<MortgageInputs>) => void;
}

interface PropertyDetails {
  address: string;
  imageUrl: string;
}

export function PropertyDetailsSection({ inputs, onUpdateInputs }: PropertyDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleInputChange = (field: keyof MortgageInputs, value: any) => {
    onUpdateInputs({ [field]: value });
  };

  const fetchPropertyDetails = async () => {
    if (!inputs.propertyLink) {
      setFetchError('Please enter a property link first');
      return;
    }

    setIsFetching(true);
    setFetchError(null);
    setPropertyDetails(null);

    try {
      // Use a CORS proxy to fetch the page
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(inputs.propertyLink)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }

      const data = await response.json();
      const htmlText = data.contents;
      
      // Parse HTML to extract Open Graph meta tags
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      // Try to get Open Graph image and title
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
      
      // For Zillow, try to extract address from specific elements
      let address = ogTitle || '';
      
      if (inputs.propertyLink.includes('zillow.com')) {
        // Try to extract address from Zillow's title format
        const titleMatch = ogTitle?.match(/(.+?)\s*\|\s*Zillow/);
        if (titleMatch) {
          address = titleMatch[1].trim();
        }
      } else if (inputs.propertyLink.includes('realtor.com')) {
        // Extract address from Realtor.com title
        const titleMatch = ogTitle?.match(/(.+?)\s*-\s*\d/);
        if (titleMatch) {
          address = titleMatch[1].trim();
        } else if (ogTitle) {
          address = ogTitle.replace(/\s*-\s*Realtor\.com.*/, '').trim();
        }
      }

      if (ogImage && address) {
        setPropertyDetails({
          imageUrl: ogImage,
          address: address
        });
      } else {
        throw new Error('Could not extract property details from the page');
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      setFetchError('Unable to fetch property details. The site may block automated requests.');
    } finally {
      setIsFetching(false);
    }
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
            <input
              type="url"
              value={inputs.propertyLink || ''}
              onChange={(e) => {
                handleInputChange('propertyLink', e.target.value);
                // Clear property details when link changes
                setPropertyDetails(null);
                setFetchError(null);
              }}
              placeholder="https://zillow.com/homedetails/..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Paste a link from Zillow, Realtor.com, or other listing sites
            </p>
            
            {/* Fetch Details Button */}
            <button
              onClick={fetchPropertyDetails}
              disabled={isFetching || !inputs.propertyLink}
              className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {isFetching ? 'Fetching...' : 'Fetch Details'}
            </button>
            
            {/* Property Details Display */}
            {propertyDetails && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                <img 
                  src={propertyDetails.imageUrl} 
                  alt={propertyDetails.address}
                  className="w-full h-32 object-cover rounded-md mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {propertyDetails.address}
                </p>
              </div>
            )}
            
            {/* Error Message */}
            {fetchError && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-xs text-red-600 dark:text-red-400">
                  {fetchError}
                </p>
              </div>
            )}
          </div>

          {/* Manual Property Details */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Manual Entry (Optional)
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

