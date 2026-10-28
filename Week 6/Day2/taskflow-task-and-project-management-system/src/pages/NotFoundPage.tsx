import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { DashboardIcon } from '../components/icons';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-950">
      <div className="mx-auto max-w-md space-y-4">
        <span className="text-7xl font-extrabold text-primary tracking-tight">404</span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The page or route you were looking for doesn&apos;t exist, has been moved, or is temporarily
          unavailable in this workspace.
        </p>

        <div className="pt-4">
          <Link to="/">
            <Button variant="primary" leftIcon={<DashboardIcon className="w-4 h-4" />}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
