import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onReset: () => void;
  onShare: () => string;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function Header({ theme, onToggleTheme, onReset, onShare, onShowToast }: HeaderProps) {
  const handleShare = async () => {
    const url = onShare();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mortgage Calculator - morty.523.life',
          text: 'Check out this mortgage calculation with all the details pre-filled',
          url
        });
        onShowToast('Shared successfully!', 'success');
      } catch (error) {
        // User cancelled share or share failed
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        onShowToast('Link copied to clipboard! Share it with others to show them your calculation.', 'success');
      } catch (error) {
        console.error('Failed to copy to clipboard');
        onShowToast('Failed to copy URL', 'error');
      }
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
      default:
        return '💻';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/morty_white_bg.png" 
              alt="Morty Logo" 
              className="h-10 w-10 rounded-md shadow-sm"
            />
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Morty
              </h1>
              <span className="text-xs px-2 py-1 bg-primary-500 text-white rounded-full font-medium">
                PWA
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
              title="Share results"
            >
              📤 Share
            </button>
            
            <button
              onClick={onReset}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
              title="Reset to defaults"
            >
              🔄 Reset
            </button>
            
            <button
              onClick={onToggleTheme}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
              title={`Current theme: ${theme}`}
            >
              {getThemeIcon()}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}