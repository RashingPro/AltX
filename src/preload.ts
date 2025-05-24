import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("electronApi", {
    openUrl: async (url: string) => await ipcRenderer.invoke("openUrl", url)
})
