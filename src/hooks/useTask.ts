import { useState } from "react";
import { Task, TasksState } from "../types";
import { fakeTasks } from "../data";
import Swal from "sweetalert2";
import { DropResult } from "react-beautiful-dnd";

const useTask = () => {
    const [state, setState] = useState<TasksState>(fakeTasks);

    const addTask = (newTask: Task) => {
      setState({
        ...state,
        primary: [...state.primary, newTask],
      });
    };
  
    const updateTask = ({ id, key, data }: {id: string, key: keyof typeof state, data: Task}) => {
      let updateIndex = state[key].findIndex((task) => task.id === id);
      state[key][updateIndex] = data
      setState({...state})
    };
  
    const deleteTask = (deleteId: string, key: keyof typeof state) => {
      Swal.fire({
        target: "#custom-target",
        customClass: {
          container: "position-absolute",
        },
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        position: "center",
        background: "#2b2b2b",
        color: "#f1f2f6",
      }).then((result) => {
        if (result.isConfirmed) {
          const filteredTask = state[key].filter((task) => task.id !== deleteId);
          setState({
            ...state,
            [key]: [...filteredTask],
          });
  
          Swal.fire({
            text: "The Task Has been Deleted",
            icon: "success",
            timer: 2000,
            position: "center",
            background: "#2b2b2b",
            color: "#f1f2f6",
          });
        }
      });
    };
  
    const removeFromList = (taskList: Task[], index: number) => {
      const copiedTaskList = Array.from(taskList);
      const [removedItem] = copiedTaskList.splice(index, 1);
      return {removedItem, newSourceList: copiedTaskList}
    }
  
    const addToList = (taskList: Task[], index: number, newTask: Task) => {
      const copiedTaskList = Array.from(taskList);
      copiedTaskList.splice(index, 0, newTask);
      return copiedTaskList;
    }
  
    const handleOnDragEnd = (result: DropResult) => {
      if(!result.destination) return;
      const copiedState = {...state};
      const sourceList = copiedState[result.source.droppableId as keyof typeof state];
      const {removedItem, newSourceList} = removeFromList(sourceList, result.source.index);
      copiedState[result.source.droppableId as keyof typeof state] = newSourceList;
  
      const destinationList = copiedState[result.destination.droppableId as keyof typeof state];
      copiedState[result.destination.droppableId as keyof typeof state] = addToList(destinationList, result.destination.index, removedItem);
  
      setState(copiedState);
    } 

    return {
        tasks: state,
        addTask,
        updateTask,
        deleteTask,
        handleOnDragEnd
    }
}

export default useTask;