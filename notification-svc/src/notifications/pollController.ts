import { Server as SocketIOServer } from 'socket.io';

// Define the structure for the mock notification payload
interface PollNotification {
    type: 'poll';
    streamId: string;
    question: string;
    options: { id: number; text: string }[];
    expiresAt: number; // Unix timestamp
}

// Mock data for the multichoice question payload
const mockPollPayload: PollNotification = {
    type: 'poll',
    streamId: 'esports-grand-final-stream-1',
    question: 'Who will win the next round?',
    options: [
        { id: 1, text: 'Team Liquid' },
        { id: 2, text: 'Evil Geniuses' },
        { id: 3, text: 'Fnatic' },
    ],
    expiresAt: Math.floor(Date.now() / 1000) + 60, // Expires in 60 seconds
};

/**
 * Pushes the mock poll notification to all connected clients via Socket.io.
 * @param io The Socket.io server instance.
 * @returns The payload that was sent.
 */
export const pushPollNotification = (io: SocketIOServer): PollNotification => {
    const eventName = 'newPoll';
    
    // Emit the mock payload to all connected clients
    io.emit(eventName, mockPollPayload);
    
    console.log(`[📣 NOTIFY] Emitted event '${eventName}' to all ${io.engine.clientsCount} clients.`);
    
    return mockPollPayload;
};
