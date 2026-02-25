import { FaClock, FaUser } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { fetchGithubUser } from "../api/github";

type RecentSearchesProps = {
  users: string[];
  onSelect: (username: string) => void;
};

const RecentSearches = ({ users, onSelect }: RecentSearchesProps) => {
  const queryClient = useQueryClient();

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md">
      <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">
        <FaClock className="text-primary-600 dark:text-primary-400 shrink-0" />
        <h3>Recent searches</h3>
      </div>
      <ul className="list-none p-0 m-0 space-y-2">
        {users.map((user) => (
          <li key={user}>
            <button
              type="button"
              onClick={() => onSelect(user)}
              onMouseEnter={() => {
                queryClient.prefetchQuery({
                  queryKey: ["users", user],
                  queryFn: () => fetchGithubUser(user),
                });
              }}
              className="w-full text-left py-2.5 px-4 rounded-xl border border-gray-100 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-700/80 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3 transition-all duration-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:border-primary-200/60 cursor-pointer"
            >
              <FaUser className="text-primary-500 dark:text-primary-400 text-sm shrink-0" />
              {user}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
