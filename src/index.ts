import { app, BrowserWindow, globalShortcut, screen } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createBackgroundProcess = () => {
    const bgWindow = new BrowserWindow({show: false});
    return bgWindow.id;
}

const createWindow = (): void => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const rootHeight = primaryDisplay.workAreaSize.height
    const rootWidth = primaryDisplay.workAreaSize.width

    const mainWindow = new BrowserWindow({
        height: rootHeight * 0.15,
        width: rootWidth * 0.5,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        minimizable: false,
        alwaysOnTop: true,
        frame: false,
        show: false,
        transparent: true,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            devTools: false
        },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    mainWindow.on("ready-to-show", () => mainWindow.show())
};

app.on('ready', () => {
    globalShortcut.unregisterAll()
    const bgProcessId = createBackgroundProcess();
    globalShortcut.register("Alt+X", () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length <= 1) {
            createWindow();
        } else {
            for (const win of windows) {
                if (win.id == bgProcessId)
                    continue;
                win.destroy()
            }
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
