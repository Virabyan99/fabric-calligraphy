import { useCanvas } from "../context/CanvasContext";


export function ClearButton() {
    const { clearCanvas } = useCanvas();
    return (
      <button
        onClick={clearCanvas}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Clear Canvas
      </button>
    );
  }