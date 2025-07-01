'use client'

import { Button } from "./ui/button";
import { useNotifications } from "@/app/features/notifications/hooks/useNotifications";
import { INotification } from "@/app/models/INotifications";
import { Bell, Check, X, RefreshCw, Clock } from "lucide-react";
import { useState } from "react";

export function NotificationsMenu() {
    const { 
        notifications, 
        unreadCount,
        isLoading, 
        error, 
        markNotificationAsRead, 
        refreshNotifications 
    } = useNotifications();
    
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

    const handleMarkAsRead = async (notificationId: string) => {
        if (processingIds.has(notificationId)) return;
        
        setProcessingIds((prev: Set<string>) => new Set(prev).add(notificationId));
        
        try {
            await markNotificationAsRead(notificationId);
        } finally {
            setProcessingIds((prev: Set<string>) => {
                const newSet = new Set(prev);
                newSet.delete(notificationId);
                return newSet;
            });
        }
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
        
        if (diffMinutes < 1) return "Ahora";
        if (diffMinutes < 60) return `Hace ${diffMinutes}m`;
        if (diffMinutes < 1440) return `Hace ${Math.floor(diffMinutes / 60)}h`;
        return `Hace ${Math.floor(diffMinutes / 1440)}d`;
    };

    const renderNotification = (notification: INotification) => {
        const isProcessing = processingIds.has(notification.id_notificacion);
        const isUnread = !notification.leida;

        return (
            <div 
                key={notification.id_notificacion}
                className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isUnread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
            >
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                            {isUnread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <div className={`font-medium text-sm ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.titulo}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {notification.mensaje}
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(notification.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {isUnread && (
                        <Button 
                            onClick={() => handleMarkAsRead(notification.id_notificacion)}
                            disabled={isProcessing}
                            className="text-blue-600 text-xs px-2 py-1 hover:bg-blue-100 rounded flex items-center gap-1" 
                            type="button" 
                            variant="ghost"
                            size="sm"
                        >
                            {isProcessing ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                                <Check className="w-3 h-3" />
                            )}
                            {isProcessing ? "..." : "Marcar leída"}
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-md overflow-hidden z-50 border">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-gray-600" />
                        <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <Button 
                        onClick={refreshNotifications}
                        disabled={isLoading}
                        variant="ghost" 
                        size="sm"
                        className="p-1"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
                {error && (
                    <div className="p-4 text-center text-red-600 bg-red-50 border-b">
                        <div className="flex items-center justify-center gap-2">
                            <X className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </div>
                )}

                {isLoading && notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <div className="text-sm">Cargando notificaciones...</div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <div className="text-sm">No hay notificaciones</div>
                    </div>
                ) : (
                    <>
                        {notifications.map(renderNotification)}
                    </>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                    <span className="text-xs text-gray-500">
                        {notifications.length} notificacion{notifications.length !== 1 ? 'es' : ''} total{notifications.length !== 1 ? 'es' : ''}
                    </span>
                </div>
            )}
        </div>
    );
};