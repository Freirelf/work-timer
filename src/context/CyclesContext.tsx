import { ReactNode, createContext, useState } from "react";

interface CreateCycleDate {
  task: string;
  minutesAmount: number;
}

interface Cycles {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycles: Cycles[]
  activeCycle: Cycles | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (secondsPassed: number) => void
  createNewCycle: (data: CreateCycleDate) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({children}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycles[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPass] = useState(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId) 

  function setSecondsPassed(secondsPassed: number) {
    setAmountSecondsPass(secondsPassed)
  }

  function markCurrentCycleAsFinished(){
    setCycles(state => 
      state.map((cycle)=> {
        if(cycle.id === activeCycleId) {
          return {...cycle, finishedDate: new Date()}
        } else {
          return cycle
        }
      }),
    )
  }

  function createNewCycle(data: CreateCycleDate) {
    const id = String(new Date().getTime())
    const newCycle: Cycles = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPass(0);
  }

  function interruptCurrentCycle() {
    setCycles((state) =>
      state.map((cycle)=> {
        if(cycle.id === activeCycleId) {
          return {...cycle, interruptedDate: new Date()}
        } else {
          return cycle
        }
      })
    )
    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider 
    value=
      {{
        cycles,
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished, 
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}