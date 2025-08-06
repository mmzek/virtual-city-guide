import { useState, Fragment, useEffect } from "react";
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
          ? "inline-flex h-30 cursor-grab bg-gray-100 rounded-md my-2"
          : "h-2 opacity-0"
      }
    ></li>
  );
};

DropArea.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

function Planer({ attractions, addToPlaner }) {
  const [activeCard, setActiveCard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deleteTask, setDeleteTask]=useState(null);
  const array = [];

  useEffect(() => {
    if (addToPlaner != null) {
      setTasks((prevTasks) => {
        const alreadyAdded = prevTasks.some(
          (task) => {task.name === attractions[addToPlaner].name, task.amenity ===attractions[addToPlaner].amenity, task.address ===attractions[addToPlaner].address}
        );
        if (alreadyAdded) return prevTasks;
        return [...prevTasks, attractions[addToPlaner]];
      });
      console.log(`addToPlaner: ${addToPlaner}`);
      console.log(`added attraction: ${attractions[addToPlaner].name}`);
    }
  }, [addToPlaner, attractions]);

useEffect(() => {
  if (deleteTask != null) {
    setTasks((prevTasks) => prevTasks.filter((_, index) => index !== deleteTask));
    setDeleteTask(null); 
  }
}, [deleteTask]);

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
        {attractions !== null && (
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
                  className="h-30 cursor-grab border border-gray-200 shadow-lg bg-white px-4 font-sans text-gray-800 rounded-md"
                >
                <div className="flex items-center justify-between font-sans font-bold">{task.name} <img
                    className="h-5 w-5 pt-1 cursor-default"
                    src="/bin-icon.svg"
                    onClick={()=>setDeleteTask(index)}
                  ></img>
                  </div>
                  <div className="flex items-center justify-between">{task.amenity}<br/>{task.address}
                  <img
                    className="h-4 w-4"
                    src="/drag-and-drop.svg"
                  ></img></div>
                </li>
                <DropArea onDrop={() => onDrop(index + 1)}></DropArea>{" "}
              </Fragment>
            ))}
          </ul>
        )}
      </div>
      <div></div>
    </div>
  );
}

Planer.propTypes = {
  attractions: PropTypes.arrayOf(PropTypes.any).isRequired,
  attractionIndex: PropTypes.number,
  addToPlaner: PropTypes.number,
};

export default Planer;
