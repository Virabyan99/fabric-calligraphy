import { useCanvas } from "../context/CanvasContext";


export function RedoButton() {
    const { redo } = useCanvas();
    return (
      <button
        onClick={redo}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Redo
      </button>
    );
  }