import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Toast, ToastConfig } from '@/components/ui/toast';
import { Dialog, DialogConfig } from '@/components/ui/dialog';
import { Notification, NotificationConfig } from '@/components/ui/notification';

type UIContextType = {
  showToast: (config: ToastConfig) => void;
  showDialog: (config: DialogConfig) => void;
  showNotification: (config: NotificationConfig) => void;
  hideDialog: () => void;
};

const UIContext = createContext<UIContextType>({} as UIContextType);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [dialog, setDialog] = useState<DialogConfig | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationConfig | null>(null);

  const showToast = useCallback((config: ToastConfig) => {
    setToast(null);
    setTimeout(() => setToast(config), 50); // reset to re-trigger animation
  }, []);

  const showDialog = useCallback((config: DialogConfig) => {
    setDialog(config);
    setDialogVisible(true);
  }, []);

  const hideDialog = useCallback(() => setDialogVisible(false), []);

  const showNotification = useCallback((config: NotificationConfig) => {
    setNotification(null);
    setTimeout(() => setNotification(config), 50);
  }, []);

  return (
    <UIContext.Provider value={{ showToast, showDialog, showNotification, hideDialog }}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {notification && (
          <Notification
            key={JSON.stringify(notification)}
            {...notification}
            onHide={() => setNotification(null)}
          />
        )}
        {toast && (
          <Toast
            key={JSON.stringify(toast)}
            {...toast}
            onHide={() => setToast(null)}
          />
        )}
      </View>
      {dialog && (
        <Dialog
          visible={dialogVisible}
          {...dialog}
          onClose={hideDialog}
        />
      )}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
