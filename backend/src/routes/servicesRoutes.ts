import { Router, Request, Response } from 'express';
import { readJson } from '../utils/jsonStore';

interface ServiceMasterItem {
  service_code: string;
  name: string;
  description: string;
  average_time_minutes: number;
  categories: string[];
}

const router = Router();
const SERVICES_FILE = 'services_master.json';

router.get('/list', async (_req: Request, res: Response) => {
  try {
    const services = await readJson<ServiceMasterItem[]>(SERVICES_FILE, []);
    return res.status(200).json({ services });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load services', error: (err as Error).message });
  }
});

export default router;
