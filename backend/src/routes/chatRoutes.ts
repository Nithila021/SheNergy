import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple in-memory session store for prototype
interface ChatSessionState {
  id: string;
  customer_id?: string;
  vin?: string;
  pendingInventoryCheck?: {
    dealership_id: string;
    inventory_needed: string[];
    rankingPayload: any;
  };
}

const sessions = new Map<string, ChatSessionState>();
const router = Router();

// Helper to call our own backend endpoints
const BACKEND_BASE = process.env.BACKEND_INTERNAL_URL || 'http://localhost:5000/api';

// Gemini client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const chatModelId = 'gemini-1.5-pro';

async function generateReply(systemContext: string, userMessage: string): Promise<string> {
  if (!genAI) {
    // Fallback if API key is not configured
    return systemContext;
  }
  const model = genAI.getGenerativeModel({ model: chatModelId });
  const prompt = `${systemContext}\n\nUser: ${userMessage}\nAssistant (SheNergy, Bangalore):`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text || systemContext;
}

async function callPredictiveMaintenance(customer_id: string, vin: string) {
  const res = await axios.post(`${BACKEND_BASE}/predict-maintenance`, { customer_id, vin });
  return res.data;
}

async function callDealershipRanking(payload: {
  customer_id: string;
  vin: string;
  service_codes_requested: string[];
  coordinates?: { lat: number; lng: number };
}) {
  const res = await axios.post(`${BACKEND_BASE}/dealerships/rank`, payload);
  return res.data;
}

async function callInventoryCheck(payload: { dealership_id: string; inventory_needed: string[] }) {
  const res = await axios.post(`${BACKEND_BASE}/inventory/check`, payload);
  return res.data;
}

async function callAppointmentBook(payload: any) {
  const res = await axios.post(`${BACKEND_BASE}/appointments/book`, payload);
  return res.data;
}

router.post('/session', (req: Request, res: Response) => {
  const { customer_id, vin } = req.body as { customer_id?: string; vin?: string };
  const id = uuidv4();
  const state: ChatSessionState = { id, customer_id, vin };
  sessions.set(id, state);

  return res.status(201).json({
    session_id: id,
    message: 'Chat session created for SheNergy assistant in Bangalore.'
  });
});

