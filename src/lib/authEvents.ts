// Eventos personalizados para sincronización de autenticación

export const AUTH_EVENTS = {
  LOGIN: 'customLogin',
  LOGOUT: 'customLogout',
  REGISTER: 'customRegister'
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dispatchAuthEvent = (eventType: keyof typeof AUTH_EVENTS, data?: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS[eventType], { detail: data }));
  }
};

export const addAuthEventListener = (eventType: keyof typeof AUTH_EVENTS, callback: (event: CustomEvent) => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_EVENTS[eventType], callback as EventListener);
  }
};

export const removeAuthEventListener = (eventType: keyof typeof AUTH_EVENTS, callback: (event: CustomEvent) => void) => {
  if (typeof window !== 'undefined') {
    window.removeEventListener(AUTH_EVENTS[eventType], callback as EventListener);
  }
}; 