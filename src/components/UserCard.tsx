import { FaGithub, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import type { User } from '../types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    checkIfFollowingUser,
    followGithubUser,
    unfollowGithubUser,
} from '../api/github';

const UserCard = ({ user }: { user: User }) => {
    const { data: isFollowing, refetch } = useQuery({
        queryKey: ['follow-status', user.login],
        queryFn: () => checkIfFollowingUser(user.login),
        enabled: !!user.name,
    });

    const followMutation = useMutation({
        mutationFn: () => followGithubUser(user.login),
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: () => unfollowGithubUser(user.login),
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const handleFollow = () => {
        if (isFollowing) {
            unfollowMutation.mutate();
        } else {
            followMutation.mutate();
        }
    };
    return (
        <section className="text-center mt-4 mb-4 shadow-lg rounded p-4">
            <img
                src={user.avatar_url}
                alt="User profile"
                className="w-40 h-40 mt-5 rounded-full object-cover mx-auto"
            />
            <p className="text-lg font-bold my-3">{user.name}</p>
            <p className="text-md my-3">{user.bio}</p>
            <a
                className={`flex items-center justify-center text-white my-3 gap-2 w-full p-2 cursor-pointer ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg `}
                onClick={handleFollow}
            >
                {isFollowing ? (
                    <>
                        <FaUserMinus />
                        <span>Following</span>
                    </>
                ) : (
                    <>
                        <FaUserPlus />
                        <span>Follow User</span>
                    </>
                )}
            </a>
            <a
                href={user.html_url}
                target="_blank"
                className="flex items-center justify-center my-3 gap-2 w-full p-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg "
            >
                <FaGithub />
                View Github Profile
            </a>
        </section>
    );
};

export default UserCard;
