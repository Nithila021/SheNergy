import { Router, Request, Response } from 'express';
import { readJson } from '../utils/jsonStore';

interface InventoryItem {
  part_name: string;
  quantity: number;
}

interface Dealership {
  dealership_id: string;
  inventory: InventoryItem[];
}

const router = Router();
const DEALERSHIPS_FILE = 'dealerships.json';

async function loadDealerships(): Promise<Dealership[]> {
  return readJson<Dealership[]>(DEALERSHIPS_FILE, []);
}

router.post('/check', async (req: Request, res: Response) => {
  try {
    const { dealership_id, inventory_needed } = req.body as {
      dealership_id: string;
      inventory_needed: string[]; // list of part_name labels
    };

    if (!dealership_id || !Array.isArray(inventory_needed)) {
      return res.status(400).json({ message: 'dealership_id and inventory_needed are required' });
    }

    const dealerships = await loadDealerships();
    const dealership = dealerships.find((d) => d.dealership_id === dealership_id);
    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    let allAvailable = true;
    for (const label of inventory_needed) {
      const item = dealership.inventory.find((i) => i.part_name === label);
      if (!item || item.quantity <= 0) {
        allAvailable = false;
        break;
      }
    }

    if (!allAvailable) {
      return res.status(200).json({
        inventory_ok: false,
        message: 'Some required parts are currently unavailable. Are you okay with a delay?'
      });
    }

    return res.status(200).json({ inventory_ok: true });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to check inventory', error: (err as Error).message });
  }
});

export default router;
