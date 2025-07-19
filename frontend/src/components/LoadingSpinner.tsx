import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse" | "bars" | "ring";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  variant = "default",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  if (variant === "dots") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        <div
          className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`}
          style={{ animationDelay: "0ms" }}></div>
        <div
          className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`}
          style={{ animationDelay: "150ms" }}></div>
        <div
          className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`}
          style={{ animationDelay: "300ms" }}></div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse ${className}`}></div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-blue-500 rounded-full animate-pulse`}
            style={{
              height:
                size === "sm"
                  ? "16px"
                  : size === "md"
                  ? "24px"
                  : size === "lg"
                  ? "32px"
                  : "48px",
              animationDelay: `${i * 150}ms`,
              animationDuration: "1s",
            }}></div>
        ))}
      </div>
    );
  }

  if (variant === "ring") {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
      </div>
    );
  }

  // Default modern spinner
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-100 rounded-full`}></div>
        <div
          className={`${sizeClasses[size]} border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
    </div>
  );
}

// Demo component to showcase all variants
function SpinnerDemo() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Modern Loading Spinners
          </h1>
          <p className="text-gray-600">
            Choose from different variants and sizes
          </p>
        </div>

        {/* Default Spinner */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Default Spinner</h2>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <LoadingSpinner size="sm" />
              <p className="text-sm text-gray-500 mt-2">Small</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" />
              <p className="text-sm text-gray-500 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-gray-500 mt-2">Large</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="xl" />
              <p className="text-sm text-gray-500 mt-2">Extra Large</p>
            </div>
          </div>
        </div>

        {/* Ring Spinner */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Ring Spinner</h2>
          <div className="flex items-center space-x-8">
            <LoadingSpinner variant="ring" size="sm" />
            <LoadingSpinner variant="ring" size="md" />
            <LoadingSpinner variant="ring" size="lg" />
            <LoadingSpinner variant="ring" size="xl" />
          </div>
        </div>

        {/* Dots Spinner */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Bouncing Dots</h2>
          <div className="flex items-center space-x-8">
            <LoadingSpinner variant="dots" size="sm" />
            <LoadingSpinner variant="dots" size="md" />
            <LoadingSpinner variant="dots" size="lg" />
            <LoadingSpinner variant="dots" size="xl" />
          </div>
        </div>

        {/* Bars Spinner */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Animated Bars</h2>
          <div className="flex items-center space-x-8">
            <LoadingSpinner variant="bars" size="sm" />
            <LoadingSpinner variant="bars" size="md" />
            <LoadingSpinner variant="bars" size="lg" />
            <LoadingSpinner variant="bars" size="xl" />
          </div>
        </div>

        {/* Pulse Spinner */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Pulse</h2>
          <div className="flex items-center space-x-8">
            <LoadingSpinner variant="pulse" size="sm" />
            <LoadingSpinner variant="pulse" size="md" />
            <LoadingSpinner variant="pulse" size="lg" />
            <LoadingSpinner variant="pulse" size="xl" />
          </div>
        </div>

        {/* Usage in Context */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
          <div className="space-y-4">
            {/* Button with spinner */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <LoadingSpinner
                  variant="ring"
                  size="sm"
                  className="text-white"
                />
                <span>Loading...</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <LoadingSpinner variant="dots" size="sm" />
                <span>Processing...</span>
              </button>
            </div>

            {/* Card with centered spinner */}
            <div className="border rounded-lg p-8 text-center bg-gray-50">
              <LoadingSpinner
                variant="default"
                size="lg"
                className="mx-auto mb-4"
              />
              <p className="text-gray-600">Loading your collections...</p>
            </div>

            {/* Inline with text */}
            <div className="flex items-center space-x-2">
              <LoadingSpinner variant="ring" size="sm" />
              <span className="text-gray-600">Fetching data...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SpinnerDemo };
