# 🛠️ Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- VS Code

### Setup

```bash
# Clone the repository
git clone https://github.com/theiliad/vscode-jsx-smart-copy
cd vscode-jsx-smart-copy

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch
```

### Building

```bash
# Compile for production
npm run compile

# Run linting
npm run lint
```

## 🧩 Supported Import Patterns

The extension recognizes various import patterns:

```javascript
// Named imports
import { Component, useState } from "react";

// Default imports
import React from "react";

// Namespace imports
import * as Utils from "./utils";

// Multi-line imports
import { Button, Modal, Input } from "antd";

// CommonJS requires
const { Component } = require("react");
```

## 🔧 Configuration

Currently, the extension works out of the box with no configuration needed. It automatically detects:

- JavaScript React files (`.jsx`)
- TypeScript React files (`.tsx`)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📋 Requirements

- VS Code ^1.97.0
- Files with `.jsx` or `.tsx` extensions

## 🐛 Known Issues

- Complex import patterns with aliases may not be detected
- Dynamic imports are not supported
- Imports must be at the top level of the file

## 🙏 Acknowledgment

- **🤖 AI-Powered Development**: This extension was primarily coded with AI assistance
