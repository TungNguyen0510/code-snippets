"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";

type ResizableSplitViewProps = {
  leftComponent: ReactNode;
  rightComponent: ReactNode;
};

const ResizableSplitView: React.FC<ResizableSplitViewProps> = ({
  leftComponent,
  rightComponent,
}) => {
  const initialDividerPosition =
    Number(localStorage.getItem("dividerPosition")) || 50;
  const [dividerPosition, setDividerPosition] = useState(
    initialDividerPosition
  );
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("dividerPosition", String(dividerPosition));
  }, [dividerPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newDividerPosition =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newDividerPosition >= 20 && newDividerPosition <= 80) {
      setDividerPosition(newDividerPosition);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-full flex flex-col gap-4 lg:gap-0 lg:flex-row relative"
    >
      <div
        className="w-full lg:w-auto"
        style={{ width: isLargeScreen ? `${dividerPosition}%` : "100%" }}
      >
        {leftComponent}
      </div>
      {isLargeScreen && (
        <div
          className="hidden lg:block min-h-full cursor-col-resize relative w-2.5"
          onMouseDown={handleMouseDown}
          onTouchStart={(e) =>
            handleMouseDown(e as unknown as React.MouseEvent)
          }
        />
      )}
      <div
        className="w-full lg:w-auto"
        style={{ width: isLargeScreen ? `${100 - dividerPosition}%` : "100%" }}
      >
        {rightComponent}
      </div>
    </div>
  );
};

export default ResizableSplitView;
