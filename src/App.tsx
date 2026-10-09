import React, { useState } from 'react';
import { useLibrary } from './context/LibraryContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPalette } from './components/common/CommandPalette';
import { PrintReceiptModal } from './components/common/PrintReceiptModal';
import { PrintLibraryCardModal } from './components/common/PrintLibraryCardModal';
import { AddEditBookModal } from './components/views/AddEditBookModal';
import { Book } from './types';

// View Components
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { BooksView } from './components/views/BooksView';
import { BookDetailsView } from './components/views/BookDetailsView';
import { MembersView } from './components/views/MembersView';
import { MemberProfileView } from './components/views/MemberProfileView';
import { BorrowView } from './components/views/BorrowView';
import { ReturnsView } from './components/views/ReturnsView';
import { ReservationsView } from './components/views/ReservationsView';
import { FinesView } from './components/views/FinesView';
import { CategoriesView } from './components/views/CategoriesView';
import { AuthorsView } from './components/views/AuthorsView';
import { PublishersView } from './components/views/PublishersView';
import { InventoryView } from './components/views/InventoryView';
import { ZebraPrinterView } from './components/views/ZebraPrinterView';
import { ReportsView } from './components/views/ReportsView';
import { NotificationsView } from './components/views/NotificationsView';
import { UsersView } from './components/views/UsersView';
import { SettingsView } from './components/views/SettingsView';
import { ProfileView } from './components/views/ProfileView';

export const AppContent: React.FC = () => {
  const { isLoggedIn, activeTab, setActiveTab } = useLibrary();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Book Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const handleOpenAddBook = () => {
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'books':
        return (
          <BooksView
            onAddBook={handleOpenAddBook}
            onEditBook={handleOpenEditBook}
          />
        );
      case 'book_details':
        return (
          <BookDetailsView
            onBack={() => setActiveTab('books')}
            onEdit={() => setIsBookModalOpen(true)}
          />
        );
      case 'zebra_printer':
        return <ZebraPrinterView />;
      case 'members':
        return <MembersView />;
      case 'member_profile':
        return <MemberProfileView onBack={() => setActiveTab('members')} />;
      case 'borrow':
        return <BorrowView />;
      case 'returns':
        return <ReturnsView />;
      case 'reservations':
        return <ReservationsView />;
      case 'fines':
        return <FinesView />;
      case 'categories':
        return <CategoriesView />;
      case 'authors':
        return <AuthorsView />;
      case 'publishers':
        return <PublishersView />;
      case 'inventory':
        return <InventoryView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0D10] text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main App Layout */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Navbar */}
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {renderActiveView()}
        </main>

        {/* Application footer */}
        <footer className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500 bg-white dark:bg-[#111317]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-heading font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
              <img src="/logo.png" alt="Emblem" className="w-4 h-5 object-contain inline-block" />
              <span>Rahula College Library Management System</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
              <span>Library operations workspace</span>
            </span>
          </div>
        </footer>
      </div>

      {/* Global Interactive Elements */}
      <ToastContainer />
      <CommandPalette />
      <PrintReceiptModal />
      <PrintLibraryCardModal />
      <AddEditBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        editBookData={editingBook}
      />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
