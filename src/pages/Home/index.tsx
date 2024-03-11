import { HandPalm, Play } from "phosphor-react";
import { 
  HomeContainer, 
  StartCountdownButton, 
  StopCountdownButton
} from "./style"
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/Countdown";

import * as zod from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface Cycles {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycles | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (secondsPassed: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Dê nome ao seu projeto'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
  const [cycles, setCycles] = useState<Cycles[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPass] = useState(0)

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  function setSecondsPassed(secondsPassed: number) {
    setAmountSecondsPass(secondsPassed)
  }

  const { handleSubmit, watch, reset} = newCycleForm

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId) 

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
  
  function handleCreateNewCycle(data: newCycleFormData) {
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
    reset()
  }

  function handleInterruptCycle() {
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
   
  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider 
          value=
            {{
              activeCycle, 
              activeCycleId, 
              markCurrentCycleAsFinished, 
              amountSecondsPassed,
              setSecondsPassed
            }}
          >
          <FormProvider {...newCycleForm}>
            <NewCycleForm /> 
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ): 
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Vamos começar
          </StartCountdownButton>
        }
      </form>
    </HomeContainer>
  )
}