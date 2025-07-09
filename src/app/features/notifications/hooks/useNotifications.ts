import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { 
    GET_MY_NOTIFICATIONS, 
    GET_UNREAD_NOTIFICATIONS_COUNT, 
    MARK_NOTIFICATION_AS_READ,
    CREATE_NOTIFICATION 
} from "@/app/api/notifications";
import { 
    INotification, 
    ICreateNotificationInput
} from "@/app/models/INotifications";

export function useNotifications() {
    const apolloClient = useApolloClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Query para obtener las notificaciones del usuario
    const { 
        data: notificationsData, 
        loading: notificationsLoading, 
        error: notificationsError,
        refetch: refetchNotifications 
    } = useQuery(GET_MY_NOTIFICATIONS, {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
    });

    // Query para obtener el conteo de notificaciones no leídas
    const { 
        data: unreadCountData, 
        loading: unreadCountLoading,
        error: unreadCountError,
        refetch: refetchUnreadCount 
    } = useQuery(GET_UNREAD_NOTIFICATIONS_COUNT, {
        fetchPolicy: 'cache-and-network',
        pollInterval: 30000, // Actualizar cada 30 segundos
        errorPolicy: 'all'
    });

    // Mutation para marcar notificación como leída
    const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_AS_READ);

    // Mutation para crear notificación
    const [createNotificationMutation] = useMutation(CREATE_NOTIFICATION);

    // Estado local para las notificaciones
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    // Actualizar estado local cuando cambien los datos
    useEffect(() => {
        if (notificationsData?.myNotifications) {
            setNotifications(notificationsData.myNotifications);
        }
    }, [notificationsData]);

    useEffect(() => {
        if (unreadCountData?.unreadNotificationsCount !== undefined) {
            setUnreadCount(unreadCountData.unreadNotificationsCount);
        }
    }, [unreadCountData]);

    /**
     * Función para marcar una notificación como leída.
     * @description Esta función actualiza el estado local de las notificaciones y el conteo de no leídas,
     * @param notificationId - ID de la notificación a marcar como leída.
     * @return Promise<boolean> - Retorna true si la operación fue exitosa, false en caso contrario.
     * @return {Promise<boolean>}
     */
    const markNotificationAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            const { data } = await markAsReadMutation({
                variables: { notificationId }
            });

            if (data?.markNotificationAsRead?.success) {
                // Actualizar la notificación localmente
                setNotifications((prev: INotification[]) => 
                    prev.map((notification: INotification) => 
                        notification.id_notificacion === notificationId
                            ? { ...notification, leida: true, read_at: new Date() }
                            : notification
                    )
                );

                // Actualizar el conteo
                setUnreadCount((prev: number) => Math.max(0, prev - 1));

                // Refetch para sincronizar con el servidor
                await Promise.all([
                    refetchNotifications(),
                    refetchUnreadCount()
                ]);

                return true;
            } else {
                setError(data?.markNotificationAsRead?.message || "Error al marcar como leída");
                return false;
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
            setError("Error al marcar la notificación como leída");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [markAsReadMutation, refetchNotifications, refetchUnreadCount]);

    /**
     * Función para crear una nueva notificación.
     * @description Esta función crea una nueva notificación y actualiza la cache y el conteo de no leídas.
     * @param input - Objeto que contiene los datos necesarios para crear la notificación.
     * @return Promise<INotification | null> - Retorna la notificación creada o null en caso de error.
     * @return {Promise<INotification | null>}
     */
    const createNotification = useCallback(async (input: ICreateNotificationInput): Promise<INotification | null> => {
        try {
            setIsLoading(true);
            setError(null);

            const { data } = await createNotificationMutation({
                variables: { input }
            });

            if (data?.createNotification) {
                // Actualizar la cache y refetch
                await Promise.all([
                    refetchNotifications(),
                    refetchUnreadCount()
                ]);

                return data.createNotification;
            }

            return null;
        } catch (error) {
            console.error("Error creating notification:", error);
            setError("Error al crear la notificación");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [createNotificationMutation, refetchNotifications, refetchUnreadCount]);

    /**
     * Función para refrescar las notificaciones y el conteo de no leídas.
     * @description Esta función permite actualizar las notificaciones y el conteo de no leídas
     * sin necesidad de recargar la página.
     * @return Promise<void>
     */
    const refreshNotifications = useCallback(async () => {
        try {
            await Promise.all([
                refetchNotifications(),
                refetchUnreadCount()
            ]);
        } catch (error) {
            console.error("Error refreshing notifications:", error);
            setError("Error al actualizar las notificaciones");
        }
    }, [refetchNotifications, refetchUnreadCount]);

    /**
     * Función para obtener notificaciones no leídas.
     * @description Esta función filtra las notificaciones para devolver solo aquellas que no han sido leídas.
     * @return INotification[] - Retorna un array de notificaciones no leídas.
     * @return {INotification[]}
     */
    const getUnreadNotifications = useCallback((): INotification[] => {
        return notifications.filter((notification: INotification) => !notification.leida);
    }, [notifications]);

    /**
     * Función para obtener notificaciones leídas.
     * @description Esta función filtra las notificaciones para devolver solo aquellas que han sido leídas.
     * @return INotification[] - Retorna un array de notificaciones leídas.
     * @return {INotification[]}
     */
    const getReadNotifications = useCallback((): INotification[] => {
        return notifications.filter((notification: INotification) => notification.leida);
    }, [notifications]);

    /**
     * Función para invalidar la cache de notificaciones.
     * @description Esta función elimina las entradas de cache relacionadas con las notificaciones y el conteo de no leídas, lo que fuerza a las consultas a obtener datos frescos del servidor.
     * @return void
     * @return {void}
     */
    const invalidateCache = useCallback(() => {
        apolloClient.cache.evict({ fieldName: "myNotifications" });
        apolloClient.cache.evict({ fieldName: "unreadNotificationsCount" });
        apolloClient.cache.gc();
    }, [apolloClient]);

    return {
        // Data
        notifications,
        unreadCount,
        unreadNotifications: getUnreadNotifications(),
        readNotifications: getReadNotifications(),
        
        // Loading states
        isLoading: isLoading || notificationsLoading || unreadCountLoading,
        
        // Error states
        error: error || notificationsError?.message || unreadCountError?.message || null,
        
        // Actions
        markNotificationAsRead,
        createNotification,
        refreshNotifications,
        invalidateCache,
        
        // Utility functions
        getUnreadNotifications,
        getReadNotifications
    };
} 