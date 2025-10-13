import { useState } from 'react';
import { useMortgageCalculator } from './hooks/useMortgageCalculator';
import { Header } from './components/Header';
import { PropertyDetailsSection } from './components/PropertyDetailsSection';
import { InputSection } from './components/InputSection';
import { ExtraPaymentsSection } from './components/ExtraPaymentsSection';
import { ResultsSection } from './components/ResultsSection';
import { SavedPropertiesSection } from './components/SavedPropertiesSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import Footer from './components/Footer';
import { MortgageInputs } from './types';

type ViewTab = 'calculator' | 'saved';

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

  const [activeTab, setActiveTab] = useState<ViewTab>('calculator');

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

  const handleLoadProperty = (loadedInputs: MortgageInputs) => {
    updateInputs(loadedInputs);
    setActiveTab('calculator');
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
        
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'calculator'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                🧮 Calculator
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'saved'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                💾 Saved
              </button>
            </div>
          </div>
        </div>
        
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {activeTab === 'calculator' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                <PropertyDetailsSection
                  inputs={inputs}
                  onUpdateInputs={updateInputs}
                  onShowToast={showToast}
                />
                
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
          ) : (
            <SavedPropertiesSection
              onLoadProperty={handleLoadProperty}
              onShowToast={showToast}
            />
          )}
        </main>
        
        <Footer />
        
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;