import React, { useState, useRef, useEffect } from 'react';
import { File, Folder } from 'lucide-react';

export default function DragSelectDemo() {
  const [items, setItems] = useState([
    { id: 1, name: 'Document.pdf', type: 'file', x: 50, y: 50 },
    { id: 2, name: 'Photos', type: 'folder', x: 200, y: 50 },
    { id: 3, name: 'Music', type: 'folder', x: 350, y: 50 },
    { id: 4, name: 'Report.docx', type: 'file', x: 50, y: 180 },
    { id: 5, name: 'Spreadsheet.xlsx', type: 'file', x: 200, y: 180 },
    { id: 6, name: 'Videos', type: 'folder', x: 350, y: 180 },
    { id: 7, name: 'Project.zip', type: 'file', x: 50, y: 310 },
    { id: 8, name: 'Notes.txt', type: 'file', x: 200, y: 310 },
    { id: 9, name: 'Downloads', type: 'folder', x: 350, y: 310 },
  ]);
  
  const [selected, setSelected] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.closest('.selection-area')) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setStartPoint({ x, y });
      setSelectionBox({ x, y, width: 0, height: 0 });
      setIsSelecting(true);
      
      if (!e.shiftKey) {
        setSelected(new Set());
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const x = Math.min(startPoint.x, currentX);
    const y = Math.min(startPoint.y, currentY);
    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);
    
    setSelectionBox({ x, y, width, height });
    
    // Check which items intersect with selection box
    const newSelected = new Set(selected);
    items.forEach(item => {
      const itemRect = {
        left: item.x,
        top: item.y,
        right: item.x + 100,
        bottom: item.y + 100
      };
      
      const boxRect = {
        left: x,
        top: y,
        right: x + width,
        bottom: y + height
      };
      
      const intersects = !(
        boxRect.right < itemRect.left ||
        boxRect.left > itemRect.right ||
        boxRect.bottom < itemRect.top ||
        boxRect.top > itemRect.bottom
      );
      
      if (intersects) {
        newSelected.add(item.id);
      } else if (!e.shiftKey) {
        newSelected.delete(item.id);
      }
    });
    
    setSelected(newSelected);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handleItemClick = (e, itemId) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      const newSelected = new Set(selected);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      setSelected(newSelected);
    } else {
      setSelected(new Set([itemId]));
    }
  };

  useEffect(() => {
    if (isSelecting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isSelecting, startPoint, selected]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <div className="bg-white shadow-sm border-b p-3">
        <h1 className="text-xl font-semibold text-gray-800">Drag to Select Demo</h1>
        <p className="text-sm text-gray-600 mt-1">
          Drag to select multiple items • Click to select one • Ctrl+Click to toggle • Shift+Drag to add to selection
        </p>
        <p className="text-sm text-blue-600 mt-1">
          {selected.size} item{selected.size !== 1 ? 's' : ''} selected
        </p>
      </div>
      
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-default selection-area"
        onMouseDown={handleMouseDown}
      >
        {items.map(item => (
          <div
            key={item.id}
            className={`absolute w-24 h-24 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all ${
              selected.has(item.id)
                ? 'bg-blue-200 border-2 border-blue-500'
                : 'bg-white border-2 border-transparent hover:bg-gray-50'
            }`}
            style={{ left: item.x, top: item.y }}
            onClick={(e) => handleItemClick(e, item.id)}
          >
            {item.type === 'folder' ? (
              <Folder className="w-12 h-12 text-yellow-500" />
            ) : (
              <File className="w-12 h-12 text-blue-500" />
            )}
            <span className="text-xs mt-1 text-center text-gray-700 px-1 truncate w-full">
              {item.name}
            </span>
          </div>
        ))}
        
        {isSelecting && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 pointer-events-none"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height,
            }}
          />
        )}
      </div>
    </div>
  );
}