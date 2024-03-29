import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../../../../context/CyclesContext";
import { useFormContext } from "react-hook-form";

export function NewCycleForm(){
  const {activeCycle} = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
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
  )
}