import * as vscode from 'vscode';
import * as assert from 'assert';
import { joinSession } from '../../commands';
import { activate,deactivate } from '../../extension';
import * as sinon from 'sinon';
import Mocha from 'mocha';
import { FellowFS, File, Directory } from '../../fs/provider';



suite('FellowFS Test suite', () => {
    let fs: FellowFS;
    let uri: vscode.Uri;

    setup(() => {
        fs = new FellowFS();
        uri = vscode.Uri.parse('memfs:/test/');
        fs.createDirectory(uri);

    });

    test('Create directory', () => {
        const newDirUri = vscode.Uri.joinPath(uri, 'newDir');
        fs.createDirectory(newDirUri);
        const entry = fs.stat(uri);
        assert.strictEqual(entry.type, vscode.FileType.Directory);
    });
    test('Write and Read File', () => {
        const fileUri = vscode.Uri.parse('memfs:/test/file.txt');
        const content = Buffer.from('Hello World', 'utf8');
    
        fs.writeFile(fileUri, content, { create: true, overwrite: false });
    
        const readContent = fs.readFile(fileUri);
        assert.strictEqual(readContent.toString(), 'Hello World');
    });
    test('Rename File', () => {
        const oldUri = vscode.Uri.parse('memfs:/test/oldfile.txt');
        const newUri = vscode.Uri.parse('memfs:/test/newfile.txt');
        fs.writeFile(oldUri, Buffer.from('data'), { create: true, overwrite: false });
    
        fs.rename(oldUri, newUri, { overwrite: false });
        assert.throws(() => fs.stat(oldUri));  // old file should not exist
        const entry = fs.stat(newUri);
        assert.strictEqual(entry.type, vscode.FileType.File);
    });
    test('Delete File', () => {
        const fileUri = vscode.Uri.parse('memfs:/test/file.txt');
        fs.writeFile(fileUri, Buffer.from('data'), { create: true, overwrite: false });
    
        fs.delete(fileUri);
        assert.throws(() => fs.stat(fileUri));  // file should not exist
    });
});