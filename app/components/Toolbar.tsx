import { ClearButton, UndoButton, RedoButton } from "./ToolbarActions";

export default function Toolbar() {
  return (
    <div className="flex gap-4 p-4 bg-gray-200 rounded shadow">
      <ClearButton />
      <UndoButton />
      <RedoButton />
    </div>
  );
}
