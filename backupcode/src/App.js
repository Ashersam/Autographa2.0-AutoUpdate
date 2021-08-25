const { ipcRenderer } = require('electron');
const version = document.getElementById('version');
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

const App = () => {
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      version.innerText = 'Version ' + arg.version;
    });

    ipcRenderer.on('update_available', () => {
      ipcRenderer.removeAllListeners('update_available');
      message.innerText = 'A new update is available. Downloading now...';
      notification.classList.remove('hidden');
    });

    ipcRenderer.on('update_downloaded', () => {
      ipcRenderer.removeAllListeners('update_downloaded');
      message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
      restartButton.classList.remove('hidden');
      notification.classList.remove('hidden');
    });

    function closeNotification() {
      notification.classList.add('hidden');
    }

    function restartApp() {
      ipcRenderer.send('restart_app');
    }

    return ( 
        <>
            <h1>Autographa </h1>
            <h2>tested for env set new update</h2>
            <p id="version"></p>
                <div id="notification" class="hidden">
                  <p id="message"></p>
                  <button id="close-button" onClick={closeNotification}>
                    Close
                  </button>
                  <button id="restart-button" onClick={restartApp} className="hidden">
                    Restart
                  </button>
                </div>
        </>
     );
}
 
export default App;