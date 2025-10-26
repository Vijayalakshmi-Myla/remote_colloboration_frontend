"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import io from "socket.io-client";
import {
  fetchLists,
  createList,
  deleteList,
  updateList,
} from "@/lib/api/listApi";
import { updateTask } from "@/lib/api/tasksApi";
import ListColumn from "./ListColumn";
import ListForm from "./ListForm";
import ChatPanel from "./ChatPanel";

export default function Board({ boardId }) {
  const [lists, setLists] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      auth: { token: localStorage.getItem("token") },
      withCredentials: true,
    });
    setSocket(s);
    console.log("Connecting to:", process.env.NEXT_PUBLIC_BACKEND_URL);

    async function load() {
      const data = await fetchLists(boardId);
      setLists(data);
    }
    load();

    s.on("connect", () => {
      console.log("Socket connected with id:", s.id);
      s.emit("joinBoard", boardId);
    });

    s.on("listCreated", (list) => {
      setLists((prev) => [...prev, { ...list, tasks: [] }]);
    });
    s.on("listUpdated", (list) => {
      setLists((prev) =>
        prev.map((l) =>
          l._id === list._id
            ? { ...l, name: list.name, position: list.position }
            : l
        )
      );
    });
    s.on("listDeleted", ({ listId }) => {
      setLists((prev) => prev.filter((l) => l._id !== listId));
    });

    s.on("taskCreated", (task) => {
      const taskListId = task.list?._id || task.list?.toString?.() || task.list;
      setLists((prev) =>
        prev.map((l) => {
          if (l._id === taskListId.toString()) {
            return {
              ...l,
              tasks: [
                ...l.tasks,
                {
                  ...task,
                  assignedTo: task.assignedTo || "Unassigned",
                  status: task.status || "todo",
                },
              ],
            };
          }
          return l;
        })
      );
    });

    s.on("taskUpdated", (task) => {
      setLists((prev) =>
        prev.map((l) => {
          const filteredTasks = l.tasks.filter((t) => t._id !== task._id);
          if (l._id === task.list.toString()) {
            return { ...l, tasks: [...filteredTasks, task] };
          }
          return { ...l, tasks: filteredTasks };
        })
      );
    });

    s.on("taskDeleted", ({ taskId }) => {
      setLists((prev) =>
        prev.map((l) => ({
          ...l,
          tasks: l.tasks.filter((t) => t._id !== taskId),
        }))
      );
    });

    return () => {
      s.emit("leaveBoard", boardId);
      s.disconnect(); 
    };
  }, [boardId]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    if (type === "LIST") {
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);
      setLists(newLists);

      newLists.forEach((l, idx) => {
        updateList(l._id, { position: idx }).catch((err) => {
          console.error("Failed updating list pos", err);
        });
      });
      return;
    }

    const srcListId = source.droppableId;
    const destListId = destination.droppableId;

    if (srcListId === destListId) {
      const list = lists.find((l) => l._id === srcListId);
      const newTasks = Array.from(list.tasks);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);

      const newLists = lists.map((l) => {
        if (l._id === srcListId) {
          return { ...l, tasks: newTasks };
        }
        return l;
      });
      setLists(newLists);

      newTasks.forEach((task, idx) => {
        updateTask(task._id, { position: idx }).catch((err) => {
          console.error("Failed update task pos", err);
        });
      });
    } else {
      const srcList = lists.find((l) => l._id === srcListId);
      const destList = lists.find((l) => l._id === destListId);
      const srcTasks = Array.from(srcList.tasks);
      const destTasks = Array.from(destList.tasks);

      const [moved] = srcTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, moved);

      const newLists = lists.map((l) => {
        if (l._id === srcListId) {
          return { ...l, tasks: srcTasks };
        }
        if (l._id === destListId) {
          return { ...l, tasks: destTasks };
        }
        return l;
      });
      setLists(newLists);

      updateTask(moved._id, {
        list: destListId,
        position: destination.index,
      }).catch((err) => console.error(err));

      srcTasks.forEach((t, idx) => {
        updateTask(t._id, { position: idx }).catch((err) => console.error(err));
      });
      destTasks.forEach((t, idx) => {
        updateTask(t._id, { position: idx }).catch((err) => console.error(err));
      });
    }
  };

  const handleAddList = async (name) => {
    try {
      const newList = await createList(boardId, name);
      setLists((prev) => [...prev, { ...newList, tasks: [] }]);
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      setLists((prev) => prev.filter((list) => list._id !== listId));
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn("List already deleted, skipping...");
        setLists((prev) => prev.filter((list) => list._id !== listId)); 
        return;
      }
      console.error("Error deleting list:", err);
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
    
      <div className="mb-4">
        <ListForm onSubmit={handleAddList} placeholder="New list name" />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board-droppable"
          type="LIST"
          direction="horizontal"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <div
              className="flex space-x-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list, idx) => (
                <Draggable key={list._id} draggableId={list._id} index={idx}>
                  {(prov) => (
                    <div
                      {...prov.draggableProps}
                      ref={prov.innerRef}
                      className="bg-gray-100 rounded shadow w-64 flex-shrink-0"
                    >
                      <ListColumn
                        list={list}
                        dragHandleProps={prov.dragHandleProps}
                        onDelete={() => handleDeleteList(list._id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div>
        <ChatPanel/>
      </div>
    </div>
  );
}

