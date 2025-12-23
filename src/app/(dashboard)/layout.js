'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import LearningLevelModal from '@/components/modals/LearningLevelModal';
import ThemeProvider from '@/components/providers/ThemeProvider';
import { useGetMeQuery } from '@/store/userApi';
import { logout } from '@/store/authSlice';

export default function DashboardLayout({ children }) {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

    // Fetch latest user data when on dashboard
    const { data: userData, isLoading: isUserLoading, error } = useGetMeQuery(undefined, {
        skip: !isAuthenticated
    });

    // Check authentication and redirect if not authenticated
    useEffect(() => {
        // Check if localStorage has been initialized
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (!token && !isAuthenticated) {
                router.replace('/login');
                return;
            }
            setAuthChecked(true);
        }
    }, [isAuthenticated, router]);

    // Handle API errors (like jwt expired)
    useEffect(() => {
        if (error) {
            // Check if it's an auth error (401 or jwt expired)
            const isAuthError = error.status === 401 || 
                error.data?.error?.message?.includes('jwt expired') ||
                error.data?.error?.message?.includes('No authentication token');
            
            if (isAuthError) {
                // Clear auth state and redirect to login
                dispatch(logout());
                router.replace('/login');
            }
        }
    }, [error, dispatch, router]);

    // Use current user from state or freshly fetched user
    const currentUser = userData?.data || user;

    // Show modal if user is logged in but hasn't set their learning level
    const showLearningLevelModal = isAuthenticated && currentUser && !currentUser.learnLevel;

    // Show loading while checking auth
    if (!authChecked) {
        return (
            <div className="fixed inset-0 bg-background-secondary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-foreground-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <ThemeProvider>
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
        </ThemeProvider>
    );
}

