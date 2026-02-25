import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGithubUser, searchGithubUser } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearches";
import { useDebounce } from "use-debounce";
import SuggestionDropdown from "./SuggestionDropdown";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUsers");
    return stored ? JSON.parse(stored) : [];
  });
  // Debounce the username to prevent multiple requests
  const [debouncedUsername] = useDebounce(username, 500);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // query to fetch user details
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  // query to fetch suggestions for search
  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    setSubmittedUsername(trimmed);
    setUsername("");

    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((user) => user !== trimmed)];
      return updated.slice(0, 4);
    });
  };

  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  return (
    <>
      <form className="relative flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter a username..."
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.length > 1);
            }}
            className="w-full px-4 py-3.5 text-base border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary-400 dark:focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:shadow-sm"
          />
          {showSuggestions && suggestions?.length > 0 && (
            <SuggestionDropdown
              suggestions={suggestions}
              show={showSuggestions}
              onSelect={(selected) => {
                setUsername(selected);
                setShowSuggestions(false);

                if (submittedUsername !== selected) {
                  setSubmittedUsername(selected);
                } else {
                  refetch();
                }
                setRecentUsers((prev) => {
                  const updated = [
                    selected,
                    ...prev.filter((user) => user !== selected),
                  ];
                  return updated.slice(0, 4);
                });
              }}
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-5 text-base font-semibold text-white bg-primary-600 dark:bg-primary-500 rounded-xl shadow-md shadow-primary-600/25 hover:bg-primary-700 dark:hover:bg-primary-600 hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <p className="mt-6 text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</p>
      )}
      {isError && (
        <p className="mt-6 text-sm font-medium text-red-600 dark:text-red-400">
          {error?.message}
        </p>
      )}

      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username) => {
            setUsername("");
            setSubmittedUsername(username);
          }}
        />
      )}
    </>
  );
};

export default UserSearch;
