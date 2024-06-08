/* eslint-disable eqeqeq */
// @ts-nocheck
import * as Y from "yjs";
// const Y = require("yjs");
import * as vscode from "vscode";

// import mutex = require("lib0/mutex.js");
const mutex = require("lib0/mutex.js");
// import awareness = require("y-protocols/awareness.js");
const awareness = require("y-protocols/awareness.js");

class RelativeSelection {
  constructor(
    public start: Y.RelativePosition,
    public end: Y.RelativePosition,
    public direction: "backward" | "forward" | "none" = "forward"
  ) {}
}

const createRelativeSelection = (
  editor: vscode.TextEditor,
  vscModel: vscode.TextDocument,
  type: Y.Text
): null | RelativeSelection => {
  const sel = editor.selection;
  if (sel !== null) {
    const startPos = sel.start;
    const endPos = sel.end;
    const start = Y.createRelativePositionFromTypeIndex(
      type,
      vscModel.offsetAt(startPos)
    );
    const end = Y.createRelativePositionFromTypeIndex(
      type,
      vscModel.offsetAt(endPos)
    );
    return new RelativeSelection(start, end);
  }
  return null;
};

const createvscodeSelectionFromRelativeSelection = (
  editor: vscode.TextEditor,
  type: Y.Text,
  relSel: RelativeSelection,
  doc: Y.Doc
): null | vscode.Selection => {
  const start = Y.createAbsolutePositionFromRelativePosition(relSel.start, doc);
  const end = Y.createAbsolutePositionFromRelativePosition(relSel.end, doc);
  if (
    start !== null &&
    end !== null &&
    start.type === type &&
    end.type === type
  ) {
    const model = editor.document;
    const startPos = model.positionAt(start.index);
    const endPos = model.positionAt(end.index);
    return new vscode.Selection(
      startPos.line,
      startPos.character,
      endPos.line,
      endPos.character
    );
  }
  return null;
};

export class vscodeBinding {
  doc: Y.Doc;
  ytext: Y.Text;
  vscModel: vscode.TextDocument;
  window: typeof vscode.window;
  editors: Set<vscode.TextEditor>;
  mux: Function;
  private _savedSelections: Map<vscode.TextEditor, RelativeSelection>;
  private _beforeTransaction: any;
  private _decorations: Map<vscode.TextEditor, string[]>;
  private _rerenderDecorations: Function;
  private _ytextObserver: any;
  private _vscodeChangeHandler: vscode.Disposable;
  private _vscodeDisposeHandler: vscode.Disposable;
  awareness: Awareness | null;

