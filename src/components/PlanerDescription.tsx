import { jsPDF } from "jspdf";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../Roboto-Regular-normal.js";

function PlanerDescription({ tasks }) {
  console.log(tasks);
  const apiKey = import.meta.env.VITE_GOOGLE_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);

  const handleClick = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const formattedTasks = tasks
      .map(
        (t, i) =>
          `${i + 1}. ${t.name}, ${t.address} (${t.amenity || "Attraction"})`,
      )
      .join("\n");

    try {
      const result = await model.generateContent(
        `Create a simple and practical one-day itinerary based on the following list of attractions in Warsaw. 
        List the attractions in the best logical visiting order (based on proximity if possible). 
        For each attraction, write from 30 to 50 words explaining what it is and why it's worth visiting. 
        Use a clear, concise, and informative tone, suitable for a travel guide.
        Do not include any formatting.
        Just plain text with an intro and the itinerary list. No conclusion.
        Here are the attractions: ${formattedTasks}`,
      );

      if (!result.response) {
        console.error("Failed to fetch", result.response);
        return null;
      }
      console.log(result.response.text());
      const text = await result.response.text();
      const doc = new jsPDF();
      doc.addFont("Roboto-Regular-normal.ttf", "Roboto", "normal");
      doc.setFont("Roboto");
      let y = 20;
      const maxWidth = 180;
      const lines: string[] = [text];
      const wrapped = doc.splitTextToSize(lines.join("\n"), maxWidth);
      doc.text(wrapped, 10, y);
      y += wrapped.length * 8 + 5;
      doc.save("activity_plan.pdf");
    } catch (err) {
      console.error("Qeury error:", err);
    }
  };
  return (
    <img
      className="absolute bottom-5 right-5 text-center text-black h-10"
      src="/file-export-icon.svg"
      onClick={handleClick}
    ></img>
  );
}
export default PlanerDescription;

PlanerDescription.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.any),
};
