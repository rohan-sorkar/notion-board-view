import todoImg from "../assets/todo.png";
import addNewImg from "../assets/add-new.png";
import editImg from "../assets/edit.png";
import deleteImg from "../assets/delete.png";
import { Task } from "../types";
import { useEffect, useRef, useState } from "react";
import shortid from "shortid";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface PropTypes {
  tasks: Task[];
  addTask: (data: Task) => void;
  updateTask: ({
    id,
    key,
    data,
  }: {
    id: string;
    key: "primary";
    data: Task;
  }) => void;
  deleteTask: (id: string, key: "primary") => void;
}

const InitialTodoPanel = (props: PropTypes) => {
  const {tasks, addTask, updateTask, deleteTask} = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<Task>();
  const AddInputRef = useRef<HTMLInputElement | null>(null);
  const UpdateInputRef = useRef<HTMLInputElement | null>(null);

  const handleIsOpen = () => {
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAddTask = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      if (title === "") return;
      addTask({
        id: shortid.generate(),
        title: title,
      });
      setIsOpen(false);
      setTitle("");
    }
  };

  const handleUpdateTask = ({
    id,
    event,
  }: {
    id: string;
    event: React.KeyboardEvent<HTMLElement>;
  }) => {
    if (event.key === "Enter") {
      if (updateState?.title === "") return;
      if (!updateState) return;
      updateTask({ id, key: "primary", data: updateState });
      setIsUpdate(false);
    }
  };

  const handleIsUpdate = (item: Task) => {
    setIsUpdate(true);
    setUpdateState(item);
  };

  useEffect(() => {
    if (isOpen) return AddInputRef.current?.focus();
    if (isUpdate) return UpdateInputRef.current?.focus();
  }, [isOpen, isUpdate]);

  return (
    <div className="w-[26rem]">
      <div>
        <div className="flex items-center gap-2">
          <img className="w-10" src={todoImg} />
          <h1 className="text-xl font-bold text-slate-700">Todo</h1>
          <h4 className="text-xl font-bold bg-slate-200 px-2 rounded-md text-slate-600">
            {tasks.length}
          </h4>
        </div>
        <p className="text-lg mt-3 ml-2">This item hasn't been started</p>
      </div>
      <Droppable droppableId="primary">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="border p-5 shadow-md rounded-md mt-4"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="my-3">
                    {isUpdate && updateState?.id === task.id ? (
                      <div className="flex w-full items-center my-3 border">
                        <img className="w-6 ml-3 mr-3" src={addNewImg} />
                        <input
                          className="outline-none bg-slate-50 pl-3 py-2 w-full"
                          type="text"
                          ref={UpdateInputRef}
                          onChange={(e) =>
                            setUpdateState({
                              ...updateState,
                              title: e.target.value,
                            })
                          }
                          value={updateState?.title}
                          onKeyDown={(e) =>
                            handleUpdateTask({ id: task.id, event: e })
                          }
                          placeholder="Type a Name..."
                        />
                        <button
                          onClick={() => setIsUpdate(false)}
                          className="px-3 py-2 bg-red-100 font-bold text-red-500 text-center"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <div className={`${snapshot.isDragging && 'border-2 border-teal-500 shadow-md shadow-green-100'} flex justify-between px-4 bg-slate-50 py-3 capitalize rounded-lg`}>
                        <h2 className="text-lg">{task.title}</h2>
                        <div className="flex gap-6 items-center">
                          <img
                            onClick={() => handleIsUpdate(task)}
                            className="w-5 cursor-pointer"
                            src={editImg}
                          />
                          <img
                            onClick={() => deleteTask(task.id, "primary")}
                            className="w-5 cursor-pointer"
                            src={deleteImg}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}

            {isOpen && (
              <div className="flex w-full items-center mb-2 mt-4 border">
                <img className="w-6 ml-3 mr-3" src={addNewImg} />
                <input
                  className="outline-none bg-slate-50 pl-3 py-2 w-full"
                  type="text"
                  value={title}
                  onChange={handleChange}
                  ref={AddInputRef}
                  onKeyDown={handleAddTask}
                  placeholder="Type a Name..."
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 bg-red-100 font-bold text-red-500 text-center"
                >
                  X
                </button>
              </div>
            )}
            {provided.placeholder}
            <button
              onClick={handleIsOpen}
              className="hover:bg-slate-100 transition w-full pb-3 pt-1 text-lg text-left bg-slate-50 pl-10 text-slate-600 rounded-lg"
            >
              <span className="text-2xl">+</span> New
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default InitialTodoPanel;
