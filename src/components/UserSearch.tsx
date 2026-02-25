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
      <form className="form" onSubmit={handleSubmit}>
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Enter a username..."
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.length > 1);
            }}
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

        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}

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
