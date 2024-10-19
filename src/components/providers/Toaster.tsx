import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import React from "react";

const ToasterProvider: React.FC = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerStyle={{
                top: 20,
                right: 20,
            }}
            toastOptions={{
                // Define default options
                className: '',
                duration: 4000,
                style: {
                    background: '#333',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
                success: {
                    duration: 4000,
                    iconTheme: {
                        primary: 'green',
                        secondary: 'white',
                    },
                    style: {
                        background: '#4caf50',
                        color: '#fff',
                    },
                },
                error: {
                    duration: 4000,
                    iconTheme: {
                        primary: 'red',
                        secondary: 'white',
                    },
                    style: {
                        background: '#f44336',
                        color: '#fff',
                    },
                },       
                // Customize other types as needed
            }}
        />
    );
};
export const toastWarn = (message: string) => {
    toast.custom((t) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#ff9800",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <span style={{ marginRight: "10px", fontSize: "18px" }}>⚠️</span>
        {message}
      </div>
    ));
  };

export default ToasterProvider;
