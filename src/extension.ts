// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

interface CopiedData {
  jsx: string;
  imports: string[];
  components: string[];
}

let copiedData: CopiedData | null = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register the smart copy command
  const copyCommand = vscode.commands.registerCommand(
    "jsx-smart-copy.copy",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      // Find JSX components in selected text
      const components = extractJSXComponents(selectedText);

      if (components.length === 0) {
        vscode.window.showWarningMessage(
          "No JSX components found in selection"
        );
        return;
      }

      // Find imports for these components
      const imports = await findImportsForComponents(
        editor.document,
        components
      );

      copiedData = {
        jsx: selectedText,
        imports: imports,
        components: components,
      };

      vscode.window.showInformationMessage(
        `Copied ${
          components.length
        } component(s) with imports: ${components.join(", ")}`
      );
    }
  );

  // Register the smart paste command
  const pasteCommand = vscode.commands.registerCommand(
    "jsx-smart-copy.paste",
    async () => {
      if (!copiedData) {
        vscode.window.showWarningMessage("Nothing copied with smart copy");
        return;
      }

      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      await editor.edit((editBuilder) => {
        // Paste JSX at cursor position
        editBuilder.insert(editor.selection.active, copiedData!.jsx);

        // Add imports at the top (after existing imports)
        const importPosition = findImportInsertPosition(editor.document);
        const importsToAdd = filterNewImports(
          editor.document,
          copiedData!.imports
        );

        if (importsToAdd.length > 0) {
          const importText = importsToAdd.join("\n") + "\n";
          editBuilder.insert(importPosition, importText);
        }
      });

      vscode.window.showInformationMessage("Pasted JSX with imports");
    }
  );

  context.subscriptions.push(copyCommand, pasteCommand);
}

// Extract JSX component names from text
function extractJSXComponents(text: string): string[] {
  const componentRegex = /<([A-Z][A-Za-z0-9]*)/g;
  const components = new Set<string>();
  let match;

  while ((match = componentRegex.exec(text)) !== null) {
    components.add(match[1]);
  }

  return Array.from(components);
}

// Find import statements for given components
async function findImportsForComponents(
  document: vscode.TextDocument,
  components: string[]
): Promise<string[]> {
  const imports: string[] = [];
  const documentText = document.getText();

  for (const component of components) {
    // Look for various import patterns
    const patterns = [
      new RegExp(
        `import\\s+{[^}]*\\b${component}\\b[^}]*}\\s+from\\s+['"'][^'"]+['"]`,
        "g"
      ),
      new RegExp(`import\\s+${component}\\s+from\\s+['"'][^'"]+['"]`, "g"),
      new RegExp(
        `import\\s+\\*\\s+as\\s+\\w+\\s+from\\s+['"'][^'"]*${component.toLowerCase()}[^'"]*['"]`,
        "g"
      ),
    ];

    for (const pattern of patterns) {
      const matches = documentText.match(pattern);
      if (matches) {
        imports.push(...matches);
        break; // Found import for this component
      }
    }
  }

  return [...new Set(imports)]; // Remove duplicates
}

// Find where to insert imports (after existing imports)
function findImportInsertPosition(
  document: vscode.TextDocument
): vscode.Position {
  const text = document.getText();
  const lines = text.split("\n");

  let lastImportEndLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line starts an import
    if (line.startsWith("import ") || (line.startsWith("const ") && line.includes("require("))) {
      // Find the end of this import statement
      let importEndLine = i;
      
      // If the import doesn't end on the same line (no semicolon), find where it ends
      if (!line.includes(";")) {
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine.includes(";") || nextLine.includes("from ")) {
            importEndLine = j;
            break;
          }
          // If we hit a line that doesn't look like part of an import, stop
          if (nextLine && !nextLine.startsWith("}") && !nextLine.includes(",") && !nextLine.match(/^[A-Za-z_$][A-Za-z0-9_$]*,?$/)) {
            importEndLine = j - 1;
            break;
          }
        }
      }
      
      lastImportEndLine = importEndLine;
      i = importEndLine; // Skip to the end of this import
    } else if (line && !line.startsWith("//") && !line.startsWith("/*") && line !== "") {
      // Hit non-import, non-comment, non-empty code
      break;
    }
  }

  if (lastImportEndLine >= 0) {
    // Insert after the last import statement
    let insertLine = lastImportEndLine + 1;
    
    // Skip any empty lines or comments immediately after imports
    while (insertLine < lines.length) {
      const line = lines[insertLine].trim();
      if (line === "" || line.startsWith("//") || line.startsWith("/*")) {
        insertLine++;
      } else {
        break;
      }
    }
    
    return new vscode.Position(insertLine, 0);
  } else {
    // No imports found, insert at the top
    return new vscode.Position(0, 0);
  }
}

// Filter out imports that already exist
function filterNewImports(
  document: vscode.TextDocument,
  imports: string[]
): string[] {
  const existingText = document.getText();
  return imports.filter((imp: string) => !existingText.includes(imp.trim()));
}

// this method is called when your extension is deactivated
export function deactivate() {}
