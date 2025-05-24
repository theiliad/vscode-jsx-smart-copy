# JSX Smart Copy Paste ⚛️

<p align="center">
  <img src="./images/icon.png" alt="JSX Smart Copy Paste Logo" width="128" height="128">
</p>

A VS Code extension that intelligently copies JSX elements along with their required imports, making component reuse seamless across files.

## ✨ Features

- **Smart JSX Detection**: Automatically identifies JSX components in your selection
- **Import Resolution**: Finds and includes the necessary import statements
- **Multi-line Import Support**: Handles complex import structures correctly
- **Duplicate Prevention**: Avoids adding imports that already exist
- **TypeScript Ready**: Fully typed with TypeScript support

## 🚀 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for "JSX Smart Copy Paste"
4. Click Install

### From Source
```bash
git clone https://github.com/theiliad/vscode-jsx-smart-copy
cd vscode-jsx-smart-copy
npm install
npm run compile
```

## 📖 Usage

### Basic Workflow

1. **Select JSX content** in any `.jsx` or `.tsx` file
2. **Smart Copy** using `Cmd+Ctrl+C` (Mac) or `Ctrl+Alt+C` (Windows/Linux)
3. **Navigate to another file** where you want to use the components
4. **Smart Paste** using `Cmd+Ctrl+V` (Mac) or `Ctrl+Alt+V` (Windows/Linux)

The extension will automatically:
- Copy your selected JSX
- Find all component imports needed
- Paste the JSX at your cursor
- Add missing imports at the top of the file

### Example

**Source file:**
```jsx
import { Button, Modal } from 'antd';
import { UserIcon } from './icons';

// Select this JSX:
<Modal open={isOpen}>
  <Button icon={<UserIcon />}>
    Save User
  </Button>
</Modal>
```

**Target file (before paste):**
```jsx
import React from 'react';

function MyComponent() {
  return (
    <div>
      {/* Paste here */}
    </div>
  );
}
```

**Target file (after smart paste):**
```jsx
import React from 'react';
import { Button, Modal } from 'antd';
import { UserIcon } from './icons';

function MyComponent() {
  return (
    <div>
      <Modal open={isOpen}>
        <Button icon={<UserIcon />}>
          Save User
        </Button>
      </Modal>
    </div>
  );
}
```

## ⌨️ Keyboard Shortcuts

| Command | Mac | Windows/Linux | Description |
|---------|-----|---------------|-------------|
| Smart Copy | `Cmd+Ctrl+C` | `Ctrl+Alt+C` | Copy JSX with imports |
| Smart Paste | `Cmd+Ctrl+V` | `Ctrl+Alt+V` | Paste JSX with imports |

### Command Palette

You can also access commands via `Cmd+Shift+P` / `Ctrl+Shift+P`:
- `Smart Copy JSX with Imports`
- `Smart Paste JSX with Imports`

## 🛠️ Development
[Read Here](/DEV.md)

## 🙏 Acknowledgment

- **🤖 AI-Powered Development**: This extension was primarily coded with AI assistance
