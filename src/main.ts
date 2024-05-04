import path from "path";
import { app, BrowserWindow } from "electron";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile(path.join(__dirname, "../public/index.html"));
};

app.whenReady().then(createWindow);
