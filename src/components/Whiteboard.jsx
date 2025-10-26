"use client";

import { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Line,
  Rect,
  Circle,
  Text,
  Transformer,
} from "react-konva";
import io from "socket.io-client";
import {
  FaPaintBrush,
  FaSquare,
  FaCircle,
  FaSlash,
  FaTextHeight,
  FaEraser,
  FaMousePointer,
  FaUndo,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

export default function Whiteboard() {
  const stageRef = useRef(null);
  const trRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(3);
  const [fontSize, setFontSize] = useState(20);
  const [textAlign, setTextAlign] = useState("left");
  const socketRef = useRef(null);
  const [currentShape, setCurrentShape] = useState(null);

  // Connect to backend
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
    socketRef.current = socket;

    socket.on("init", (data) => setShapes(data || []));
    socket.on("draw", (shape) => setShapes((prev) => [...prev, shape]));
    socket.on("clear", () => setShapes([]));
    socket.on("undo", () => setShapes((prev) => prev.slice(0, -1)));
    socket.on("update", (updatedShape) => {
      setShapes((prev) =>
        prev.map((s) => (s.id === updatedShape.id ? updatedShape : s))
      );
    });

    return () => socket.disconnect();
  }, []);

  const getPos = (e) => e.target.getStage().getPointerPosition();

  const handleMouseDown = (e) => {
    const pos = getPos(e);
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) setSelectedId(null);
    if (tool === "select") return;

    setIsDrawing(true);
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let newShape;

    if (tool === "brush" || tool === "eraser") {
      newShape = {
        id,
        type: "line",
        points: [pos.x, pos.y],
        stroke: tool === "eraser" ? "white" : color,
        strokeWidth: brushSize,
        fill: null,
        globalCompositeOperation:
          tool === "eraser" ? "destination-out" : "source-over",
      };
    } else if (tool === "rect") {
      newShape = {
        id,
        type: "rect",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: color,
        strokeWidth: brushSize,
        fill: fillColor,
        draggable: true,
      };
    } else if (tool === "circle") {
      newShape = {
        id,
        type: "circle",
        x: pos.x,
        y: pos.y,
        radius: 0,
        stroke: color,
        strokeWidth: brushSize,
        fill: fillColor,
        draggable: true,
      };
    } else if (tool === "line") {
      newShape = {
        id,
        type: "straight",
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: color,
        strokeWidth: brushSize,
        draggable: true,
      };
    } else if (tool === "text") {
      const textValue = prompt("Enter text:");
      if (textValue) {
        newShape = {
          id,
          type: "text",
          text: textValue,
          x: pos.x,
          y: pos.y,
          fontSize,
          align: textAlign,
          fill: color,
          draggable: true,
        };
      }
    }

    if (newShape) {
      setCurrentShape(newShape);
      setShapes((prev) => [...prev, newShape]);
      socketRef.current.emit("draw", newShape);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !currentShape) return;
    const pos = getPos(e);
    const updated = { ...currentShape };

    if (tool === "brush" || tool === "eraser") {
      updated.points = updated.points.concat([pos.x, pos.y]);
    } else if (tool === "rect") {
      updated.width = pos.x - updated.x;
      updated.height = pos.y - updated.y;
    } else if (tool === "circle") {
      updated.radius = Math.sqrt(
        Math.pow(pos.x - updated.x, 2) + Math.pow(pos.y - updated.y, 2)
      );
    } else if (tool === "line") {
      updated.points = [updated.points[0], updated.points[1], pos.x, pos.y];
    }

    const newShapes = [...shapes.slice(0, -1), updated];
    setShapes(newShapes);
    setCurrentShape(updated);
    socketRef.current.emit("draw", updated);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleClear = () => {
    socketRef.current.emit("clear");
    setShapes([]);
  };

  const handleUndo = () => {
    socketRef.current.emit("undo");
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = uri;
    link.click();
  };

  const handleShapeChange = (id, newAttrs) => {
    const updated = shapes.map((shape) =>
      shape.id === id ? { ...shape, ...newAttrs } : shape
    );
    setShapes(updated);
    socketRef.current.emit("update", { id, ...newAttrs });
  };

  useEffect(() => {
    const stage = stageRef.current;
    const tr = trRef.current;
    if (tr && selectedId) {
      const selectedNode = stage.findOne(`#${selectedId}`);
      if (selectedNode) {
        tr.nodes([selectedNode]);
        tr.getLayer().batchDraw();
      }
    }
  }, [selectedId, shapes]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white shadow-md border-b border-gray-300">
        {/* Tools */}
        <div className="flex items-center gap-2">
          <button onClick={() => setTool("brush")} title="Brush">
            <FaPaintBrush />
          </button>
          <button onClick={() => setTool("rect")} title="Rectangle">
            <FaSquare />
          </button>
          <button onClick={() => setTool("circle")} title="Circle">
            <FaCircle />
          </button>
          <button onClick={() => setTool("line")} title="Line">
            <FaSlash />
          </button>
          <button onClick={() => setTool("text")} title="Text">
            <FaTextHeight />
          </button>
          <button onClick={() => setTool("eraser")} title="Eraser">
            <FaEraser />
          </button>
          <button onClick={() => setTool("select")} title="Select / Move">
            <FaMousePointer />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2">
          <label>Stroke:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          {["rect", "circle"].includes(tool) && (
            <>
              <label>Fill:</label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <label>Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </div>

        {/* Text options */}
        {tool === "text" && (
          <div className="flex items-center gap-2">
            <label>Font:</label>
            <input
              type="number"
              min="10"
              max="100"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
            <label>Align:</label>
            <select
              value={textAlign}
              onChange={(e) => setTextAlign(e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={handleUndo}>
            <FaUndo /> Undo
          </button>
          <button onClick={handleClear}>
            <FaTrash /> Clear
          </button>
          <button onClick={handleExport}>
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Canvas */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 80}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        className="bg-white border-t border-gray-300"
      >
        <Layer>
          {shapes.map((shape) => {
            const commonProps = {
              id: shape.id,
              draggable: tool === "select",
              onClick: () => setSelectedId(shape.id),
              onTap: () => setSelectedId(shape.id),
              onDragEnd: (e) =>
                handleShapeChange(shape.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                }),
              onTransformEnd: (e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                handleShapeChange(shape.id, {
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * scaleX,
                  height: node.height() * scaleY,
                });
              },
            };

            if (shape.type === "line" || shape.type === "straight") {
              return (
                <Line
                  key={shape.id}
                  points={shape.points}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={shape.globalCompositeOperation}
                  {...commonProps}
                />
              );
            } else if (shape.type === "rect") {
              return (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  fill={shape.fill}
                  {...commonProps}
                />
              );
            } else if (shape.type === "circle") {
              return (
                <Circle
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  fill={shape.fill}
                  {...commonProps}
                />
              );
            } else if (shape.type === "text") {
              return (
                <Text
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  text={shape.text}
                  fontSize={shape.fontSize}
                  align={shape.align}
                  fill={shape.fill || shape.stroke}
                  {...commonProps}
                />
              );
            }

            return null;
          })}

          <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </div>
  );
}
