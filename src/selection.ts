import * as Y from 'yjs';
import * as vscode from 'vscode';
interface Selection {
    start: Y.RelativePosition;
    end: Y.RelativePosition;
    belongsTo: string;
    filePath: string;
}

interface VscodeSelection {
    start : vscode.Position;
    end : vscode.Position;
    belongsTo : string;
    filePath : string;
}


export function getActiveVscodeSelections() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        return null;
    }
    return editor.selections;
}

export function turnRelPosToVscodePos(relPos: Y.RelativePosition, doc: Y.Doc) {
    const absPos = Y.createAbsolutePositionFromRelativePosition(relPos, doc);
    if (absPos === null) {
        return null;
    }
    const yText = absPos.type as Y.Text;
    const textString = yText.toString();
    let line = 0, character = 0, passedChars = 0;
    for (let i = 0; i < absPos.index && i < textString.length; i++) {
        if (textString[i] === '\n') {
            line++;
            passedChars = i + 1;
        }
    }
    character = absPos.index - passedChars;
    return new vscode.Position(line, character);
}

export function turnVscodePosToRelPos(yText: Y.Text, pos: vscode.Position) {
    let offset = 0;
    let currentLine = 0;
    const textString = yText.toString();

    for (let i = 0; i < textString.length; i++) {
        if (textString[i] === '\n') {
            if (currentLine === pos.line) {
                break;
            }
            currentLine++;
            if (currentLine > pos.line) {
                // 超过了指定的行数，这说明位置有误
                return null;
            }
            continue;
        }

        if (currentLine === pos.line) {
            if (offset === pos.character) {
                break;
            }
            offset++;
        }
    }

    const absPos = new Y.AbsolutePosition(yText, offset);
    return Y.createRelativePositionFromTypeIndex(yText, offset);
}



export function getCurrentActiveSelection(text: Y.Text) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const curSelection = editor.selection;
    const start = turnVscodePosToRelPos(text, curSelection.start);
    const end = turnVscodePosToRelPos(text, curSelection.end);
    const belongsTo = vscode.env.machineId;
    const filePath = editor.document.uri.fsPath;
    console.log(`The ytext is ${text}`);
    return { start, end, belongsTo, filePath };
}


