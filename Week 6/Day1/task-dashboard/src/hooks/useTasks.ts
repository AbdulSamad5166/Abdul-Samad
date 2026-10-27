import { SEED_TASKS } from '../data/seedTasks'
import { isTaskArray, type Task } from '../types/task'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'taskflow:tasks'

// Components ko storage ki details nahi pata honi chahiye.
// Day 3 me sirf is hook ke andar ka code badlega (localStorage -> API), pages wahi rahenge.
export function useTasks() {
  const [tasks] = useLocalStorage<Task[]>(STORAGE_KEY, SEED_TASKS, isTaskArray)
  return { tasks }
}