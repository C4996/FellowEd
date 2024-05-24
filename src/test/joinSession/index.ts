import * as vscode from 'vscode';
import { joinSession } from '../../commands';
import { activate,deactivate } from '../../extension';
import * as sinon from 'sinon';
import Mocha from 'mocha';

suite('joinSession test suite', () => {
    let inputBoxStub: sinon.SinonStub<[options?: vscode.InputBoxOptions, token?: vscode.CancellationToken], Thenable<string>>;
    let sandbox: sinon.SinonSandbox;
    let contextMock: vscode.ExtensionContext;
    Mocha.beforeEach(() => {
        inputBoxStub = sinon.stub(vscode.window, 'showInputBox');
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

    Mocha.describe('Test for join session', () => {
        Mocha.it('should join a session and display session info', async () => {
            // const addr = "localhost";
            // const port = "41112";
            activate(contextMock);
            // inputBoxStub.resolves(addr);
            // inputBoxStub.resolves(port);
            // await joinSession();
            // sinon.assert.calledTwice(inputBoxStub);
            // sinon.assert.calledWithExactly(inputBoxStub, {
            //     prompt: "请输入地址",
            //     placeHolder: "localhost",
            // });
            // sinon.assert.calledWithExactly(inputBoxStub, {
            //     prompt: "请输入端口号",
            //     placeHolder: "41131",
            // });
            deactivate();
        });
    });
});