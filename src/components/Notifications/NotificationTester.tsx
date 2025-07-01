'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/app/features/notifications/hooks/useNotifications";
import { useAuth } from "@/components/AuthProvider";
import { Bell, Plus, RefreshCw, TestTube } from "lucide-react";

export function NotificationTester() {
    const { createNotification, refreshNotifications, isLoading } = useNotifications();
    const { user } = useAuth();
    const [isCreating, setIsCreating] = useState(false);

    const createTestNotification = async () => {
        if (!user?.id_usuario) return;
        
        setIsCreating(true);
        try {
            await createNotification({
                id_usuario: user.id_usuario,
                titulo: "Notificación de Prueba",
                mensaje: `Esta es una notificación de prueba creada el ${new Date().toLocaleString()}`,
            });
        } finally {
            setIsCreating(false);
        }
    };

    const createUrgentNotification = async () => {
        if (!user?.id_usuario) return;
        
        setIsCreating(true);
        try {
            await createNotification({
                id_usuario: user.id_usuario,
                titulo: "🚨 Notificación Urgente",
                mensaje: "Esta es una notificación urgente que requiere atención inmediata. La tarea asociada vence muy pronto.",
            });
        } finally {
            setIsCreating(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-white border rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center gap-2 mb-3">
                <TestTube className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-sm">Pruebas de Notificaciones</h3>
            </div>
            
            <div className="space-y-2">
                <Button
                    onClick={createTestNotification}
                    disabled={isCreating || isLoading}
                    className="w-full text-xs flex items-center gap-2"
                    size="sm"
                >
                    {isCreating ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                        <Plus className="w-3 h-3" />
                    )}
                    Crear Notificación Normal
                </Button>
                
                <Button
                    onClick={createUrgentNotification}
                    disabled={isCreating || isLoading}
                    className="w-full text-xs flex items-center gap-2 bg-red-600 hover:bg-red-700"
                    size="sm"
                >
                    {isCreating ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                        <Bell className="w-3 h-3" />
                    )}
                    Crear Notificación Urgente
                </Button>
                
                <Button
                    onClick={refreshNotifications}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full text-xs flex items-center gap-2"
                    size="sm"
                >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
                Solo visible en desarrollo
            </div>
        </div>
    );
} 