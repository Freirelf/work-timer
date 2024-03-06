import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"
import { differenceInSeconds } from "date-fns"

import { 
  HomeContainer, 
  FormContainer, 
  CountdownContainer, 
  Separator, 
  TaskInput, 
  StartCountdownButton, 
  MinutesAmountInput, 
  StopCountdownButton
} from "./style"
import { useEffect, useState } from "react";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Dê nome ao seu projeto'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycles {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home(){
  const [cycles, setCycles] = useState<Cycles[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPass] = useState(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)
  
  const { register, handleSubmit, watch, reset} = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(()=> {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)
        
        if(secondsDifference >= totalSeconds) {
          setCycles(state => 
            state.map((cycle)=> {
              if(cycle.id === activeCycleId) {
                return {...cycle, finishedDate: new Date()}
              } else {
                return cycle
              }
            }),
            )

            setAmountSecondsPass(totalSeconds)
            clearInterval(interval)
        } else {
          setAmountSecondsPass(secondsDifference)
        }       
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

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
   
  const currenSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 

  const minutesAmount = Math.floor(currenSeconds / 60)
  const secondsAmount = currenSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);


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
            disabled={!!activeCycle}
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
            disabled={!!activeCycle}
            {...register("minutesAmount", {valueAsNumber: true})}
            />

          <span>minutos</span>
        </FormContainer>
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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