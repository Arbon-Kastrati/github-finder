import { FaGithub } from 'react-icons/fa';
import type { User } from '../types';

const UserCard = ({ user }: { user: User }) => {
    return (
        <section className="text-center mt-4 mb-4 shadow-lg rounded p-4">
            <img
                src={user.avatar_url}
                alt="User profile"
                className="w-40 h-40 mt-5 rounded-full object-cover mx-auto"
            />
            <p className="text-lg font-bold mt-3">{user.name}</p>
            <p className="text-sm my-2">{user.bio}</p>
            <a
                href={user.html_url}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full p-2 bg-gray-800 hover:bg-gray-900 text-white rounded "
            >
                <FaGithub />
                View Github Profile
            </a>
        </section>
    );
};

export default UserCard;
