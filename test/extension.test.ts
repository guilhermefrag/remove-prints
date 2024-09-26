import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const testCases = [
    { ext: 'js', logStatement: '', expected: '// This should remain\n' },
    { ext: 'py', logStatement: '', expected: '# This should remain\n\ndef hello_world():\n    return "Hello World"\n' },
    { ext: 'java', logStatement: '', expected: '// This should remain\n' },
    { ext: 'go', logStatement: '', expected: '// This should remain\n' },
    { ext: 'rs', logStatement: '', expected: '// This should remain\n' },
    { ext: 'cs', logStatement: '', expected: '// This should remain\n' },
    { ext: 'cpp', logStatement: '', expected: '// This should remain\n' },
    { ext: 'c', logStatement: '', expected: '// This should remain\n' },
    { ext: 'rb', logStatement: 'puts "Hello World"', expected: '# This should remain\n' },
    { ext: 'php', logStatement: '', expected: '// This should remain\n' },
];

function createTestFile(folderUri: vscode.Uri, ext: string, logStatement: string) {
    const testContent = `${logStatement}\n// This should remain\n`;
    const filePath = path.join(folderUri.fsPath, `test/test-files/testFile.${ext}`);
    fs.writeFileSync(filePath, testContent, 'utf-8');
    return filePath;
}

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    testCases.forEach(({ ext, logStatement, expected }) => {
        test(`Remove log statements from ${ext.toUpperCase()} files`, async () => {
            const folderUri = vscode.workspace.workspaceFolders?.[0].uri;
            if (folderUri) {
                const filePath = createTestFile(folderUri, ext, logStatement);

                await vscode.commands.executeCommand('extension.removeOutputMessage');

                const actual = fs.readFileSync(filePath, 'utf-8');
                assert.strictEqual(actual, expected, `Contents of testFile.${ext} do not match expected output.`);
            } else {
                assert.fail('No workspace folder found for testing.');
            }
        });
    });
});
