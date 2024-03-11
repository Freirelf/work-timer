import { HandPalm, Play } from "phosphor-react";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/Countdown";

import * as zod from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { CyclesContext } from "../../context/CyclesContext"
import { useContext } from "react";

import { 
  HomeContainer, 
  StartCountdownButton, 
  StopCountdownButton
} from "./style"

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Dê nome ao seu projeto'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
  
  const {createNewCycle, interruptCurrentCycle, activeCycle} = useContext(CyclesContext)

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset} = newCycleForm

  function handleCreateNewCycle(data: newCycleFormData){
    createNewCycle(data)
    reset()
  }
   
  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
          <FormProvider {...newCycleForm}>
            <NewCycleForm /> 
          </FormProvider>
          <CountDown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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