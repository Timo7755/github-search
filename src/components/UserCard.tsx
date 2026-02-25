import { FaGithubAlt } from "react-icons/fa";
import type { GithubUser } from "../types";

const UserCard = ({ user }: { user: GithubUser }) => {
  return (
    <div className="w-full max-w-full min-w-0 mx-auto mt-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100/80 dark:border-gray-700 text-center overflow-hidden">
      <img
        src={user.avatar_url}
        alt={user.name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full mx-auto mt-2 mb-4 ring-2 ring-primary-200/80 dark:ring-primary-700/60 ring-offset-2 border border-primary-100 dark:border-primary-800 shadow-sm"
      />
      <h2 className="mb-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {user.name || user.login}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 my-4 leading-relaxed line-clamp-3 break-words overflow-hidden">
        {user.bio}
      </p>
      <a
        href={user.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full text-sm font-semibold py-3 px-5 rounded-xl bg-primary-700 dark:bg-primary-600 text-white no-underline shadow-md shadow-primary-700/25 hover:bg-primary-800 dark:hover:bg-primary-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <FaGithubAlt className="text-base" />
        View Profile
      </a>
    </div>
  );
};

export default UserCard;
