# \[MO\] Setup VSCode

## Owner: [Yann Leflour](https://github.com/yleflour)

## Steps

### Installation

Download and Install [Vscode](https://code.visualstudio.com/)

### Base Setup

#### 1. The `code` command

* Hit `cmd+shift+p`
* Select `Shell Command: Install command 'code' in PATH`
* You are now able to launch `code <path>` in your terminal

#### 2. Base plugins

Open the plugins menu and install:

* ESLint _\(Dirk Baeumer\)_
* Flow Language Support _\(flowtype\)_
* npm Intellisense _\(Christian Kohler\)_
* Path Intellisense _\(Christian Kohler\)_
* Prettier _\(Esben Petersen\)_
* React Native Tools _\(Visual Studio Mobile Tools\)_
* Auto Close Tag _\(Jun Han\)_
* Git Lens _\(Eric Amodio\)_
* Jest _\(Orta\)_
* Color Highlight _\(Sergii Naumov\)_
* TSLint \(egamma\)

#### 3. Base preferences

* Hit `cmd+shift+p`
* Select `Preferences: Open User Settings`
* Add the following:

  ```javascript
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "files.insertFinalNewline": true,
  "flow.useNPMPackagedFlow": true,
  "workbench.iconTheme": "vs-seti",
  "files.associations": {
  "Fastfile": "ruby"
  }
  ```

#### 4. Usefull Project preferences

* Hit `cmd+shift+p`
* Select `Preferences: Open Workspace Settings`
* Add the following:
  * For a react project with Flow `"javascript.validate.enable": false`

