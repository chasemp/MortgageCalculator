import { useMortgageCalculator } from './hooks/useMortgageCalculator';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header 
          theme={uiState.theme}
          onToggleTheme={toggleTheme}
          onReset={resetInputs}
          onShare={generateShareUrl}
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
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;