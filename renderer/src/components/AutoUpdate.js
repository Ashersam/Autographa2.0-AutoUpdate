import React, { useEffect, useState } from 'react';

const AutoUpdate = () => {
  const [message, setMessage] = useState(null);
  const [version, setVersion] = useState('');
  const [notification, setNotification] = useState(false);
  const [restartButton, setRestartButton] = useState(false);

  useEffect(() => {
        const electron = window.require('electron');
        const { ipcRenderer } = electron;
        console.log(ipcRenderer);
        ipcRenderer.send('app_version');
        ipcRenderer.on('app_version', (event, arg) => {
        ipcRenderer.removeAllListeners('app_version');
        console.log(arg.version);
        setVersion(`Version ${ arg.version}`);
      });

        ipcRenderer.on('update_available', () => {
        ipcRenderer.removeAllListeners('update_available');
        console.log('Downloading now.');
        setMessage('A new update is available. Downloading now...');
        setNotification(true);
      });

        ipcRenderer.on('update_downloaded', () => {
        ipcRenderer.removeAllListeners('update_downloaded');
        setMessage('Update Downloaded. It will be installed on restart. Restart now?');
          setRestartButton(true);
          setNotification(true);
      });
      console.log(notification, restartButton);
  });

  function closeNotification() {
    setNotification(false);
  }

  function restartApp() {
    console.log('hi');
    const electron = window.require('electron');
    const { ipcRenderer } = electron;
    ipcRenderer.send('restart_app');
  }
  return (
    <>
      <div id="notification">
        <p>
          {version}
          {message}
        </p>
        <button id="close-button" type="button" onClick={closeNotification}>
          Close
        </button>
        <button id="restart-button" type="button" onClick={restartApp}>
          Restart
        </button>
      </div>
    </>
  );
};

export default AutoUpdate;
