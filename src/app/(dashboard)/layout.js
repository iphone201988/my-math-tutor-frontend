'use client';

import { useSelector } from 'react-redux';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import LearningLevelModal from '@/components/modals/LearningLevelModal';
import { useGetMeQuery } from '@/store/userApi';

export default function DashboardLayout({ children }) {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // Fetch latest user data when on dashboard
    const { data: userData, isLoading: isUserLoading } = useGetMeQuery(undefined, {
        skip: !isAuthenticated
    });

    // Use current user from state or freshly fetched user
    const currentUser = userData?.data || user;

    // Show modal if user is logged in but hasn't set their learning level
    // We show it immediately from local state (isAuthenticated) to avoid delay
    const showLearningLevelModal = isAuthenticated && currentUser && !currentUser.learnLevel;

    return (
        <div className="fixed inset-0 bg-background-secondary text-foreground">
            {/* Desktop Sidebar - Fixed */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Main Content - Scrollable */}
            <main className="fixed inset-0 lg:left-64 overflow-y-auto pb-20 lg:pb-0">
                {children}
            </main>

            {/* Mobile Navigation */}
            <MobileNav />

            {/* Mandatory Learning Level Selection */}
            <LearningLevelModal isOpen={showLearningLevelModal} user={user} />
        </div>
    );
}
