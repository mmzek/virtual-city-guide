import { useState, Fragment } from "react";
import PropTypes from "prop-types";
import "./../App.css";

const DropArea = ({ onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <li
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setShowDrop(false);
        onDrop();
      }}
      className={
        showDrop
          ? "inline-flex h-15 cursor-grab bg-gray-100 rounded-md my-2"
          : "h-2 opacity-0"
      }
    ></li>
  );
};

DropArea.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

function Planer() {
  const [activeCard, setActiveCard] = useState(null);
  const [tasks, setTasks] = useState([
    { name: "lorem" },
    { name: "ipsum" },
    { name: "cristiano ronaldo" },
  ]);

  const onDrop = (dropIndex) => {
    if (activeCard === null) return;
    if (dropIndex === activeCard || dropIndex === activeCard + 1) return;

    const taskToMove = tasks[activeCard];
    const withoutDragged = tasks.filter((_, i) => i !== activeCard);
    const insertIndex = activeCard < dropIndex ? dropIndex - 1 : dropIndex;

    const updated = [...withoutDragged];
    updated.splice(insertIndex, 0, taskToMove);
    setTasks(updated);
    setActiveCard(null);
  };
  return (
    <div>
      <h1 className="h">Ativity plan</h1>
      <div className="flex justify-center items-center">
        <ul className="w-100 flex flex-col">
          <DropArea onDrop={() => onDrop(0)}></DropArea>
          {tasks.map((task, index) => (
            <Fragment key={index}>
              <li
                tabIndex={index}
                draggable={true}
                onDragStart={(e) => {
                  setActiveCard(index);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", `card-${index}`);
                }}
                onDragEnd={() => setActiveCard(null)}
                className="h-15 flex items-center justify-between cursor-grab border border-gray-200 shadow-lg bg-white px-4 font-sans text-gray-800 rounded-md"
              >
                {task.name}
                <img
                  className="size-4 shrink-0 h-4 w-4"
                  src="/drag-and-drop.svg"
                ></img>
              </li>
              <DropArea onDrop={() => onDrop(index + 1)}></DropArea>{" "}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default Planer;
