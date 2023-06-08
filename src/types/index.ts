export interface Task {
    id: string
    title: string
}

export interface TasksState {
    primary: Task[],
    progress: Task[],
    completed: Task[]
}