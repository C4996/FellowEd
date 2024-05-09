import * as vscode from 'vscode';

 
export function msgHandler(msg: { command: any; text: any; }) {
    switch (msg.command) {
        case 'sendMessage':
            console.log('Received message:', msg.text);
            break;
        
    }
}