import { useCanvas } from "../context/CanvasContext";


export function UndoButton() {
    const { undo } = useCanvas();
    return (
      <button
        onClick={undo}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Undo
      </button>
    );
  }