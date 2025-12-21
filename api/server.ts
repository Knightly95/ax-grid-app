import express, { Request, Response } from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const getEnergyOfferings = () => {
  try {
    const configPath = join(__dirname, 'config', 'energy-offerings.json');
    const data = readFileSync(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading energy offerings config:', error);
    throw error;
  }
};

const getOrders = () => {
  try {
    const ordersPath = join(__dirname, 'config', 'orders.json');
    const data = readFileSync(ordersPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading orders:', error);
    throw error;
  }
};

app.get('/api/energy-offerings', async (req: Request, res: Response) => {
  console.log('[REST API] GET /api/energy-offerings - Request received');
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const config = getEnergyOfferings();
    console.log('[REST API] GET /api/energy-offerings - Sending response with', Object.keys(config).length, 'keys');
    res.json(config);
  } catch (error) {
    console.error('[REST API] GET /api/energy-offerings - Error:', error);
    res.status(500).json({
      error: 'Failed to load energy offerings configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/orders', (req: Request, res: Response) => {
  try {
    const orders = getOrders();

    const { source, status } = req.query;
    let filteredOrders = orders;

    if (source) {
      filteredOrders = filteredOrders.filter((order: any) => order.source === source);
    }

    if (status) {
      filteredOrders = filteredOrders.filter((order: any) => order.status === status);
    }

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load orders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const orders = getOrders();
    const order = orders.find((o: any) => o.id === req.params.id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load order',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  REST API Server Running                                  ║`);
  console.log(`╠════════════════════════════════════════════════════════════╣`);
  console.log(`║  HTTP: http://localhost:${PORT}                                ║`);
  console.log(`╠════════════════════════════════════════════════════════════╣`);
  console.log(`║  Endpoints:                                                ║`);
  console.log(`║    GET  /api/orders            - Get all orders           ║`);
  console.log(`║    GET  /api/orders/:id        - Get order by ID          ║`);
  console.log(`║    GET  /api/energy-offerings  - Get configuration        ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
});
