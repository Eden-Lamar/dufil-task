import { createContext, useContext, useState } from "react";

const UIStateContext = createContext();

export const UIStateProvider = ({ children }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const toggleInputFocus = (focused) => {
    setIsInputFocused(focused);
  };

  return (
    <UIStateContext.Provider value={{ isInputFocused, toggleInputFocus }}>
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIState = () => {
  return useContext(UIStateContext);
};

UIStateProvider.propTypes = false