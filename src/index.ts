import { app, BrowserWindow, globalShortcut, screen, Tray, nativeImage, Menu, ipcMain, shell } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createBackgroundProcess = async (menu: Menu) => {
    const image = nativeImage.createEmpty()
    const bgWindow = new Tray(image);
    bgWindow.setContextMenu(menu)
    return bgWindow;
}

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const rootHeight = primaryDisplay.workAreaSize.height
    const rootWidth = primaryDisplay.workAreaSize.width

    const mainWindow = new BrowserWindow({
        title: "Alt X",
        titleBarStyle: "hidden",
        width: rootWidth * 0.5,
        height: rootHeight * .5,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        minimizable: false,
        frame: false,
        show: false,
        transparent: true,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            devTools: false
        },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(false);

    mainWindow.on("blur", () => mainWindow.hide())

    return mainWindow;
};

app.on('ready', async () => {
    globalShortcut.unregisterAll()
    const bgProcess = await createBackgroundProcess(Menu.buildFromTemplate([
        {label: "Open window", type: "normal", click: () => {mainWindow.show()}},
        {label: "Close", type: "normal" , click: () => {app.quit()}}
    ]));
    const mainWindow = createWindow();
    globalShortcut.register("Alt+X", () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    })
});

ipcMain.handle("openUrl", async (_, url: string) => {
    if (!url.startsWith("https://") && !url.startsWith("http") && !url.includes("://")) url = "https://" + url
    await shell.openExternal(url)
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
