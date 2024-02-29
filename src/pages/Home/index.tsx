import { Play } from "phosphor-react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { 
  HomeContainer, 
  FormContainer, 
  CountdownContainer, 
  Separator, 
  TaskInput, 
  StartCountdownButton, 
  MinutesAmountInput 
} from "./style"
import { useState } from "react";


const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Dê nome ao seu projeto'),
  minutesAmount: zod.number().min(5).max(60),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycles {
  id: string
  task: string
  minutesAmount: number
}

export function Home(){
  const [cycles, setCycles] = useState<Cycles[]>([])

  const { register, handleSubmit, watch, reset} = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  function handleCreateNewCycle(data: newCycleFormData) {
    const newCycle: Cycles = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle])

    reset()
  }

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
      <FormContainer>
          <label htmlFor="">Agora vai ser foco no</label>
          <TaskInput 
            id="task" 
            type="text" 
            list="task-suggestions" 
            placeholder="nome para o projeto que irá fazer"
            {...register("task")}
          />

          <datalist id="task-suggestions">
            <option value="projeto 1" />
            <option value="projeto 2" />
            <option value="projeto 3" />
          </datalist>

          <label htmlFor="">durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder="00" 
            step={5} 
            min={5} 
            max={60}
            {...register("minutesAmount", {valueAsNumber: true})}
            />

          <span>minutos</span>
        </FormContainer>
        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Vamos começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}