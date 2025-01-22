import { useCanvas } from '../context/CanvasContext';
import { fabric } from 'fabric';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Custom Calligraphy Brush
class CalligraphyBrush extends fabric.PencilBrush {
  _drawSegment(ctx, p1, p2) {
    const width = this.width;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = Math.max(Math.sin((p1.y + p2.y) / 2) * width, 1);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}

export default function Toolbar() {
  const { toast } = useToast();
  const { clearCanvas, undo, redo, canvas } = useCanvas();
  const [fillColor, setFillColor] = useState<string>('#ff0000');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [sprayDensity, setSprayDensity] = useState<number>(20);

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
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
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

  const updateBrushType = (type: string) => {
    if (canvas) {
      switch (type) {
        case 'Pencil':
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          break;

        case 'Spray':
          const sprayBrush = new fabric.SprayBrush(canvas);
          sprayBrush.color = strokeColor;
          sprayBrush.width = strokeWidth;
          sprayBrush.density = sprayDensity;
          canvas.freeDrawingBrush = sprayBrush;
          break;

        case 'Calligraphy':
          const calligraphyBrush = new CalligraphyBrush(canvas);
          calligraphyBrush.color = strokeColor;
          calligraphyBrush.width = strokeWidth;
          canvas.freeDrawingBrush = calligraphyBrush;
          break;

        case 'Circle':
          const circleBrush = new fabric.CircleBrush(canvas);
          circleBrush.color = strokeColor;
          circleBrush.width = strokeWidth;
          canvas.freeDrawingBrush = circleBrush;
          break;

        default:
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }

      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor;
        canvas.freeDrawingBrush.width = strokeWidth;
      }
    }
  };

  const configureBrush = (property: string, value: any) => {
    if (canvas && canvas.freeDrawingBrush) {
      (canvas.freeDrawingBrush as any)[property] = value;
      canvas.renderAll();
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
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Clear Canvas
        </button>
        <button
          onClick={undo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Undo
        </button>
        <button
          onClick={redo}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Redo
        </button>
        <button
          onClick={cancelDrawing}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Cancel Drawing
        </button>
      </div>

      {/* Right Toolbar */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-4 bg-gray-100 shadow rounded w-60"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={drawRectangle}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Rectangle
        </button>
        <button
          onClick={drawCircle}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
          Circle
        </button>
        <button
          onClick={drawLine}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
          Line
        </button>
        <button
          onClick={saveCanvas}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Save
        </button>
        <button
          onClick={loadCanvas}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Load
        </button>
        <button
          onClick={toggleDrawingMode}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Toggle Draw
        </button>

        {/* Brush Customization */}
        <label className="flex flex-col gap-2 mt-4">
          Brush Type:
          <select
            onChange={(e) => updateBrushType(e.target.value)}
            className="px-2 py-1 border rounded">
            <option value="Pencil">Pencil</option>
            <option value="Spray">Spray</option>
            <option value="Calligraphy">Calligraphy</option>
            <option value="Circle">Circle</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          Brush Color:
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => {
              setStrokeColor(e.target.value);
              configureBrush('color', e.target.value);
            }}
            className="cursor-pointer"
          />
        </label>

        <label className="flex flex-col gap-2">
          Brush Width:
          <input
            type="range"
            min="1"
            max="50"
            value={strokeWidth}
            onChange={(e) => {
              setStrokeWidth(parseInt(e.target.value, 10));
              configureBrush('width', parseInt(e.target.value, 10));
            }}
            className="cursor-pointer"
          />
        </label>

        <label className="flex flex-col gap-2">
          Spray Density:
          <input
            type="range"
            min="1"
            max="50"
            value={sprayDensity}
            onChange={(e) => {
              setSprayDensity(parseInt(e.target.value, 10));
              if (canvas?.freeDrawingBrush instanceof fabric.SprayBrush) {
                configureBrush('density', parseInt(e.target.value, 10));
              }
            }}
            className="cursor-pointer"
          />
        </label>

        <button
          onClick={changeColor}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-4">
          Change Color
        </button>
      </div>
    </>
  );
}
