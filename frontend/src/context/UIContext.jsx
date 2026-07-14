import React, { createContext, useContext, useState } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [onButtonClick, setOnButtonClick] = useState(null);

  return (
    <UIContext.Provider value={{ onButtonClick, setOnButtonClick }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  return context;
};
