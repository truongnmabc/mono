// sr-sw.js
// File này được chạy ngay khi trang tải, đảm bảo đăng ký SW và khởi tạo IndexedDB từ SW

(async function () {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      // Xác định Service Worker active
      let activeWorker = registration.active;
      if (!activeWorker && registration.waiting) {
        activeWorker = registration.waiting;
      } else if (!activeWorker && registration.installing) {
        activeWorker = registration.installing;
      }

      // Hàm gửi message khởi tạo DB tới Service Worker thông qua MessageChannel
      const initializeDBServiceWorker = (worker) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          if (event.data.status === 'success') {
            console.log('Message:', event.data.message);
          } else {
            console.error('Failed to initialize DB.');
          }
        };

        worker.postMessage({ type: 'INIT_DB' }, [messageChannel.port2]);
      };

      if (activeWorker) {
        // Lắng nghe sự thay đổi trạng thái của worker
        activeWorker.addEventListener('statechange', () => {
          if (activeWorker.state === 'activated') {
            console.log('Service Worker activated!');
            initializeDBServiceWorker(activeWorker);
          }
        });

        // Nếu đã active ngay lập tức
        if (activeWorker.state === 'activated') {
          console.log('Service Worker is already activated!');
          initializeDBServiceWorker(activeWorker);
        }
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
})();
