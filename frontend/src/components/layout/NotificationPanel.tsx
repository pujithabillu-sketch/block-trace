import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldCheck, Truck, Check, X, Inbox, XCircle, AlertCircle } from 'lucide-react';
import type { NotificationItem } from '../../types';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Product Transferred',
    message: 'Custody transfer of PROD-100005 initiated to Retailer RTL9Z0A...',
    type: 'info',
    timestamp: Date.now() - 1000 * 60 * 5,
    read: false,
  },
  {
    id: 'n2',
    title: 'Product Received',
    message: 'Global Freight Distributors confirmed receipt of PROD-100001.',
    type: 'success',
    timestamp: Date.now() - 1000 * 60 * 30,
    read: false,
  },
  {
    id: 'n3',
    title: 'Product Recalled',
    message: 'Safety recall issued for PROD-100002 (Batch BATCH-2026-002). Transfers locked.',
    type: 'error',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    read: false,
  },
  {
    id: 'n4',
    title: 'Counterfeit Report Logged',
    message: 'Counterfeit evidence hash filed for PROD-100003.',
    type: 'warning',
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    read: true,
  },
  {
    id: 'n5',
    title: 'Transaction Confirmed',
    message: 'ARC-4 method register_product() committed in Algorand block #4091823',
    type: 'success',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    read: true,
  },
  {
    id: 'n6',
    title: 'Transaction Failed (Rejected)',
    message: 'Smart contract rejected transfer_product(): Target account not authorized.',
    type: 'error',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
  },
];

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (title: string, type: NotificationItem['type']) => {
    if (title.includes('Transferred')) return <Truck className="w-4 h-4 text-teal-600" />;
    if (title.includes('Received')) return <Inbox className="w-4 h-4 text-emerald-600" />;
    if (title.includes('Recalled')) return <XCircle className="w-4 h-4 text-rose-600" />;
    if (title.includes('Counterfeit')) return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    if (title.includes('Failed')) return <AlertCircle className="w-4 h-4 text-rose-600" />;
    return type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Supply Chain Alerts</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No active alerts</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                      !n.read ? 'bg-teal-50/30 font-semibold' : ''
                    }`}
                  >
                    <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-0.5">{getIcon(n.title, n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{n.title}</h5>
                        <span className="text-[10px] text-slate-400">
                          {Math.round((Date.now() - n.timestamp) / (1000 * 60))}m ago
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-slate-300 hover:text-slate-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
