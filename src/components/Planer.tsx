import { useState, Fragment, useEffect } from "react";
import { jsPDF } from "jspdf";
import PropTypes from "prop-types";
import { AttractionsData } from "./../App.tsx";
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
          : "h-6 opacity-0"
      }
    ></li>
  );
};

DropArea.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

type Attraction = {
  name: string;
  amenity: string;
  address: string;
};

function Planer({
  attractions,
  addToPlaner,
}: {
  attractions: AttractionsData | null;
  addToPlaner: number | null;
}) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Attraction[]>([]);
  const [deleteTask, setDeleteTask] = useState<number | null>(null);

  useEffect(() => {
    if (addToPlaner != null && attractions) {
      setTasks((prevTasks) => {
        const alreadyAdded = prevTasks.some((task) => {
          task.name === attractions[addToPlaner].name &&
            task.amenity === attractions[addToPlaner].amenity &&
            task.address === attractions[addToPlaner].address;
        });
        if (alreadyAdded) return prevTasks;
        return [...prevTasks, attractions[addToPlaner]];
      });
      console.log(`addToPlaner: ${addToPlaner}`);
    }
  }, [addToPlaner, attractions]);

  useEffect(() => {
    if (deleteTask != null) {
      setTasks((prevTasks) =>
        prevTasks.filter((_, index) => index !== deleteTask),
      );
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

  function generatePDF(tasks) {
    const doc = new jsPDF();
    let y = 20;
    const maxWidth = 180;

    tasks.forEach((task, index) => {
      const lines: string[] = [];
      lines.push(`${index + 1}. ${task.name || "Brak nazwy"}`);
      if (task.amenity) {
        lines.push(`Amenity: ${task.amenity}`);
      }
      if (task.address) {
        lines.push(`Address: ${task.address}`);
      }
      const text = lines.join("\n");
      const wrapped = doc.splitTextToSize(text, maxWidth);
      doc.text(wrapped, 10, y);
      y += wrapped.length * 8 + 5;
    });

    doc.save("activity_plan.pdf");
  }

  return (
    <div className="h-full">
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
                  <div className="flex items-center justify-between font-sans font-bold">
                    {task.name}{" "}
                    <img
                      className="h-5 w-5 pt-1 cursor-default"
                      src="/bin-icon.svg"
                      onClick={() => setDeleteTask(index)}
                    ></img>
                  </div>
                  <div className="flex items-center justify-between">
                    {task.amenity}
                    <br />
                    {task.address}
                    <img className="h-4 w-4" src="/drag-and-drop.svg"></img>
                  </div>
                </li>
                <DropArea onDrop={() => onDrop(index + 1)}></DropArea>{" "}
              </Fragment>
            ))}
          </ul>
        )}
      </div>
      <img
        className="absolute bottom-5 right-5 text-center text-black h-10"
        src="/file-export-icon.svg"
        onClick={() => generatePDF(tasks)}
      ></img>
    </div>
  );
}

Planer.propTypes = {
  attractions: PropTypes.arrayOf(PropTypes.any),
  attractionIndex: PropTypes.number,
  addToPlaner: PropTypes.number,
};

export default Planer;
