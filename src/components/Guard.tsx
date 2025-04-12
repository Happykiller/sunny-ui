// src\components\Guard.tsx
import { Trans } from 'react-i18next';
import React, { JSX, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface GuardProps {
  children: JSX.Element;
  checkSession: () => Promise<{ success: boolean; error?: string }>;
  onInvalidSession?: () => void;
}

export const Guard: React.FC<GuardProps> = ({ children, checkSession, onInvalidSession }) => {
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');

  useEffect(() => {
    let mounted = true;

    checkSession()
      .then(res => {
        if (!mounted) return;
        setStatus(res.success ? 'valid' : 'invalid');
        if (!res.success && onInvalidSession) {
          onInvalidSession();
        }
      })
      .catch(() => {
        if (!mounted) return;
        setStatus('invalid');
        if (onInvalidSession) {
          onInvalidSession();
        }
      });

    return () => {
      mounted = false;
    };
  }, [checkSession, onInvalidSession]);

  if (status === 'loading') return <div><Trans>common.loading</Trans></div>;
  if (status === 'invalid') return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};
