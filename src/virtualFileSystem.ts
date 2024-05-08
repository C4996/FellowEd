import * as vscode from 'vscode';

export const virtualFileSystemScheme = 'fellowed';
// TextEncoder 是全局可用的

export let  currentDirectory = '/root/workspace/';

export const virtualFileSystemProvider = new (class implements vscode.FileSystemProvider {
    watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[]; }): vscode.Disposable {
        return new vscode.Disposable(() => {});
    }
    createDirectory(uri: vscode.Uri): void {
        throw new Error('Method not implemented.');
    }
    readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(`readFile ${uri}`);
        return uint8Array;
    }
    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): void {
        throw new Error('Method not implemented.');
    }
    delete(uri: vscode.Uri, options: { recursive: boolean; }): void {
        throw new Error('Method not implemented.');
    }
    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void {
        throw new Error('Method not implemented.');
    }
    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            // 指定文件类型为普通文件
            type: vscode.FileType.File,
            // 模拟的文件大小
            size: 1024,
            // 创建时间戳
            ctime: Date.now(),
            // 修改时间戳
            mtime: Date.now(),
            // 自定义的使用权限（可选）
            // permissions?: number;
        };
    }
    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        throw new Error('Method not implemented.');
    }
    private readonly _onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._onDidChangeFile.event;
});

