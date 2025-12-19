# Energy Grid API

A minimal Node.js backend for simulating energy grid orders with both REST API and real-time WebSocket support.

## Overview

This API provides two types of order data:
- **Static orders** via REST API (read-only)
- **Real-time offers** via WebSocket (live updates every 10-30 seconds)

Both use the same unified data structure and support **Solar** and **Gas** energy sources.

## Project Structure

```
api/
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── server.ts                # REST API server (port 3000)
├── socket-server.ts         # WebSocket server (port 4001)
└── config/
    ├── energy-offerings.json  # Form configuration for energy sources
    └── orders.json           # Static orders data (6 orders)
```

**Note:** Real-time offers are generated in-memory by the WebSocket server and are not persisted to disk.

## Installation

```bash
cd api
npm install
```

## Running the Servers

### Start both servers (recommended):
```bash
npm run dev:all
```

### Or start individually:
```bash
# REST API only (port 3000)
npm run dev

# WebSocket only (port 4001)
npm run ws:dev
```

## REST API Server (Port 3000)

### Endpoints

#### `GET /api/orders`
Returns all static orders.

**Query Parameters:**
- `source` - Filter by energy source (`solar` or `gas`)
- `status` - Filter by status (`pending`, `processing`, `active`, `completed`)

**Example:**
```bash
curl http://localhost:3000/api/orders?source=solar
```

#### `GET /api/orders/:id`
Get a specific order by UUID.

**Example:**
```bash
curl http://localhost:3000/api/orders/550e8400-e29b-41d4-a716-446655440001
```

#### `GET /api/energy-offerings`
Returns the form configuration for energy sources (solar and gas fields).

**Example:**
```bash
curl http://localhost:3000/api/energy-offerings
```

#### `GET /api/health`
Health check endpoint.

## WebSocket Server (Port 4001)

### Connection
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:4001');
```

### Server Events (broadcasts to all clients)

#### `offers:init`
Sent immediately on connection with current offers snapshot.
```javascript
socket.on('offers:init', (offers) => {
  console.log('Initial offers:', offers);
});
```

#### `offers:created`
Emitted when a new offer is added (every 10-30 seconds).
```javascript
socket.on('offers:created', (offer) => {
  console.log('New offer:', offer);
});
```

#### `offers:updated`
Emitted when an existing offer is modified (price/quantity/status).
```javascript
socket.on('offers:updated', (offer) => {
  console.log('Updated offer:', offer);
});
```

#### `offers:removed`
Emitted when an offer is removed.
```javascript
socket.on('offers:removed', ({ id }) => {
  console.log('Removed offer ID:', id);
});
```

#### `ops:metric`
Periodic metrics broadcast (totalOffers, avgPrice).
```javascript
socket.on('ops:metric', (metrics) => {
  console.log('Metrics:', metrics);
});
```

### Client Actions

#### `offers:list`
Request the current offers list.
```javascript
socket.emit('offers:list');
// Server responds with 'offers:init'
```

#### `offers:pending`
Set an offer status to 'pending'.
```javascript
socket.emit('offers:pending', { id: 'offer-uuid' });
// Server broadcasts 'offers:updated' to all clients
```

#### `offers:processing`
Set an offer status to 'processing'.
```javascript
socket.emit('offers:processing', { id: 'offer-uuid' });
// Server broadcasts 'offers:updated' to all clients
```

#### `offers:completed`
Mark an offer as completed (status → 'completed').
```javascript
socket.emit('offers:completed', { id: 'offer-uuid' });
// Server broadcasts 'offers:updated' to all clients
```

## Data Structure

### Order/Offer Schema
```typescript
{
  id: string;              // UUID
  sourceType: 'solar' | 'gas';
  price: number;           // EUR/MWh
  quantity: number;        // MWh
  unit: 'MWh';
  status: 'pending' | 'processing' | 'active' | 'completed';
  vendor: string;
  location: string;
  createdAt: number;       // Unix timestamp
  updatedAt: number;       // Unix timestamp
}
```
