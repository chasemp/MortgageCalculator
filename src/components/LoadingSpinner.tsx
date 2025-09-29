
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">Calculating...</span>
      </div>
    </div>
  );
}