import { useEffect, useState } from "react";
// import { CiCloudMoon } from "react-icons/ci";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { PiCloudMoonLight } from "react-icons/pi";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
	  document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
	  document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full transition duration-300 ease-in-out 
	hover:bg-gradient-to-r hover:from-gray-200 hover:to-slate-400
	dark:hover:from-slate-500 dark:hover:to-blue-300">
      {theme === "light" ? (
        <PiCloudMoonLight  className="text-2xl text-blue-500" />
      ) : (
        <TiWeatherPartlySunny className="text-2xl text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
