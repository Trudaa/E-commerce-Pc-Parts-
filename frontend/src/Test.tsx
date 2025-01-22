
import { useState, useEffect } from "react";

export const Test = () => {

  const gridSize = 16;
  const colors = [
    "red", "blue", "green", "yellow",
    "orange", "purple", "pink", "black"
  ];
  
  const [shuffledColors, setShuffledColors] = useState<string[]>([]);
  const [isClicked, setIsClicked] = useState<boolean[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    handleReset()
  }, []);

  const handleReset = () => {
    setShuffledColors([...colors, ...colors].sort(() => Math.random() - 0.5));
    setIsClicked(Array(gridSize).fill(false));
  }

  const handleClick = (i: number) => {
    if (isDisabled || isClicked[i]) 
        return

    setIsClicked((prevState) =>
      prevState.map((value, index) => (index === i ? true : value))
    );

    if (selectedIndices.length === 0) {
      setSelectedIndices([i]);
    } else if (selectedIndices.length === 1) {
      const [firstIndex] = selectedIndices;
      setSelectedIndices([...selectedIndices, i]);
      
      if (shuffledColors[firstIndex] !== shuffledColors[i]) {
        setIsDisabled(true);
        setTimeout(() => {
          setIsClicked((prevState) =>
            prevState.map((value, index) => (index === firstIndex || index === i ? false : value))
          );
          setIsDisabled(false);
        }, 1000);
      }
      setSelectedIndices([]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen border">
      <div className="grid grid-cols-4 gap-1 ">
        {Array.from({ length: gridSize }, (_, i) => (
          <div
            key={i}
            className="border h-20 w-20 flex justify-center items-center cursor-pointer"
            onClick={() => handleClick(i)}
            style={{ backgroundColor: isClicked[i] ? shuffledColors[i] : "gray" }}
          >
            {isClicked[i] ? "" : "?"}
          </div>
          
        ))}
        <button onClick={handleReset} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">RESET</button>
      </div>
    </div>
  );
};

