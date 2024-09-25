import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function removeOutputMessageFromFile(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const patterns: { [key: string]: RegExp } = {
        js: /console\.log\(.*?\);?\s*/g,
        python: /print\(.*?\);?\s*/g,
        java: /System\.out\.println\(.*?\);?\s*/g,
        go: /fmt\.Println\(.*?\);?\s*/g,
        rust: /println!\(.*?\);?\s*/g,
        csharp: /Console\.WriteLine\(.*?\);?\s*/g,
        cpp: /std::cout <<.*?;\s*/g,
        c: /printf\(.*?\);?\s*/g,
        ruby: /puts\(.*?\);?\s*/g,
        php: /echo\s+.*?;\s*/g
    };

    let newContent = fileContent;
    
    for (const pattern of Object.values(patterns)) {
        newContent = newContent.replace(pattern, '');
    }

    
    if (fileContent !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        vscode.window.showInformationMessage(`Removed logs from ${filePath}`);
    }
}

function removeOutputMessageFromFolder(folderPath: string) {
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
        const fullPath = path.join(folderPath, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            removeOutputMessageFromFolder(fullPath);
        } else if (
            fullPath.endsWith('.js') || 
            fullPath.endsWith('.ts') || 
            fullPath.endsWith('.py') || 
            fullPath.endsWith('.java') ||
            fullPath.endsWith('.go') || 
            fullPath.endsWith('.rs') || 
            fullPath.endsWith('.cs') || 
            fullPath.endsWith('.cpp') || 
            fullPath.endsWith('.c') || 
            fullPath.endsWith('.rb') || 
            fullPath.endsWith('.php')
        ) {
            removeOutputMessageFromFile(fullPath);
        }
    });
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.removeOutputMessage', () => {
        const folderUri = vscode.workspace.workspaceFolders?.[0].uri;

        if (folderUri) {
            const folderPath = folderUri.fsPath;
            removeOutputMessageFromFolder(folderPath);
            vscode.window.showInformationMessage('All log statements have been removed!');
        } else {
            vscode.window.showErrorMessage('No workspace folder found');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
