import { useCanvas } from '../context/CanvasContext';
import { fabric } from 'fabric';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Toolbar() {
  const { toast } = useToast();
  const { clearCanvas, undo, redo, canvas } = useCanvas();
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const [fillColor, setFillColor] = useState<string>('#ff0000');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);

  const drawRectangle = () => {
    if (canvas) {
      canvas.isDrawingMode = false;
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
      });
      canvas.add(rect);
      canvas.bringToFront(rect);
    }
  };

  const drawCircle = () => {
    if (canvas) {
      canvas.isDrawingMode = false;
      const circle = new fabric.Circle({
        left: 200,
        top: 150,
        radius: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
      });
      canvas.add(circle);
      canvas.bringToFront(circle);
    }
  };

  const drawLine = () => {
    if (canvas) {
      canvas.isDrawingMode = false;
      const line = new fabric.Line([50, 50, 300, 300], {
        stroke: strokeColor,
        strokeWidth,
      });
      canvas.add(line);
      canvas.bringToFront(line);
    }
  };

  const toggleDrawingMode = () => {
    if (canvas) {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      canvas.defaultCursor = canvas.isDrawingMode ? 'crosshair' : 'default';
      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = strokeColor;
        canvas.freeDrawingBrush.width = strokeWidth;
      }
    }
  };

  const cancelDrawing = () => {
    if (canvas) {
      canvas.isDrawingMode = false;
      canvas.defaultCursor = 'default';
    }
  };

  const saveCanvas = () => {
    if (canvas) {
      const json = canvas.toJSON();
      localStorage.setItem('canvasState', JSON.stringify(json));
      toast({
        title: 'Success',
        description: 'Canvas saved successfully!',
      });
    }
  };

  const loadCanvas = () => {
    if (canvas) {
      const json = localStorage.getItem('canvasState');
      if (json) {
        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
          toast({
            title: 'Success',
            description: 'Canvas loaded successfully!',
          });
        });
      } else {
        toast({
          title: 'Error',
          description: 'No saved canvas found!',
          variant: 'destructive',
        });
      }
    }
  };

  const changeColor = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set('fill', fillColor);
        activeObject.set('stroke', strokeColor);
        activeObject.set('strokeWidth', strokeWidth);
        canvas.renderAll();
      } else {
        toast({
          title: 'No Object Selected',
          description: 'Please select an object to change its color.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <>
      {/* Left Toolbar */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button onClick={clearCanvas} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Clear Canvas
        </button>
        <button onClick={undo} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Undo
        </button>
        <button onClick={redo} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Redo
        </button>
        <button onClick={cancelDrawing} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Cancel Drawing
        </button>
      </div>

      {/* Right Toolbar */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-4 bg-gray-100 shadow rounded w-60"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button onClick={drawRectangle} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Rectangle
        </button>
        <button onClick={drawCircle} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
          Circle
        </button>
        <button onClick={drawLine} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
          Line
        </button>
        <button onClick={saveCanvas} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Save
        </button>
        <button onClick={loadCanvas} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Load
        </button>
        <button onClick={toggleDrawingMode} className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Toggle Draw
        </button>

        {/* Color Pickers */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="flex items-center gap-2">
            Fill Color:
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-2">
            Stroke Color:
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-2">
            Stroke Width:
            <input
              type="range"
              min="1"
              max="50"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
              className="cursor-pointer"
            />
          </label>
        </div>

        <button onClick={changeColor} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-4">
          Change Color
        </button>
      </div>
    </>
  );
}
