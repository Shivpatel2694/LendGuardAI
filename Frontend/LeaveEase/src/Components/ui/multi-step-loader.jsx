"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

// Define the color palette to match the manager page
const colorPalette = {
  primary: "#3C7EFC",
  dark: "#404258",
  medium: "#474E68",
  light: "#6B728E",
  background: "#F5F5F9",
  white: "#FFFFFF",
};

const CheckIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
  currentStep = 0, // Accept currentStep as a prop
}) => {
  const [internalState, setInternalState] = useState(currentStep);
  
  // Use the provided currentStep or manage state internally
  const value = currentStep !== undefined ? currentStep : internalState;

  useEffect(() => {
    if (!loading) {
      setInternalState(0);
      return;
    }
    
    // Only set up the timer if we're managing the state internally
    if (currentStep === undefined) {
      const timeout = setTimeout(() => {
        setInternalState((prevState) =>
          loop
            ? prevState === loadingStates.length - 1
              ? 0
              : prevState + 1
            : Math.min(prevState + 1, loadingStates.length - 1)
        );
      }, duration);
  
      return () => clearTimeout(timeout);
    }
  }, [internalState, loading, loop, loadingStates.length, duration, currentStep]);

  if (!loading || !loadingStates || loadingStates.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8">
      <div className="flex flex-col space-y-4 max-w-sm mx-auto">
        {loadingStates.map((loadingState, index) => {
          const isActive = index === value;
          const isCompleted = index < value;
          
          return (
            <div
              key={index}
              className={cn(
                "flex items-center p-3 rounded-lg transition-all duration-300",
                isActive ? "bg-blue-50" : ""
              )}
              style={{
                borderLeft: isActive ? `3px solid ${colorPalette.primary}` : "",
                transform: isActive ? "translateX(4px)" : "",
              }}
            >
              <div className="mr-3">
                {isCompleted && (
                  <CheckFilled
                    className="text-green-500"
                    style={{ color: colorPalette.medium }}
                  />
                )}
                {isActive && (
                  <CheckFilled
                    className="text-primary"
                    style={{ color: colorPalette.primary }}
                  />
                )}
                {!isCompleted && !isActive && (
                  <CheckIcon
                    className="text-gray-400"
                    style={{ color: colorPalette.light }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "font-medium text-sm",
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-gray-700"
                    : "text-gray-500"
                )}
                style={{
                  color: isActive
                    ? colorPalette.primary
                    : isCompleted
                    ? colorPalette.dark
                    : colorPalette.medium,
                }}
              >
                {loadingState.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};