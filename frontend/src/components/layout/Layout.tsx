import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-muted/40 font-sans antialiased text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-xl font-bold">AI-First CRM</h1>
      </header>
      <main className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
        {children}
      </main>
    </div>
  );
};
