import React, { useMemo, useState } from 'react';
import type { User, Post, Transaction, Dispute } from '../types';
import { UserCircleIcon } from '../types';

type SortKey = 'posts' | 'comments' | 'likes';

const AnalyticsCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow flex items-center space-x-4">
        {icon && <div className="p-2 bg-primary-light text-primary rounded-full">{icon}</div>}
        <div>
            <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
            <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{title}</p>
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow">
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary p-4 border-b dark:border-gray-700">{title}</h2>
        <div className="p-4 space-y-4">{children}</div>
    </div>
);


interface AnalyticsPageProps {
    users: User[];
    posts: Post[];
    transactions: Transaction[];
    disputes: Dispute[];
    onViewProfile: (user: User) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ users, posts, transactions, disputes, onViewProfile }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'posts', direction: 'desc' });

    const analyticsData = useMemo(() => {
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.isActive).length;
        const deactivatedUsers = totalUsers - activeUsers;
        const bannedUsers = users.filter(u => u.banExpiresAt && new Date(u.banExpiresAt) > new Date()).length;
        const verifiedUsers = users.filter(u => u.isVerified).length;
        const totalPosts = posts.length;
        const totalAdverts = posts.filter(p => p.isAdvert).length;
        const totalTransactions = transactions.length;
        const completedTransactions = transactions.filter(t => t.status === 'Completed');
        const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
        const itemsSoldCount = completedTransactions.length;
        const activeDisputes = disputes.filter(d => d.status === 'Open').length;
        const resolvedDisputes = disputes.filter(d => d.status === 'Resolved').length;
        const adminResolutions = disputes.filter(d => d.status === 'Resolved' && d.resolvedByAdminId).length;
        const commentsLockedCount = posts.filter(p => p.isCommentingRestricted).length;

        const userStats = users.map(user => {
            const userPosts = posts.filter(p => p.author === user.name);
            const userComments = posts.reduce((acc, post) => {
                const countComments = (comments: any[]) => {
                    let count = 0;
                    comments.forEach(c => {
                        if (c.author === user.name) count++;
                        if (c.replies) count += countComments(c.replies);
                    });
                    return count;
                };
                return acc + countComments(post.comments);
            }, 0);
            const likesReceived = userPosts.reduce((acc, p) => acc + p.likedBy.length, 0);

            return {
                ...user,
                postCount: userPosts.length,
                commentCount: userComments,
                likesReceived
            };
        });

        return {
            totalUsers, activeUsers, deactivatedUsers, bannedUsers, verifiedUsers,
            totalPosts, totalAdverts, totalTransactions, totalRevenue, itemsSoldCount,
            activeDisputes, resolvedDisputes, adminResolutions, commentsLockedCount,
            userStats
        };
    }, [users, posts, transactions, disputes]);

    const sortedUsers = useMemo(() => {
        const sorted = [...analyticsData.userStats].sort((a, b) => {
            let aValue, bValue;
            if (sortConfig.key === 'posts') {
                aValue = a.postCount;
                bValue = b.postCount;
            } else if (sortConfig.key === 'comments') {
                aValue = a.commentCount;
                bValue = b.commentCount;
            } else { // likes
                aValue = a.likesReceived;
                bValue = b.likesReceived;
            }
            if (sortConfig.direction === 'asc') {
                return aValue - bValue;
            }
            return bValue - aValue;
        });
        return sorted.slice(0, 10); // Top 10 users
    }, [analyticsData.userStats, sortConfig]);
    
    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Platform Analytics</h1>

            <Section title="User Analytics">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <AnalyticsCard title="Total Users" value={analyticsData.totalUsers} />
                    <AnalyticsCard title="Active Users" value={analyticsData.activeUsers} />
                    <AnalyticsCard title="Deactivated Users" value={analyticsData.deactivatedUsers} />
                    <AnalyticsCard title="Banned Users" value={analyticsData.bannedUsers} />
                    <AnalyticsCard title="Verified Users" value={analyticsData.verifiedUsers} />
                    <AnalyticsCard title="Total Posts" value={analyticsData.totalPosts} />
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">Top Users by Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">User</th>
                                    <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('posts')}>Posts</th>
                                    <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('comments')}>Comments</th>
                                    <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => requestSort('likes')}>Likes Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedUsers.map(user => (
                                    <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3">
                                            <button onClick={() => onViewProfile(user)} className="flex items-center space-x-3 group">
                                                {user.avatarUrl ? <img src={user.avatarUrl} className="w-8 h-8 rounded-full" /> : <UserCircleIcon className="w-8 h-8 text-gray-400"/>}
                                                <span className="font-medium group-hover:underline">{user.name}</span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{user.postCount}</td>
                                        <td className="px-4 py-3">{user.commentCount}</td>
                                        <td className="px-4 py-3">{user.likesReceived}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </Section>
            
             <Section title="Transaction Analytics">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <AnalyticsCard title="Total Adverts" value={analyticsData.totalAdverts} />
                    <AnalyticsCard title="Total Transactions" value={analyticsData.totalTransactions} />
                    <AnalyticsCard title="Total Revenue" value={`₦${analyticsData.totalRevenue.toLocaleString()}`} />
                    <AnalyticsCard title="Items Sold" value={analyticsData.itemsSoldCount} />
                    <AnalyticsCard title="Active Disputes" value={analyticsData.activeDisputes} />
                    <AnalyticsCard title="Resolved Disputes" value={analyticsData.resolvedDisputes} />
                </div>
            </Section>

            <Section title="Admin Analytics">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AnalyticsCard title="Admin Resolutions" value={analyticsData.adminResolutions} />
                    <AnalyticsCard title="Bans Issued" value={analyticsData.bannedUsers} />
                    <AnalyticsCard title="Users Deactivated" value={analyticsData.deactivatedUsers} />
                    <AnalyticsCard title="Comments Locked" value={analyticsData.commentsLockedCount} />
                </div>
            </Section>
        </div>
    );
};
