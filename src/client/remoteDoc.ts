import * as vscode from 'vscode';

export class RemoteDocumentProvider implements vscode.TextDocumentContentProvider {
    // 定义虚拟文档的 URI 方案
    static readonly scheme = 'myvirtualdocument';

    // 存储虚拟文档的内容
    private _content: string = '';
    public set content(content: string) {
        this._content = content;
        const uri = this.getVirtualDocumentUri();
        // 通知 VSCode 更新虚拟文档的内容
        vscode.workspace.openTextDocument(uri).then(doc => {
            vscode.window.showTextDocument(doc, { preview: false });
        });
    }

    private _fileName: string;
    constructor(fileName: string, context: vscode.ExtensionContext) {
        const registration = vscode.workspace.registerTextDocumentContentProvider(RemoteDocumentProvider.scheme, this);
        this._fileName = fileName;
    }

    // 获取虚拟文档的 URI
    getVirtualDocumentUri(): vscode.Uri {
        return vscode.Uri.parse(`${RemoteDocumentProvider.scheme}://` + this._fileName);
    }

    provideTextDocumentContent(uri: vscode.Uri): string {
        // 当请求虚拟文档的内容时，返回存储的代码内容
        return this._content;
    }
}
