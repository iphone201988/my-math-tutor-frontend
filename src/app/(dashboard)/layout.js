import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }) {
    return (
        <div className="fixed inset-0 bg-background-secondary">
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
        </div>
    );
}
