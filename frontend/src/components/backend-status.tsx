/**
 * Backend Status Component
 * Shows current backend status and allows switching (in development)
 */

'use client';

import React from 'react';
import { useBackendDetector } from '@/lib/backend-detector';

interface BackendStatusProps {
  showSwitcher?: boolean;
  className?: string;
}

export function BackendStatus({ showSwitcher = false, className = '' }: BackendStatusProps) {
  const { status, currentBackend, apiBaseUrl, refresh } = useBackendDetector();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'running':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'unhealthy':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'stopped':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'running':
        return '🟢';
      case 'unhealthy':
        return '🟡';
      case 'stopped':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
        <span className="mr-2">{getStatusIcon()}</span>
        {status.backend ? (
          <>
            {status.backend.toUpperCase()} Backend
            {status.port && (
              <span className="ml-1 text-xs opacity-75">:{status.port}</span>
            )}
          </>
        ) : (
          'No Backend'
        )}
      </div>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        title="Refresh backend status"
      >
        <svg
          className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {showSwitcher && process.env.NODE_ENV === 'development' && (
        <div className="ml-2 text-xs text-gray-500">
          <div>API: {apiBaseUrl}</div>
          <div>Last checked: {status.lastChecked.toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
}

export default BackendStatus;