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
          title: 'Mortgage Calculator Results',
          text: 'Check out my mortgage calculation results',
          url
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        onShowToast('URL copied to clipboard!', 'success');
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
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mortgage Calculator
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              PWA
            </span>
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