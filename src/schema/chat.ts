import { z } from 'zod';

export const message = z.object({
    messageId: z.string().uuid(), // 消息 uuid
    content: z.string(), // 消息内容
    belongsTo: z.string().uuid(), // 发送者 uuid
    replyTo: z.string().uuid().optional(), // （可选）对某条消息的回复
    time: z.string().datetime(),
});

export type Message = z.infer<typeof message>;

export const chat = z.object({
    messages: z.array(message),
    belongsTo: z.string().uuid(), // 工作区 uuid
});

export type Chat = z.infer<typeof chat>;
