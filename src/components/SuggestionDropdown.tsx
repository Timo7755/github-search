import type { GithubUser } from "../types";

type SuggestionDropdownProps = {
  suggestions: GithubUser[];
  show: boolean;
  onSelect: (username: string) => void;
};

const SuggestionDropdown = ({
  suggestions,
  show,
  onSelect,
}: SuggestionDropdownProps) => {
  if (!show || suggestions.length === 0) return null;
  return (
    <ul className="absolute left-0 right-0 top-full mt-2 max-h-[240px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-y-auto shadow-xl shadow-gray-200/60 dark:shadow-none z-10 list-none p-1.5">
      {suggestions.slice(0, 5).map((user: GithubUser) => (
        <li
          key={user.login}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(user.login)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(user.login);
          }}
          className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-colors duration-150 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700"
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-gray-600 border border-gray-100 dark:border-gray-700"
          />
          {user.login}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionDropdown;