  constructor(
    ytext: Y.Text,
    vscModel: vscode.TextDocument,
    editors: Set<vscode.TextEditor> = new Set(),
    awareness: Awareness | null = null
  ) {
    this.doc = /** @type {Y.Doc} */ ytext.doc;
    this.ytext = ytext;
    this.vscModel = vscModel;
    this.editors = editors;
    this.mux = createMutex();
    /**
     * @type {Map<vscode.TextEditor, RelativeSelection>}
     */
    this._savedSelections = new Map();
    this._beforeTransaction = () => {
      this.mux(() => {
        this._savedSelections = new Map();
        editors.forEach((editor) => {
          if (editor.document === vscModel) {
            const rsel = createRelativeSelection(editor, vscModel, ytext);
            if (rsel !== null) {
              this._savedSelections.set(editor, rsel);
            }
          }
        });
      });
    };
    this.doc.on("beforeAllTransactions", this._beforeTransaction);
    this._decorations = new Map();
    this._rerenderDecorations = () => {
      editors.forEach((editor) => {
        if (awareness && editor.document === vscModel) {
          // render decorations
          const currentDecorations = this._decorations.get(editor) || [];
          /**
           * @type {Array<vscode.editor.IModelDeltaDecoration>}
           */
          const newDecorations: Array<any> = [];
          awareness.getStates().forEach((state, clientID) => {
            if (
              clientID !== this.doc.clientID &&
              state.selection != null &&
              state.selection.anchor != null &&
              state.selection.head != null
            ) {
              const anchorAbs = Y.createAbsolutePositionFromRelativePosition(
                state.selection.anchor,
                this.doc
              );
              const headAbs = Y.createAbsolutePositionFromRelativePosition(
                state.selection.head,
                this.doc
              );
              if (
                anchorAbs !== null &&
                headAbs !== null &&
                anchorAbs.type === ytext &&
                headAbs.type === ytext
              ) {
                let start, end, afterContentClassName, beforeContentClassName;
                if (anchorAbs.index < headAbs.index) {
                  start = vscModel.positionAt(anchorAbs.index);
                  end = vscModel.positionAt(headAbs.index);
                  afterContentClassName =
                    "yRemoteSelectionHead yRemoteSelectionHead-" + clientID;
                  beforeContentClassName = null;
                } else {
                  start = vscModel.positionAt(headAbs.index);
                  end = vscModel.positionAt(anchorAbs.index);
                  afterContentClassName = null;
                  beforeContentClassName =
                    "yRemoteSelectionHead yRemoteSelectionHead-" + clientID;
                }
                newDecorations.push({
                  range: new vscode.Range(
                    start.line,
                    start.character,
                    end.line,
                    end.character
                  ),
                  options: {
                    className: "yRemoteSelection yRemoteSelection-" + clientID,
                    afterContentClassName,
                    beforeContentClassName,
                  },
                });
              }
            }
          });
          // this._decorations.set(
          //   editor,
          //   editor.setDecorations(currentDecorations, newDecorations)
          // );
          this._decorations.set(editor, newDecorations);
        } else {
          // ignore decorations
          this._decorations.delete(editor);
        }
      });
    };
    /**
     * @param {Y.YTextEvent} event
     */
    this._ytextObserver = (event: Y.YTextEvent) => {
      this.mux(() => {
        let index = 0;
        event.delta.forEach((op) => {
          if (op.retain !== undefined) {
            index += op.retain;
          } else if (op.insert !== undefined) {
            const pos = vscModel.positionAt(index);
            const range = new vscode.Selection(
              pos.line,
              pos.character,
              pos.line,
              pos.character
            );
            const insert = op.insert as string;
            // vscModel.applyEdits([{ range, text: insert }]);
            editors.forEach((editor) => {
              if (editor.document === vscModel) {
                editor.edit((editBuilder) => {
                  editBuilder.insert(range.start, insert);
                });
              }
            });
            index += insert.length;
          } else if (op.delete !== undefined) {
            const pos = vscModel.positionAt(index);
            const endPos = vscModel.positionAt(index + op.delete);
            const range = new vscode.Selection(
              pos.line,
              pos.character,
              endPos.line,
              endPos.character
            );
            // vscModel.applyEdits([{ range, text: "" }]);
            editors.forEach((editor) => {
              if (editor.document === vscModel) {
                editor.edit((editBuilder) => {
                  editBuilder.delete(range);
                });
              }
            });
          } else {
            throw Error("UnexpectedCase");
          }
        });
        this._savedSelections.forEach((rsel, editor) => {
          const sel = createvscodeSelectionFromRelativeSelection(
            editor,
            ytext,
            rsel,
            this.doc
          );
          if (sel !== null) {
            editor.selection = sel;
          }
        });
      });
      this._rerenderDecorations();
    };
    ytext.observe(this._ytextObserver);
    {
      const ytextValue = ytext.toString();
      if (vscModel.getText() !== ytextValue) {
        // vscModel.setText(ytextValue);
        editors.forEach((editor) => {
          if (editor.document === vscModel) {
            editor.edit((editBuilder) => {
              editBuilder.replace(
                new vscode.Range(
                  new vscode.Position(0, 0),
                  new vscode.Position(Number.MAX_VALUE, Number.MAX_VALUE)
                ),
                ytextValue
              );
            });
          }
        });
      }
    }
    this._vscodeChangeHandler = vscode.workspace.onDidChangeTextDocument(
      (event) => {
        // this._vscodeChangeHandler = vscModel.onDidChangeContent((event) => {
        // apply changes from right to left
        this.mux(() => {
          this.doc.transact(() => {
            [...event.contentChanges]
              .sort(
                (change1, change2) => change2.rangeOffset - change1.rangeOffset
              )
              .forEach((change) => {
                ytext.delete(change.rangeOffset, change.rangeLength);
                ytext.insert(change.rangeOffset, change.text);
              });
          }, this);
        });
      }
    );
    // this._vscodeDisposeHandler = vscModel.onWillDispose(() => {
    //   this.destroy();
    // });
    if (awareness) {
      this.window.onDidChangeTextEditorSelection((event) => {
        const editor = event.textEditor;
        if (editor.document === vscModel) {
          const sel = createRelativeSelection(editor, vscModel, ytext);
          if (sel !== null) {
            awareness.setLocalStateField("selection", {
              anchor: sel.start,
              head: sel.end,
            });
          }
        }
      });
      editors.forEach((editor) => {
        // editor.onDidChangeCursorSelection(() => {
        //   if (editor.document === vscModel) {
        //     const sel = editor.selection;
        //     if (sel === null) {
        //       return;
        //     }
        //     let anchor = vscModel.offsetAt(sel.start);
        //     let head = vscModel.offsetAt(sel.end);
        //     // if (sel.getDirection() === vscode.SelectionDirection.RTL) {
        //     //   const tmp = anchor;
        //     //   anchor = head;
        //     //   head = tmp;
        //     // }
        //     awareness.setLocalStateField("selection", {
        //       anchor: Y.createRelativePositionFromTypeIndex(ytext, anchor),
        //       head: Y.createRelativePositionFromTypeIndex(ytext, head),
        //     });
        //   }
        // });
        awareness.on("change", this._rerenderDecorations);
      });
      this.awareness = awareness;
    }
  }

  destroy() {
    this._vscodeChangeHandler.dispose();
    this._vscodeDisposeHandler.dispose();
    this.ytext.unobserve(this._ytextObserver);
    this.doc.off("beforeAllTransactions", this._beforeTransaction);
    if (this.awareness) {
      this.awareness.off("change", this._rerenderDecorations);
    }
  }
}
