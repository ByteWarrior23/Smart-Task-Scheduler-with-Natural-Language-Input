import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthTokens } from '../../../shared/api/client';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fragment contains tokens: #provider=github&accessToken=...&refreshToken=...&redirect=/dashboard
    const hash = location.hash.startsWith('#') ? location.hash.slice(1) : '';
    const params = new URLSearchParams(hash);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const redirect = params.get('redirect') || '/dashboard';

    if (accessToken) {
      setAuthTokens({ accessToken, refreshToken });
      navigate(redirect, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return <div>Signing you in…</div>;
}
