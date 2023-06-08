import completeImg from "../assets/complete.png";
import addNewImg from "../assets/add-new.png";
import editImg from "../assets/edit.png";
import deleteImg from "../assets/delete.png";
import { Task } from "../types";
import { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface PropTypes {
  tasks: Task[];
  updateTask: ({
    id,
    key,
    data,
  }: {
    id: string;
    key: "completed";
    data: Task;
  }) => void;
  deleteTask: (id: string, key: "completed") => void;
}

const CompletedTodoPanel = (props: PropTypes) => {
  const { tasks, updateTask, deleteTask } = props;
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<Task>();
  const UpdateInputRef = useRef<HTMLInputElement | null>(null);

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
      updateTask({ id, key: "completed", data: updateState });
      setIsUpdate(false);
    }
  };

  const handleIsUpdate = (item: Task) => {
    setIsUpdate(true);
    setUpdateState(item);
  };

  useEffect(() => {
    if (isUpdate) return UpdateInputRef.current?.focus();
  }, [isUpdate]);

  return (
    <div className="w-[26rem]">
      <div>
        <div className="flex items-center gap-2">
          <img className="w-10" src={completeImg} />
          <h1 className="text-xl font-bold text-slate-700">Complete</h1>
          <h4 className="text-xl font-bold bg-slate-200 px-2 rounded-md text-slate-600">
            {tasks.length}
          </h4>
        </div>
        <p className="text-lg mt-3 ml-2">This has been completed</p>
      </div>
      <Droppable droppableId="completed">
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
                            onClick={() => deleteTask(task.id, "completed")}
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
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default CompletedTodoPanel;
