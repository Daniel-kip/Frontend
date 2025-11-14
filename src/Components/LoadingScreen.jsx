import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // This loading screen appears immediately when the app starts
    // Simulate initial app loading process
    const loadApp = async () => {
      try {
        // Simulate minimum loading time (20 seconds)
        await new Promise(resolve => setTimeout(resolve, 60000));
        
        // Set loading to false to trigger fade out
        setIsLoading(false);
        
        // Wait for fade out animation to complete, then navigate
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 600); // Match the transition duration
      } catch (error) {
        console.error("Loading error:", error);
        // Even if there's an error, still navigate after a bit
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => navigate("/", { replace: true }), 600);
        }, 60000);
      }
    };

    loadApp();
  }, [navigate]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease-in-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f0f1f",
        color: "#f5f5f5",
        fontFamily: "Segoe UI, sans-serif",
        zIndex: 9999, // Highest z-index to ensure it's on top of everything
        overflow: "hidden",
      }}
    >
      {/* Animated Rotating Circle */}
      <div
        style={{
          position: "relative",
          width: "80px",
          height: "80px",
          marginBottom: "24px",
        }}
      >
        {/* Outer rotating ring */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            border: "3px solid transparent",
            borderTop: "3px solid #e46033",
            borderRight: "3px solid #e46033",
            borderRadius: "50%",
            animation: "spin 1.5s linear infinite",
          }}
        />
        
        {/* Middle ring */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "60px",
            height: "60px",
            border: "2px solid transparent",
            borderBottom: "2px solid #4e8cff",
            borderLeft: "2px solid #4e8cff",
            borderRadius: "50%",
            animation: "spinReverse 1s linear infinite",
          }}
        />
        
        {/* Inner ring */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "40px",
            height: "40px",
            border: "2px solid transparent",
            borderTop: "2px solid #00d4aa",
            borderRight: "2px solid #00d4aa",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        
        {/* Pulsing center dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "8px",
            height: "8px",
            backgroundColor: "#e46033",
            borderRadius: "50%",
            animation: "dotPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Loading text */}
      <div
        style={{
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "8px",
            display: "block",
            color: "#f5f5f5",
          }}
        >
          {isLoading ? "Loading Application" : "Ready!"}
        </span>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#e46033",
                borderRadius: "50%",
                animation: `bounce 1.4s ease-in-out ${dot * 0.16}s infinite`,
                opacity: isLoading ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading status message */}
      <div
        style={{
          fontSize: "12px",
          color: "#888",
          textAlign: "center",
          maxWidth: "300px",
          lineHeight: "1.4",
          marginTop: "16px",
          opacity: isLoading ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        Initializing application components...
      </div>

      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "100px",
          height: "100px",
          border: "1px solid rgba(228, 96, 51, 0.1)",
          borderRadius: "50%",
          animation: "bgPulse 4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          width: "80px",
          height: "80px",
          border: "1px solid rgba(78, 140, 255, 0.1)",
          borderRadius: "50%",
          animation: "bgPulse 3s ease-in-out infinite 1s",
        }}
      />

      <style>{`
        @keyframes spin {
          0% { 
            transform: rotate(0deg);
            border-top-color: #e46033;
            border-right-color: #e46033;
          }
          50% {
            border-top-color: #ff8c66;
            border-right-color: #ff8c66;
          }
          100% { 
            transform: rotate(360deg);
            border-top-color: #e46033;
            border-right-color: #e46033;
          }
        }

        @keyframes spinReverse {
          0% { 
            transform: rotate(0deg);
            border-bottom-color: #4e8cff;
            border-left-color: #4e8cff;
          }
          50% {
            border-bottom-color: #82b1ff;
            border-left-color: #82b1ff;
          }
          100% { 
            transform: rotate(-360deg);
            border-bottom-color: #4e8cff;
            border-left-color: #4e8cff;
          }
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
            background-color: #e46033;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.7;
            background-color: #ff8c66;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bgPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.05;
          }
        }

        /* Ensure loading screen covers everything */
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;