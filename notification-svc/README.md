# Notification Service

Real-time notification service for the eSports streaming platform using Node.js, TypeScript, and Socket.io.

## Features

- **WebSocket Connections**: Real-time bidirectional communication
- **Live Viewer Count**: Track and broadcast connected clients
- **Poll Notifications**: Push interactive polls to all viewers
- **Health Monitoring**: Service health and connection status

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Service information |
| GET | `/health` | Health check with connection count |
| POST | `/notify/poll` | Trigger poll notification to all clients |

## WebSocket Events

### Client → Server
- `connection` - Client connects
- `disconnect` - Client disconnects

### Server → Client
- `viewerCount` - Current viewer count update
- `newPoll` - New poll notification

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd notification-svc
npm install
```

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Testing WebSocket Connection

You can test the WebSocket connection using a simple HTML client or tools like Postman WebSocket client.

### Example Client Connection
```javascript
const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log('Connected to notification service');
});

socket.on('viewerCount', (data) => {
    console.log('Viewer count:', data.count);
});

socket.on('newPoll', (poll) => {
    console.log('New poll:', poll);
});
```

## Poll Notification Format

```json
{
    "type": "poll",
    "streamId": "esports-grand-final-stream-1",
    "question": "Who will win the next round?",
    "options": [
        { "id": 1, "text": "Team Liquid" },
        { "id": 2, "text": "Evil Geniuses" },
        { "id": 3, "text": "Fnatic" }
    ],
    "expiresAt": 1699123456
}
```
