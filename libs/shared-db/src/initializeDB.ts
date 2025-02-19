type IProps = {
  appShortName: string;
  API_PATH: {};
  onSuccess?: () => void;
};

export const handleRegisterServiceWorker = async ({
  appShortName,
  API_PATH,
  onSuccess,
}: IProps) => {
  if ('serviceWorker' in navigator && appShortName) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      // Kiểm tra nếu service worker đã active
      let activeWorker = registration.active;

      if (!activeWorker && registration.waiting) {
        activeWorker = registration.waiting;
      } else if (!activeWorker && registration.installing) {
        activeWorker = registration.installing;
      }

      if (activeWorker) {
        // Nếu đã có worker active hoặc đang cài đặt
        activeWorker.addEventListener('statechange', () => {
          if (activeWorker.state === 'activated') {
            console.log('Service Worker activated!');
            initializeDBServiceWorker({
              API_PATH,
              appShortName,
              worker: activeWorker,
            });
          }
        });

        // Nếu active ngay lập tức
        if (activeWorker.state === 'activated') {
          console.log('Service Worker is already activated!');
          initializeDBServiceWorker({
            API_PATH,
            appShortName,
            worker: activeWorker,
          });
        }
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

interface IInitPropss extends IProps {
  worker: ServiceWorker;
}
export const initializeDBServiceWorker = ({
  API_PATH,
  appShortName,
  worker,
  onSuccess,
}: IInitPropss) => {
  const messageChannel = new MessageChannel();

  messageChannel.port1.onmessage = (event) => {
    if (event.data.status === 'success') {
      console.log('Message:', event.data.message);
      onSuccess?.();
    } else {
      console.error('Failed to initialize DB.');
    }
  };

  worker.postMessage(
    {
      type: 'INIT_DB',
      payload: {
        appShortName: appShortName,
        apiPath: API_PATH,
      },
    },
    [messageChannel.port2]
  );
};