router.post('/message', async (req: Request, res: Response) => {
  try {
    const { session_id, message, customer_id, vin } = req.body as {
      session_id?: string;
      message: string;
      customer_id?: string;
      vin?: string;
    };

    if (!message) {
      return res.status(400).json({ message: 'message is required' });
    }

    let session: ChatSessionState | undefined;
    if (session_id && sessions.has(session_id)) {
      session = sessions.get(session_id);
    } else {
      const id = uuidv4();
      session = { id, customer_id, vin };
      sessions.set(id, session);
    }

    // Update identifiers if provided
    if (customer_id) session!.customer_id = customer_id;
    if (vin) session!.vin = vin;

    const lowerMsg = message.toLowerCase();

    // Handle delay confirmation flow first
    if (session!.pendingInventoryCheck) {
      if (lowerMsg.includes('yes') || lowerMsg.includes('ok') || lowerMsg.includes('fine')) {
        // User accepts delay -> finalize appointment with inventory_ok: false (awaiting confirmation)
        const { dealership_id, inventory_needed, rankingPayload } = session!.pendingInventoryCheck;
        const bookPayload = {
          customer_id: session!.customer_id,
          vin: session!.vin,
          dealership_id,
          service_codes_requested: rankingPayload.service_codes_requested,
          requested_datetime: new Date().toISOString(),
          inventory_needed,
          inventory_ok: false,
          estimated_delay_minutes: 60
        };
        const booking = await callAppointmentBook(bookPayload);
        session!.pendingInventoryCheck = undefined;
        const reply = await generateReply(
          'You have accepted a delayed appointment due to parts shortage at a Bangalore dealership. Confirm this booking in friendly language.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          appointment: booking.appointment
        });
      }

      if (lowerMsg.includes('no')) {
        // User rejects delay -> re-run ranking (same payload)
        const { rankingPayload } = session!.pendingInventoryCheck;
        const ranking = await callDealershipRanking(rankingPayload);
        session!.pendingInventoryCheck = undefined;
        const reply = await generateReply(
          'The user is not okay with a delay due to parts shortage. Explain that you will not confirm the delayed slot and are suggesting alternative Bangalore dealerships based on ranking.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          rankings: ranking.rankings
        });
      }

      // If unclear, prompt again
      const reply = await generateReply(
        'Ask the user politely if they are okay with a delay in service due to parts availability in Bangalore. Request a clear YES or NO.',
        message
      );
      return res.status(200).json({
        session_id: session!.id,
        reply
      });
    }

    // If user describes issues, trigger predictive + ranking + inventory
    if (lowerMsg.includes('pickup') || lowerMsg.includes('brake') || lowerMsg.includes('clutch') || lowerMsg.includes('service')) {
      if (!session!.customer_id || !session!.vin) {
        const reply = await generateReply(
          'Ask the user to provide their registered customer ID and vehicle VIN so you can look up their Bangalore service history.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply
        });
      }

      const predictive = await callPredictiveMaintenance(session!.customer_id, session!.vin);
      const recommendedCodes = predictive.recommendations.map((r: any) => r.service_code);

      const rankingPayload = {
        customer_id: session!.customer_id,
        vin: session!.vin,
        service_codes_requested: recommendedCodes
      };
      const ranking = await callDealershipRanking(rankingPayload);
      const top = ranking.rankings[0];

      // For prototype, use a simple inventory_needed list derived from codes
      const inventory_needed = recommendedCodes.map((code: string) => {
        if (code.startsWith('PERIODIC')) return 'Engine Oil 5W30';
        if (code.startsWith('BRAKE')) return 'Brake Pads Front';
        if (code.startsWith('CLUTCH')) return 'Clutch Plate Assembly';
        return 'Engine Oil 5W30';
      });

      const inventoryResult = await callInventoryCheck({
        dealership_id: top.dealership_id,
        inventory_needed
      });

      if (!inventoryResult.inventory_ok) {
        session!.pendingInventoryCheck = {
          dealership_id: top.dealership_id,
          inventory_needed,
          rankingPayload
        };
        const reply = await generateReply(
          'Inform the user that some required parts are currently unavailable at the selected Bangalore dealership and ask if they are okay with a delay.',
          message
        );
        return res.status(200).json({
          session_id: session!.id,
          reply,
          selected_dealership: top
        });
      }

      // Inventory is ok, directly book a confirmed appointment
      const booking = await callAppointmentBook({
        customer_id: session!.customer_id,
        vin: session!.vin,
        dealership_id: top.dealership_id,
        service_codes_requested: recommendedCodes,
        requested_datetime: new Date().toISOString(),
        inventory_needed,
        inventory_ok: true,
        estimated_delay_minutes: top.estimated_delay_minutes || 0
      });

      const reply = await generateReply(
        'Explain to the user that based on their described issues and Bangalore driving pattern, you have recommended services, ranked nearby dealerships, and booked a confirmed appointment.',
        message
      );
      return res.status(200).json({
        session_id: session!.id,
        reply,
        recommendations: predictive.recommendations,
        rankings: ranking.rankings,
        appointment: booking.appointment
      });
    }

    // Default casual response
    const reply = await generateReply(
      'Introduce yourself as the SheNergy automotive assistant for Bangalore and invite the user to describe issues like pickup drop, brake spongy, or clutch hard so you can suggest services and book at a nearby service centre.',
      message
    );
    return res.status(200).json({
      session_id: session!.id,
      reply
    });
  } catch (err) {
    return res.status(500).json({ message: 'Chat handler error', error: (err as Error).message });
  }
});

export default router;
