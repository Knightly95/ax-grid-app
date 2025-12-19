import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WS_PORT = process.env.WS_PORT || 4001;
const TICK_MIN_MS = parseInt(process.env.TICK_MIN_MS || '10000', 10); // 10 seconds
const TICK_MAX_MS = parseInt(process.env.TICK_MAX_MS || '30000', 10); // 30 seconds
const OFFERS_FILE = join(__dirname, 'config', 'orders.json');

interface Offer {
  id: string;
  sourceType: 'solar' | 'gas';
  price: number;
  quantity: number;
  unit: string;
  status: 'pending' | 'processing' | 'active' | 'completed';
  vendor: string;
  location: string;
  createdAt: number;
  updatedAt: number;
}

interface Metrics {
  totalOffers: number;
  avgPrice: number;
  timestamp: number;
}

interface ConfirmOfferData {
  id: string;
}

const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

function readOffers(): Offer[] {
  try {
    if (!existsSync(OFFERS_FILE)) {
      writeOffers([]);
      return [];
    }
    const data = readFileSync(OFFERS_FILE, 'utf-8');
    return JSON.parse(data) as Offer[];
  } catch (error) {
    console.error('Error reading offers:', (error as Error).message);
    return [];
  }
}

function writeOffers(offers: Offer[]): void {
  try {
    writeFileSync(OFFERS_FILE, JSON.stringify(offers, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing offers:', (error as Error).message);
  }
}

function createRandomOffer(): Offer {
  const sourceTypes: Offer['sourceType'][] = ['solar', 'gas'];
  const vendors = [
    'Solaria West', 'GasCorp Iberia', 'EcoEnergy Ltd',
    'GreenGrid Spain', 'PowerFlow Systems', 'SolarTech Spain',
    'LNG Direct', 'EuroGas Pipeline'
  ];
  const locations = [
    'Seville, ES', 'Valencia, ES', 'Madrid, ES', 'Barcelona, ES',
    'Bilbao, ES', 'Zaragoza, ES', 'Málaga, ES'
  ];
  const statuses: Offer['status'][] = ['pending', 'processing', 'active'];

  const id = randomUUID();
  const sourceType = sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
  const price = Math.floor(Math.random() * 50) + 60;
  const quantity = Math.floor(Math.random() * 80) + 20;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const vendor = vendors[Math.floor(Math.random() * vendors.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const now = Date.now();

  return {
    id,
    sourceType,
    price,
    quantity,
    unit: 'MWh',
    status,
    vendor,
    location,
    createdAt: now,
    updatedAt: now
  };
}

function mutateOffer(offer: Offer): Offer {
  const mutations: Array<'price' | 'quantity' | 'status'> = ['price', 'quantity', 'status'];
  const mutation = mutations[Math.floor(Math.random() * mutations.length)];
  const mutated: Offer = { ...offer, updatedAt: Date.now() };

  switch (mutation) {
    case 'price':
      mutated.price = Math.max(50, mutated.price + (Math.random() > 0.5 ? 5 : -5));
      break;
    case 'quantity':
      mutated.quantity = Math.max(10, mutated.quantity + (Math.random() > 0.5 ? 10 : -10));
      break;
    case 'status': {
      const statuses: Offer['status'][] = ['pending', 'processing', 'active', 'completed'];
      const currentIndex = statuses.indexOf(mutated.status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      mutated.status = statuses[nextIndex];
      break;
    }
  }

  return mutated;
}

function calculateMetrics(offers: Offer[]): Omit<Metrics, 'timestamp'> {
  const totalOffers = offers.length;
  const avgPrice = totalOffers > 0
    ? Math.round(offers.reduce((sum, o) => sum + o.price, 0) / totalOffers)
    : 0;

  return { totalOffers, avgPrice };
}

function getRandomInterval(): number {
  return Math.floor(Math.random() * (TICK_MAX_MS - TICK_MIN_MS + 1)) + TICK_MIN_MS;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket: Socket) => {
  console.log(`[${new Date().toISOString()}] Client connected: ${socket.id}`);

  const offers = readOffers();
  socket.emit('offers:init', offers);

  socket.on('offers:list', () => {
    const offers = readOffers();
    socket.emit('offers:init', offers);
  });

  socket.on('offers:pending', (data: ConfirmOfferData) => {
    const { id } = data;
    const offers = readOffers();
    const offerIndex = offers.findIndex(o => o.id === id);

    if (offerIndex !== -1) {
      offers[offerIndex] = {
        ...offers[offerIndex],
        status: 'pending',
        updatedAt: Date.now()
      };
      writeOffers(offers);

      io.emit('offers:updated', offers[offerIndex]);
      console.log(`[${new Date().toISOString()}] Offer set to pending: ${id}`);
    } else {
      socket.emit('error', { message: 'Offer not found', id });
    }
  });

  socket.on('offers:processing', (data: ConfirmOfferData) => {
    const { id } = data;
    const offers = readOffers();
    const offerIndex = offers.findIndex(o => o.id === id);

    if (offerIndex !== -1) {
      offers[offerIndex] = {
        ...offers[offerIndex],
        status: 'processing',
        updatedAt: Date.now()
      };
      writeOffers(offers);

      io.emit('offers:updated', offers[offerIndex]);
      console.log(`[${new Date().toISOString()}] Offer set to processing: ${id}`);
    } else {
      socket.emit('error', { message: 'Offer not found', id });
    }
  });

  socket.on('offers:completed', (data: ConfirmOfferData) => {
    const { id } = data;
    const offers = readOffers();
    const offerIndex = offers.findIndex(o => o.id === id);

    if (offerIndex !== -1) {
      offers[offerIndex] = {
        ...offers[offerIndex],
        status: 'completed',
        updatedAt: Date.now()
      };
      writeOffers(offers);

      io.emit('offers:updated', offers[offerIndex]);
      console.log(`[${new Date().toISOString()}] Offer completed: ${id}`);
    } else {
      socket.emit('error', { message: 'Offer not found', id });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[${new Date().toISOString()}] Client disconnected: ${socket.id}`);
  });
});

function startRandomOperations() {
  function performRandomOperation() {
    const offers = readOffers();
    const operations = ['create', 'update', 'remove', 'metric'] as const;
    const weights = [3, 4, 1, 2];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const random = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    let selectedOperation: typeof operations[number] = operations[0];

    for (let i = 0; i < operations.length; i++) {
      cumulativeWeight += weights[i];
      if (random < cumulativeWeight) {
        selectedOperation = operations[i];
        break;
      }
    }

    switch (selectedOperation) {
      case 'create': {
        const newOffer = createRandomOffer();
        offers.push(newOffer);
        writeOffers(offers);
        io.emit('offers:created', newOffer);
        console.log(`[${new Date().toISOString()}] Created offer: ${newOffer.id}`);
        break;
      }

      case 'update': {
        if (offers.length > 0) {
          const randomIndex = Math.floor(Math.random() * offers.length);
          const updatedOffer = mutateOffer(offers[randomIndex]);
          offers[randomIndex] = updatedOffer;
          writeOffers(offers);
          io.emit('offers:updated', updatedOffer);
          console.log(`[${new Date().toISOString()}] Updated offer: ${updatedOffer.id}`);
        }
        break;
      }

      case 'remove': {
        if (offers.length > 5) {
          const randomIndex = Math.floor(Math.random() * offers.length);
          const removedOffer = offers.splice(randomIndex, 1)[0];
          writeOffers(offers);
          io.emit('offers:removed', { id: removedOffer.id });
          console.log(`[${new Date().toISOString()}] Removed offer: ${removedOffer.id}`);
        }
        break;
      }

      case 'metric': {
        const metrics = calculateMetrics(offers);
        const metricsWithTimestamp: Metrics = {
          ...metrics,
          timestamp: Date.now()
        };
        io.emit('ops:metric', metricsWithTimestamp);
        console.log(`[${new Date().toISOString()}] Metrics: ${metrics.totalOffers} offers, avg price: €${metrics.avgPrice}/MWh`);
        break;
      }
    }

    setTimeout(performRandomOperation, getRandomInterval());
  }

  setTimeout(performRandomOperation, getRandomInterval());
}

httpServer.listen(WS_PORT, () => {
  startRandomOperations();
});

process.on('SIGINT', () => {
  console.log('\n[SHUTDOWN] Closing Socket.IO server...');
  io.close(() => {
    httpServer.close(() => {
      console.log('[SHUTDOWN] Server closed gracefully');
      process.exit(0);
    });
  });
});
