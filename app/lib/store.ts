import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserInput, EvaluationResult } from './schemas'

interface AdoptionStore {
  // User inputs
  inputs: Record<string, UserInput>
  setInput: (key: string, input: UserInput) => void
  clearInputs: () => void
  
  // Evaluation results
  results: EvaluationResult | null
  setResults: (results: EvaluationResult) => void
  clearResults: () => void
  
  // UI state
  currentStep: 'landing' | 'inputs' | 'results'
  setCurrentStep: (step: 'landing' | 'inputs' | 'results') => void
}

export const useAdoptionStore = create<AdoptionStore>()(
  persist(
    (set) => ({
      // Inputs
      inputs: {},
      setInput: (key, input) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            [key]: input,
          },
        })),
      clearInputs: () => set({ inputs: {} }),
      
      // Results
      results: null,
      setResults: (results) => set({ results }),
      clearResults: () => set({ results: null }),
      
      // Navigation
      currentStep: 'landing',
      setCurrentStep: (step) => set({ currentStep: step }),
    }),
    {
      name: 'copilot-adoption-storage',
      partialize: (state) => ({
        inputs: state.inputs,
        results: state.results,
      }),
    }
  )
)
