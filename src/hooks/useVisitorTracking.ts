import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getOrCreateSession,
  recordPageView,
  recordEvent,
  saveSession,
  isBot,
} from '@/lib/visitorTracking';

const API_BASE = window.location.hostname === 'localhost'
  ? ''
  : '/api';

const ADMIN_SESSION_KEY = 'swifttrack_admin_session';

/**
 * Check if the current user is an admin to exclude from tracking
 */
function isAdminSession(): boolean {
  try {
    const session = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || '{}');
    return !!(session.ts && (Date.now() - session.ts < 24 * 60 * 60 * 1000));
  } catch {
    return false;
  }
}

/**
 * Sends session data to the backend.
 * Fails silently if the backend is unavailable.
 */
async function sendToBackend(session: ReturnType<typeof getOrCreateSession>) {
  try {
    await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: session.exitPage,
        sessionId: session.id,
        referrer: session.referrer,
        source: session.source,
        device: session.device.type,
        browser: session.device.browser,
        os: session.device.os,
        screen: `${session.device.screenWidth}x${session.device.screenHeight}`,
        language: session.device.language,
        timezone: session.device.timezone,
        isNew: session.isNew,
        isBot: session.isBot,
        isAdmin: false,
        pageViews: session.pageViews,
        duration: Math.round((Date.now() - session.timestamp) / 1000),
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch {
    // Backend offline — fail silently
  }
}

/**
 * Hook: tracks page views on route changes and sends data to backend.
 * Skips bots AND admin sessions to prevent self-counting.
 */
export function useVisitorTracking() {
  const location = useLocation();
  const sessionRef = useRef(getOrCreateSession());

  // Track page views on route change — skip bots and admins
  useEffect(() => {
    if (isBot() || isAdminSession()) return;
    if (location.pathname.startsWith('/admin')) return;

    const session = sessionRef.current;
    recordPageView(session, location.pathname, document.title);
    sendToBackend(session);
  }, [location.pathname]);

  // Track scroll depth
  useEffect(() => {
    if (isBot() || isAdminSession()) return;

    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      const session = sessionRef.current;
      const lastPage = session.pages[session.pages.length - 1];
      if (lastPage && scrollDepth > lastPage.scrollDepth) {
        lastPage.scrollDepth = scrollDepth;
        saveSession(session);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Send final data on page unload
  useEffect(() => {
    if (isBot() || isAdminSession()) return;

    const handleUnload = () => {
      const session = sessionRef.current;
      session.duration = Math.round((Date.now() - session.timestamp) / 1000);

      const lastPage = session.pages[session.pages.length - 1];
      if (lastPage) {
        lastPage.timeOnPage = Math.round((Date.now() - lastPage.timestamp) / 1000);
      }

      saveSession(session);
      sendToBackend(session);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Track outbound link clicks
  useEffect(() => {
    if (isBot() || isAdminSession()) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.hostname !== window.location.hostname) {
        recordEvent(sessionRef.current, {
          type: 'click',
          target: 'outbound-link',
          value: anchor.href,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}
