import { create } from 'zustand'

type InterviewContext = {
  company: string
  jobDescription: string
  language: string
  resume: string
  setContext: (context: Partial<InterviewContext>) => void
  clearContext: () => void
}

export const useInterviewContext = create<InterviewContext>((set) => ({
  company: '',
  jobDescription: '',
  language: 'English',
  resume: '',
  setContext: (context) => set((state) => ({ ...state, ...context })),
  clearContext: () => set({ company: '', jobDescription: '', language: 'English', resume: '' })
})) 