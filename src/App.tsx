import UserSearch from "./components/UserSearch";
import { useTheme } from "./hooks/useTheme";
import { FaMoon, FaSun } from "react-icons/fa";

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-[480px] max-w-[95vw] mx-auto flex flex-col items-center shrink-0">
      <div className="w-full min-w-0 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100/80 dark:border-gray-700 text-center">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            GitHub User Search
          </h1>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <FaSun className="text-lg" />
            ) : (
              <FaMoon className="text-lg" />
            )}
          </button>
        </div>
        <UserSearch />
      </div>
    </div>
  );
};

export default App;
