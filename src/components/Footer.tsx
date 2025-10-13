import React from 'react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  // Get version from package.json (injected by Vite)
  const version = __APP_VERSION__;
  const buildTime = __BUILD_TIME__;
  const buildDate = __BUILD_DATE__;

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="font-medium text-gray-700 dark:text-gray-300">Version</div>
          <div className="font-mono">{version}</div>
          <div className="mt-2 text-xs">
            Build: {buildTime} ({buildDate})
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

