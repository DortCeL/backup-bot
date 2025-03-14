const { ipcRenderer } = require("electron");

document.getElementById("selectFile").addEventListener("click", async () => {
	const filePath = await ipcRenderer.invoke("select-file");
	if (filePath) {
		document.getElementById("filePath").innerText = filePath;
	}
});

document.getElementById("renameFile").addEventListener("click", async () => {
	const oldPath = document.getElementById("filePath").innerText;
	const newName = document.getElementById("newName").value;
	if (oldPath && newName) {
		const response = await ipcRenderer.invoke("rename-file", oldPath, newName);
		alert(response.success ? "File renamed!" : `Error: ${response.error}`);
	}
});

// document.getElementById("moveFile").addEventListener("click", async () => {
// 	const oldPath = document.getElementById("filePath").innerText;
// 	const { filePaths } = await ipcRenderer.invoke("select-file");
// 	if (oldPath && filePaths.length) {
// 		const response = await ipcRenderer.invoke(
// 			"move-file",
// 			oldPath,
// 			filePaths[0]
// 		);
// 		alert(response.success ? "File moved!" : `Error: ${response.error}`);
// 	}
// });

// document.getElementById("deleteFile").addEventListener("click", async () => {
// 	const filePath = document.getElementById("filePath").innerText;
// 	if (filePath) {
// 		const response = await ipcRenderer.invoke("delete-file", filePath);
// 		alert(response.success ? "File deleted!" : `Error: ${response.error}`);
// 	}
// });

document.getElementById("addFolder").addEventListener("click", async () => {
	const folderPath = await ipcRenderer.invoke("select-folder");
	if (folderPath) {
		await ipcRenderer.invoke("add-folder", folderPath);
		loadFolders();
	}
});

async function loadFolders() {
	const folders = await ipcRenderer.invoke("get-folders");
	const folderList = document.getElementById("folderList");
	folderList.innerHTML = "";

	folders.forEach((folder, index) => {
		const li = document.createElement("li");
		li.className = "flex justify-between bg-gray-700 p-2 rounded";

		li.innerHTML = `
            <span class="truncate">${folder}</span>
            <div>
                <button class="bg-green-500 px-2 py-1 rounded hover:bg-green-600" onclick="openFolder(${index})">📂</button>
                <button class="bg-red-500 px-2 py-1 rounded hover:bg-red-600" onclick="deleteFolder(${index})">🗑</button>
            </div>
        `;
		folderList.appendChild(li);
	});
}

async function openFolder(index) {
	await ipcRenderer.invoke("open-folder", index);
}

async function deleteFolder(index) {
	await ipcRenderer.invoke("delete-folder", index);
	loadFolders();
}

loadFolders(); // Load folders on startup
