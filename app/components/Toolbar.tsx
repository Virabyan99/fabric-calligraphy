import { useCanvas } from '../context/CanvasContext'
import { fabric } from 'fabric'
import { useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function Toolbar() {
  const { toast } = useToast()

  const { clearCanvas, undo, redo, canvas } = useCanvas()
  const colorPickerRef = useRef<HTMLInputElement>(null)

  const drawRectangle = () => {
    if (canvas) {
      canvas.isDrawingMode = false
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
      })
      canvas.add(rect)
      canvas.bringToFront(rect)
    }
  }

  const drawCircle = () => {
    if (canvas) {
      canvas.isDrawingMode = false
      const circle = new fabric.Circle({
        left: 200,
        top: 150,
        radius: 50,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 2,
      })
      canvas.add(circle)
      canvas.bringToFront(circle)
    }
  }

  const drawLine = () => {
    if (canvas) {
      canvas.isDrawingMode = false
      const line = new fabric.Line([50, 50, 300, 300], {
        stroke: 'green',
        strokeWidth: 2,
      })
      canvas.add(line)
      canvas.bringToFront(line)
    }
  }

  const saveCanvas = () => {
    if (canvas) {
      canvas.isDrawingMode = false
      const json = canvas.toJSON()
      localStorage.setItem('canvasState', JSON.stringify(json))
      toast({
        title: 'Success',
        description: 'Canvas saved successfully!',
      })
    }
  }

  const loadCanvas = () => {
    if (canvas) {
      canvas.isDrawingMode = false
      const json = localStorage.getItem('canvasState')
      if (json) {
        canvas.loadFromJSON(json, () => {
          canvas.renderAll()
          toast({
            title: 'Success',
            description: 'Canvas loaded successfully!',
          })
        })
      } else {
        toast({
          title: 'Error',
          description: 'No saved canvas found!',
          variant: "destructive"
        })
      }
    }
  }

  const toggleDrawingMode = () => {
    if (canvas) {
      canvas.isDrawingMode = !canvas.isDrawingMode // Toggle the drawing mode
      if (canvas.isDrawingMode) {
        canvas.defaultCursor = 'crosshair' // Set the cursor to indicate drawing
      } else {
        canvas.defaultCursor = 'default' // Reset the cursor
      }
    }
  }
  const cancelDrawing = () => {
    if (canvas) {
      canvas.isDrawingMode = false // Disable the drawing mode
      canvas.defaultCursor = 'default' // Reset the cursor
    }
  }

  const eraseObject = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        canvas.remove(activeObject)
      }
    }
  }

  const changeColor = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject()
      const selectedColor = colorPickerRef.current?.value
      if (activeObject && selectedColor) {
        activeObject.set('fill', selectedColor)
        canvas.renderAll()
      }
    }
  }

  const resizeShape = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject()
      if (activeObject && activeObject.type === 'circle') {
        activeObject.set('radius', 100)
        canvas.renderAll()
      }
    }
  }

  return (
    <>
      {/* Left Group */}
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
          onClick={eraseObject}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Erase
        </button>
        <button
          onClick={cancelDrawing}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-gray-600">
          Cancel Drawing
        </button>
      </div>

      {/* Right Group */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
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
        <label
          htmlFor="colorPicker"
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer flex items-center justify-center">
          Change Color
        </label>
        <input
          ref={colorPickerRef}
          type="color"
          id="colorPicker"
          className="hidden"
          onChange={changeColor}
        />
        <button
          onClick={resizeShape}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Resize
        </button>
      </div>
    </>
  )
}
