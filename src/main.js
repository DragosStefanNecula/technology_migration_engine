import { app, BrowserWindow, ipcMain } from 'electron';

import Parser from "tree-sitter";
import Perl from "@ganezdragon/tree-sitter-perl";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
  const parser = new Parser();
  parser.setLanguage(Perl);

  const code = `
    sub hello :Path('hello') :Args(0) 
  `;

  const tree = parser.parse(code);

  const walk = (node, indent = 0) => {
    const padding = " ".repeat(indent);
    let result = `${padding}${node.type}: "${node.text.replace(/\n/g, "\\n")}"\n`;
    
    for (const child of node.children) {
      result += walk(child, indent + 2); // concatenate child strings
    }
    
    return result;
  };

  return walk(tree.rootNode);
}

function createWindow() {

  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
        preload: `${__dirname}/preload.js`,
      nodeIntegration: true
    }
  });

  const isDev = false;
  const startURL = isDev 
  ? 'http://localhost:5173' // Vite dev server
  : `file:/${__dirname}/dist/renderer/index.html`;

  win.loadURL(startURL);
  
  ipcMain.on('renderer-ready', (event) => {
      let string = JSON.stringify(main()).slice(0, 5000);
      event.sender.send('set-value', string);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
