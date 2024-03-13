import {
  app,
  BrowserWindow,
  globalShortcut,
  Notification,
  clipboard,
  ipcMain,
} from "electron";
import path from "path";

import { keyboard, Key } from "@nut-tree/nut-js";
import { splitStream, sleep } from "./utils";

keyboard.config.autoDelayMs = 0;

let WEBUI_VERSION: string | null = null;
let models: object[] = [];

let selectedModel = "";
let config = {
  url: "",
  token: "",
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: "/src/assets/images/icon.png",
    width: 300,
    height: 180,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const updateConfig = async (_config) => {
  config = { ...config, ..._config };
  return config;
};

const typeWord = async (word: string) => {
  for (let i = 0; i < word.length; i++) {
    if (word[i] === "\n") {
      await keyboard.type(Key.Return);
    } else {
      await keyboard.type(word[i]);
    }
  }
};

const generateResponse = async (prompt: string) => {
  console.log("generateResponse");
  const res = await fetch(`${config.url}/ollama/api/chat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`,
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
    }),
  }).catch((err) => {
    console.log(err);
    return null;
  });

  if (res && res.ok) {
    const reader = res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(splitStream("\n"))
      .getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      try {
        let lines = value.split("\n");

        for (const line of lines) {
          if (line !== "") {
            console.log(line);
            let data = JSON.parse(line);

            if ("detail" in data) {
              throw data;
            }

            if ("id" in data) {
              console.log(data);
            } else {
              if (data.done == false) {
                await typeWord(data.message.content);
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
        break;
      }
    }
  }
};

const shortcutHandler = async () => {
  console.log("shortcutHandler");
  keyboard.config.autoDelayMs = 10;

  let i = 0;
  while (i !== 5) {
    if (process.platform !== "darwin") {
      await keyboard.type(Key.LeftControl, Key.C);
    } else {
      await keyboard.type(Key.LeftSuper, Key.C);
    }
    i++;
  }

  await sleep(100);

  const prompt = await clipboard.readText();
  console.log(prompt);

  if (config.url !== "" && config.token !== "" && selectedModel !== "") {
    keyboard.config.autoDelayMs = 0;

    await generateResponse(prompt);
  } else {
    keyboard.config.autoDelayMs = 100;

    console.log(config);
    await typeWord("Open WebUI URL/Token Required!");
  }
};

const getVersion = async () => {
  if (config.url) {
    const res = await fetch(`${config.url}/api/version`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        return res.json();
      })
      .catch((err) => {
        console.log(err);
        return null;
      });

    console.log(res);

    if (res) {
      WEBUI_VERSION = res.version;
    } else {
      WEBUI_VERSION = null;
    }
  } else {
    WEBUI_VERSION = null;
  }
};

const getModels = async () => {
  if (config.url) {
    const res = await fetch(`${config.url}/ollama/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        return res.json();
      })
      .catch((err) => {
        console.log(err);
        return null;
      });

    console.log(res);

    if (res) {
      return res.models;
    }
  }

  return null;
};

const selectModel = async (modelId) => {
  console.log(modelId);
  selectedModel = modelId;

  new Notification({
    title: "Open WebUI",
    body: `'${modelId}' selected.`,
  }).show();

  return selectedModel;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(() => {
    ipcMain.handle("check-connection", async (event, arg) => {
      await getVersion();
      return WEBUI_VERSION !== null;
    });

    ipcMain.handle("get-models", async (event, arg) => {
      models = await getModels();
      return models;
    });

    ipcMain.handle("select-model", async (event, modelId) => {
      return await selectModel(modelId);
    });

    ipcMain.handle("load-config", (event, arg) => {
      return config;
    });

    ipcMain.on("save-config", (event, data) => {
      console.log(data);
      updateConfig(data);
    });

    globalShortcut.register("Alt+CommandOrControl+O", shortcutHandler);
  })
  .then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
