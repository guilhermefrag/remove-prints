import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const testFiles = [
    { file: 'test/jsTestFile.js', expected: `// This line should remain\nconsole.log("This should stay.");\n` },
    { file: 'test/tsTestFile.ts', expected: `const testFunction = () => {\n};\ntestFunction();\n` },
    { file: 'test/pythonTestFile.py', expected: `print("Keep this line.")\n\n\ndef test_function():\n    \n    test_function()\n` },
    { file: 'test/javaTestFile.java', expected: `public class Test {\n    public static void main(String[] args) {\n        System.out.println("Keep this line.");\n\n        testMethod();\n    }\n\n    public static void testMethod() {\n    }\n}\n` }
];

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Remove log statements from files', async () => {
        // Get the workspace folder
        const folderUri = vscode.workspace.workspaceFolders?.[0].uri;

        if (folderUri) {
            // Run the command to remove logs
            await vscode.commands.executeCommand('extension.removeConsoleLogs');

            // Validate the contents of each test file
            for (const { file, expected } of testFiles) {
                const filePath = path.join(folderUri.fsPath, file);
                const actual = fs.readFileSync(filePath, 'utf-8');
                assert.strictEqual(actual, expected, `Contents of ${file} do not match expected output.`);
            }
        } else {
            assert.fail('No workspace folder found for testing.');
        }
    });
});
