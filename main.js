const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let folders = [];

app.whenReady().then(() => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	mainWindow.loadFile("index.html");
});

ipcMain.handle("select-file", async () => {
	const result = await dialog.showOpenDialog(mainWindow, {
		properties: ["openFile"],
	});
	return result.filePaths[0] || null;
});

ipcMain.handle("rename-file", async (_, oldPath, newName) => {
	try {
		const newPath = path.join(path.dirname(oldPath), newName);
		fs.renameSync(oldPath, newPath);
		return { success: true, newPath };
	} catch (error) {
		return { success: false, error: error.message };
	}
});

// ipcMain.handle("move-file", async (_, oldPath, newDir) => {
// 	try {
// 		const newPath = path.join(newDir, path.basename(oldPath));
// 		fs.renameSync(oldPath, newPath);
// 		return { success: true, newPath };
// 	} catch (error) {
// 		return { success: false, error: error.message };
// 	}
// });

// ipcMain.handle("delete-file", async (_, filePath) => {
// 	try {
// 		fs.unlinkSync(filePath);
// 		return { success: true };
// 	} catch (error) {
// 		return { success: false, error: error.message };
// 	}
// });

// Select folder
ipcMain.handle("select-folder", async () => {
	const { filePaths } = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});
	return filePaths.length ? filePaths[0] : null;
});

// Add folder
ipcMain.handle("add-folder", (_, folderPath) => {
	if (!folders.includes(folderPath)) {
		folders.push(folderPath);
	}
	return true;
});

// Get folders
ipcMain.handle("get-folders", () => {
	return folders;
});

// Open folder
ipcMain.handle("open-folder", (_, index) => {
	if (folders[index]) {
		shell.openPath(folders[index]);
	}
});

// Delete folder
ipcMain.handle("delete-folder", (_, index) => {
	folders.splice(index, 1);
});
