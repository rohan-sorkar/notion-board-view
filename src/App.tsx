import { DragDropContext } from 'react-beautiful-dnd';
import InitialTodoPanel from "./components/initialTodoPanel";
import ProgressTodoPanel from "./components/progressTodoPanel";
import CompletedTodoPanel from "./components/completedTodoPanel";
import logo from "./assets/logo.png";
import useTask from "./hooks/useTask";


const App = () => {
  const {tasks, addTask, updateTask, deleteTask, handleOnDragEnd} = useTask();

  return (
    <section className="">
      <h1 className="text-4xl font-extrabold text-slate-700 flex justify-center py-20">
        <img className="w-10 h-10" src={logo} />
        Project Manager
        <img className="w-10 h-10" src={logo} />
      </h1>
      <DragDropContext onDragEnd={handleOnDragEnd}>
      <main className="flex justify-center gap-16 px-10">
        <InitialTodoPanel
          tasks={tasks.primary}
          addTask={addTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        <ProgressTodoPanel 
          tasks={tasks.progress}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        <CompletedTodoPanel 
          tasks={tasks.completed}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      </main>
      </DragDropContext>
    </section>
  );
};

export default App;
