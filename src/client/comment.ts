import * as vscode from 'vscode';
import { SelectedContent, userComment, UserComment } from '../schema/userComments';
import assert from 'assert';

// 创建Comment类
class Comment {
    public userId: string;
    public comment: string;
    public fileId: string;
    public selected: SelectedContent;
    public createdAt: string;

    constructor(userComment: UserComment) {
        this.userId = userComment.userId;
        this.comment = userComment.comment;
        this.fileId = userComment.fileId;
        this.selected = userComment.selected;
        this.createdAt = userComment.createdAt;
    }
}

class CommentTreeDataProvider implements vscode.TreeDataProvider<Comment> {
    private _onDidChangeTreeData: vscode.EventEmitter<Comment | undefined | null | void> = new vscode.EventEmitter<Comment | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Comment | undefined | null | void> = this._onDidChangeTreeData.event;

    public comments: Comment[] = [];

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getChildren(element?: Comment): vscode.ProviderResult<Comment[]> {
        if (!element) {
            return this.comments;
        }
        return [];
    }

    getTreeItem(element: Comment): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.comment, vscode.TreeItemCollapsibleState.None);
        treeItem.description = `By ${element.userId} on ${element.createdAt}`;
        treeItem.contextValue = 'comment';
        return treeItem;
    }
}

let commentTreeDataProvider: CommentTreeDataProvider;

export function commentListActivate(context: vscode.ExtensionContext) {
    commentTreeDataProvider = new CommentTreeDataProvider();
    vscode.window.registerTreeDataProvider('commentList', commentTreeDataProvider);

    context.subscriptions.push(vscode.commands.registerCommand('commentList.refresh', () => {
        commentTreeDataProvider.refresh();
    }));

    // 示例
    addComments([
        {
            userId: "1",
            comment: "This is a great feature!",
            fileId: "file-uuid-1",
            selected: {
                fileId: "file-uuid-1",
                offset: 10,
                length: 5,
                userId: "1"
            },
            createdAt: (new Date()).toISOString(),
        },
        // ... 更多评论
    ]);
}

export function addComments(commentsData: UserComment[]) {
    assert(commentTreeDataProvider);
    commentsData.forEach(commentData => {
        commentTreeDataProvider.comments.push(new Comment(commentData));
    });

    commentTreeDataProvider.refresh();
}

export function deactivate() {}