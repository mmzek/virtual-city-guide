import { useState, Fragment, useEffect, useRef} from "react";
import { jsPDF } from "jspdf";
import PropTypes from "prop-types";
import "./../App.css";
import { AttractionsData, useAppContext } from "../AppContext.tsx";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../lib/Roboto-Regular-normal.js";

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

function Planer({
}) {
  const {addToPlaner, attractions, tasks, setTasks} = useAppContext()
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [deleteTask, setDeleteTask] = useState<number | null>(null);
  const loadingBarRef = useRef<LoadingBarRef>(null);
    //@ts-ignore
  const apiKey = import.meta.env.VITE_GOOGLE_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);

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
const getAIResponse = async (tasks) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const places = tasks.map((t, i) => `${i + 1}. ${t.name} ${t.address ? `(${t.address})` : ""}`).join("\n");
  const prompt = `
   You are a travel guide. Write a short tour plan for the following places. No introduction or ending.  
For each place, give a plain text description (max 80 words) explaining why it is worth visiting and suggest the order of visiting.  
Do not use formatting, only sentences.  

Places:
${places}
  `;
console.log(prompt)
  try {
    const result = await model.generateContent(prompt);
    console.log(result)
    if (!result.response) {
      console.error("Failed to fetch", result.response);
      return null;
    }
    return result.response.text(); 
  } catch (err) {
    console.error("Query error:", err);
    return null;
  }
};

async function generatePDF(tasks) {
  loadingBarRef.current?.continuousStart();
  const aiText = await getAIResponse(tasks);
  console.log(aiText)
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(14);
  doc.setFont("Roboto-Regular");
  const maxWidth = 180;
  doc.text("Your Tour Plan", 10, y);
  y+=20;
  if (aiText) {
    const wrappedAI = doc.splitTextToSize(aiText, maxWidth);
    doc.text(wrappedAI, 10, y);
    y += wrappedAI.length * 8 + 5;
  }
  doc.save("activity_plan.pdf");
  loadingBarRef.current?.complete();
}

  return (
    <div className="h-full">
       <LoadingBar color="pink" height={4} ref={loadingBarRef} />
      <img
        className="absolute z-[1000] h-15 ml-auto right-0 pt-7 px-20"
        src="/file-export-icon.svg"
        onClick={() => generatePDF(tasks)}
      ></img>
      <h1 className="w-full pt-5 inline-block text-center font-sans text-4xl text-(--color-light-pink) font-bold">Activity plan</h1>
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
    </div>
  );
}

export default Planer;
