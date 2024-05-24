import * as assert from 'assert';
import * as vscode from 'vscode';
import { startSession, joinSession } from '../../commands';
import { activate,deactivate } from '../../extension';
import * as sinon from 'sinon';
import Mocha from 'mocha';
suite('startSession test suite', () => {

    let showInputBoxStub: sinon.SinonStub<[options?: vscode.InputBoxOptions, token?: vscode.CancellationToken], Thenable<string>>;
    let updateWorkspaceFoldersStub: sinon.SinonStub<[start: number, deleteCount: number, ...workspaceFoldersToAdd: { readonly uri: vscode.Uri; readonly name?: string; }[]], boolean>;

    let sandbox: sinon.SinonSandbox;
    let contextMock: vscode.ExtensionContext;
    Mocha.beforeEach(() => {
        showInputBoxStub = sinon.stub(vscode.window, 'showInputBox');
        updateWorkspaceFoldersStub = sinon.stub(vscode.workspace, 'updateWorkspaceFolders');
        sandbox = sinon.createSandbox();
        contextMock = {
            subscriptions: [],
            workspaceState: sandbox.stub() as any,
            globalState: sandbox.stub() as any,
            secrets: sandbox.stub() as any,
            extensionUri: sandbox.stub() as any,
            extensionPath: sandbox.stub() as any,
            environmentVariableCollection: sandbox.stub() as any,
            extensionMode: sandbox.stub() as any,
            storagePath: sandbox.stub() as any,
            globalStoragePath: sandbox.stub() as any,
            logPath: sandbox.stub() as any,
            asAbsolutePath: sandbox.stub() as any,
            extension: sandbox.stub() as any,
            globalStorageUri: sandbox.stub() as any,
            logUri: sandbox.stub() as any,
            storageUri: sandbox.stub() as any,
        };

    });
    Mocha.afterEach(() => {
        sinon.restore();
        contextMock.subscriptions.forEach((value) => value.dispose());
    });
    Mocha.describe('Test for create session', () => {
        Mocha.it('should create a session and display session info', async () => {
            const expectedPort = "41112";
            activate(contextMock);
            showInputBoxStub.resolves(expectedPort);
            const workspaceFolder: vscode.WorkspaceFolder = {
                uri: vscode.Uri.file('./'),
                name: 'MyWorkspace',
                index: 0
            };
            updateWorkspaceFoldersStub.resolves([workspaceFolder]);
            await startSession();

            sinon.assert.calledOnce(showInputBoxStub);
            //call it with the expected arguments ,41131 is the default value
            sinon.assert.calledWithExactly(showInputBoxStub, { prompt: "请输入端口号", placeHolder: '41131' });
            deactivate();
        });
    });
});
