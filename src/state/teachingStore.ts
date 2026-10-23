import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { DryerType } from '../models/catalog'

export type LearningMode = 'guided' | 'explore'
export type KnowledgeDepth = 'basic' | 'engineering'
export type CircuitVisibility = 'air' | 'refrigerant' | 'both'
export type ViewMode = 'exterior' | 'transparent' | 'section' | 'internal' | 'exploded'
export type CameraPreset = 'perspective' | 'front' | 'side' | 'top' | 'internal'
export type LabelMode = 'key' | 'hover' | 'selected' | 'off'

export type TeachingState = {
  machine: DryerType
  mode: LearningMode
  depth: KnowledgeDepth
  circuit: CircuitVisibility
  viewMode: ViewMode
  cameraPreset: CameraPreset
  labelMode: LabelMode
  playing: boolean
  speed: 0.5 | 1 | 2
  step: number
  teachingProgress: number
  selectedComponent: string | null
  selectedProcess: string | null
  setMachine: (machine: DryerType) => void
  setMode: (mode: LearningMode) => void
  setDepth: (depth: KnowledgeDepth) => void
  setCircuit: (circuit: CircuitVisibility) => void
  setViewMode: (viewMode: ViewMode) => void
  setCameraPreset: (cameraPreset: CameraPreset) => void
  setLabelMode: (labelMode: LabelMode) => void
  togglePlaying: () => void
  setSpeed: (speed: 0.5 | 1 | 2) => void
  setStep: (step: number) => void
  advanceProgress: (delta: number) => void
  selectComponent: (component: string | null, process?: string | null) => void
  selectProcess: (process: string | null, component?: string | null) => void
  reset: () => void
}

export const defaultTeachingState = {
  machine: 'heat-pump' as DryerType,
  mode: 'guided' as LearningMode,
  depth: 'basic' as KnowledgeDepth,
  circuit: 'both' as CircuitVisibility,
  viewMode: 'transparent' as ViewMode,
  cameraPreset: 'perspective' as CameraPreset,
  labelMode: 'key' as LabelMode,
  playing: true,
  speed: 1 as const,
  step: 0,
  teachingProgress: 0,
  selectedComponent: 'condenser',
  selectedProcess: '2-3',
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

export const useTeachingStore = create<TeachingState>()(
  persist(
    (set) => ({
      ...defaultTeachingState,
      setMachine: (machine) =>
        set({ machine, selectedComponent: null, selectedProcess: null, step: 0 }),
      setMode: (mode) => set({ mode }),
      setDepth: (depth) => set({ depth }),
      setCircuit: (circuit) => set({ circuit }),
      setViewMode: (viewMode) => set({ viewMode }),
      setCameraPreset: (cameraPreset) => set({ cameraPreset }),
      setLabelMode: (labelMode) => set({ labelMode }),
      togglePlaying: () => set((state) => ({ playing: !state.playing })),
      setSpeed: (speed) => set({ speed }),
      setStep: (step) => set({ step, teachingProgress: step / 7 }),
      advanceProgress: (delta) =>
        set((state) => ({ teachingProgress: (state.teachingProgress + delta) % 1 })),
      selectComponent: (selectedComponent, selectedProcess = null) =>
        set((state) => syncSelection(state, selectedComponent, selectedProcess)),
      selectProcess: (selectedProcess, selectedComponent = null) =>
        set((state) => syncSelection(state, selectedComponent, selectedProcess)),
      reset: () => set(defaultTeachingState),
    }),
    {
      name: 'dryer3d-learning-preferences-v1',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? memoryStorage : window.localStorage,
      ),
      partialize: (state) => ({
        machine: state.machine,
        mode: state.mode,
        depth: state.depth,
        circuit: state.circuit,
        viewMode: state.viewMode,
        cameraPreset: state.cameraPreset,
        labelMode: state.labelMode,
        speed: state.speed,
        step: state.step,
      }),
    },
  ),
)

export const processComponentMap: Record<string, string> = {
  '1-2': 'compressor',
  '2-3': 'condenser',
  '3-4': 'capillary',
  '4-1': 'evaporator',
  heating: 'condenser',
  humidifying: 'drum',
  dehumidifying: 'evaporator',
}

const processStepMap: Record<string, number> = {
  '1-2': 1, '2-3': 2, '3-4': 3, '4-1': 4,
  heating: 5, humidifying: 6, dehumidifying: 7,
}

const processCircuitMap: Record<string, CircuitVisibility> = {
  '1-2': 'refrigerant', '2-3': 'both', '3-4': 'refrigerant', '4-1': 'both',
  heating: 'air', humidifying: 'air', dehumidifying: 'both',
}

function syncSelection(state: TeachingState, selectedComponent: string | null, selectedProcess: string | null) {
  if (!selectedProcess || !(selectedProcess in processStepMap)) return { selectedComponent, selectedProcess }
  const step = processStepMap[selectedProcess]
  return {
    selectedComponent,
    selectedProcess,
    step,
    circuit: processCircuitMap[selectedProcess],
    teachingProgress: step / 7,
  }
}
