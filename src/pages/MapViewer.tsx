import React, { useRef, useState } from "react";
import { ZoomIn, ZoomOut, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import mapImage from "@assets/image_1768620260169.png";

export function MapViewer() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between bg-card p-4 rounded-t-lg border border-border/50 shadow-sm shrink-0">
        <h2 className="text-xl font-bold font-mono tracking-tight text-primary uppercase">
          Speed Limit Map Reference
        </h2>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        className="flex-1 overflow-hidden border-x border-b border-border/50 bg-black relative cursor-move group"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
            <div className="bg-black/50 px-3 py-1 rounded text-xs text-white backdrop-blur flex items-center gap-2">
                <Move className="h-3 w-3" /> DRAG TO PAN
            </div>
        </div>

        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
            transformOrigin: "center",
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={mapImage}
            alt="City Map"
            className="max-w-none w-full h-full object-contain"
            draggable={false}
          />
        </div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
    </div>
  );
}
