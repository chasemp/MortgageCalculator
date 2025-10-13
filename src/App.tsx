import { useState } from 'react';
import { useMortgageCalculator } from './hooks/useMortgageCalculator';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ExtraPaymentsSection } from './components/ExtraPaymentsSection';
import { ResultsSection } from './components/ResultsSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';

function App() {
  const {
    inputs,
    uiState,
    results,
    updateInputs,
    updateUIState,
    resetInputs,
    generateShareUrl,
    toggleTheme
  } = useMortgageCalculator();

  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header 
          theme={uiState.theme}
          onToggleTheme={toggleTheme}
          onReset={resetInputs}
          onShare={generateShareUrl}
          onShowToast={showToast}
        />
        
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <InputSection
                inputs={inputs}
                onUpdateInputs={updateInputs}
                activeSection={uiState.activeSection}
                onSetActiveSection={(section) => updateUIState({ activeSection: section as any })}
              />
              
              <ExtraPaymentsSection
                inputs={inputs}
                onUpdateInputs={updateInputs}
                activeSection={uiState.activeSection}
                onSetActiveSection={(section) => updateUIState({ activeSection: section as any })}
              />
            </div>
            
            {/* Results Section */}
            <div className="space-y-6">
              {uiState.isCalculating && <LoadingSpinner />}
              
              {results && (
                <ResultsSection
                  results={results}
                  inputs={inputs}
                  activeSection={uiState.activeSection}
                  onSetActiveSection={(section) => updateUIState({ activeSection: section as any })}
                  onUpdateInputs={updateInputs}
                />
              )}
              
              {/* Show ExtraPaymentsSection in results area when extras tab is active */}
              {uiState.activeSection === 'extras' && (
                <div className="lg:hidden">
                  <ExtraPaymentsSection
                    inputs={inputs}
                    onUpdateInputs={updateInputs}
                    activeSection={uiState.activeSection}
                    onSetActiveSection={(section) => updateUIState({ activeSection: section as any })}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
        
        
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;