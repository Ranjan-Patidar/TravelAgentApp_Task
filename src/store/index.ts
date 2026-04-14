import { create } from 'zustand';

export const STATUS_ORDER = [
  'Lead',
  'Assigned',
  'In Discussion',
  'Confirmed',
  'Payment Received',
  'Booking Started',
  'Trip Confirmed',
  'Cancelled',
] as const;

export type ClientStatus = typeof STATUS_ORDER[number];
export type PaymentType = 'Advance' | 'Full';

export interface StatusHistoryEntry {
  status: ClientStatus;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  destination: string;
  travelDates: string;
  travelersCount: number;
  leadSource: string;
  assignedAgent: string;
  confirmingAgent?: string;
  status: ClientStatus;
  statusHistory: StatusHistoryEntry[];
  totalCost: number;
  tripManager?: string;
  passportVerified?: boolean;
  hasInsurance?: boolean;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  description: string;
}

export interface Booking {
  id: string;
  clientId: string;
  type: 'Bus';
  name: string;
  details: string;
  cost: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  cancellationReason?: string;
  cancellationDate?: string;
  refundAmount?: number;
}

export interface Group {
  id: string;
  name: string;
  clientIds: string[];
}

export interface User {
  name: string;
  email: string;
}

interface AppState {
  clients: Client[];
  payments: Payment[];
  bookings: Booking[];
  groups: Group[];
  user: User | null;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  updateClientStatus: (id: string, status: ClientStatus) => void;
  addPayment: (payment: Payment) => void;
  addBooking: (booking: Booking) => void;
  confirmTrip: (clientId: string) => void;
  cancelBooking: (bookingId: string, reason: string, refundAmount: number) => void;
  setUser: (user: User | null) => void;
}

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getStatusOrder = (status: ClientStatus) => STATUS_ORDER.indexOf(status);

export const useStore = create<AppState>((set) => ({
  clients: [
    {
      id: 'c1',
      name: 'John Doe',
      contact: 'john@example.com',
      destination: 'Paris, France',
      travelDates: '10 Oct - 20 Oct',
      travelersCount: 2,
      leadSource: 'Website',
      assignedAgent: 'Agent A',
      status: 'In Discussion',
      statusHistory: [
        { status: 'Lead', date: '2026-03-22' },
        { status: 'Assigned', date: '2026-03-23' },
        { status: 'In Discussion', date: '2026-03-25' },
      ],
      totalCost: 5000,
      tripManager: 'Manager Bob',
      passportVerified: false,
      hasInsurance: true,
    },
    {
      id: 'c2',
      name: 'Jane Smith',
      contact: 'jane@example.com',
      destination: 'New York, USA',
      travelDates: '05 Nov - 10 Nov',
      travelersCount: 1,
      leadSource: 'Referral',
      assignedAgent: 'Agent B',
      confirmingAgent: 'Agent C',
      status: 'Payment Received',
      statusHistory: [
        { status: 'Lead', date: '2026-03-10' },
        { status: 'Assigned', date: '2026-03-11' },
        { status: 'In Discussion', date: '2026-03-13' },
        { status: 'Confirmed', date: '2026-03-15' },
        { status: 'Payment Received', date: '2026-03-18' },
      ],
      totalCost: 1500,
      passportVerified: true,
      hasInsurance: false,
    },
  ],
  payments: [
    {
      id: 'p1',
      clientId: 'c2',
      amount: 500,
      type: 'Advance',
      date: '2026-04-01',
      description: 'Initial Deposit',
    },
  ],
  bookings: [
    {
      id: 'b1',
      clientId: 'c2',
      type: 'Bus',
      name: 'Hilton New York',
      details: 'Deluxe Room / 05 Nov - 10 Nov',
      cost: 1200,
      status: 'Confirmed',
    },
  ],
  groups: [],
  user: null,
  addClient: (client) =>
    set((state) => ({
      clients: [
        ...state.clients,
        {
          ...client,
          status: 'Lead',
          statusHistory:
            client.statusHistory?.length > 0
              ? client.statusHistory
              : [{ status: 'Lead', date: getTodayDate() }],
        },
      ],
    })),
  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === client.id
          ? {
              ...c,
              ...client,
              statusHistory: client.statusHistory || c.statusHistory,
            }
          : c,
      ),
    })),
  updateClientStatus: (id: string, status: ClientStatus) =>
    set((state) => ({
      clients: state.clients.map((c) => {
        if (c.id !== id) {
          return c;
        }

        const hasHistory = c.statusHistory.some((h) => h.status === status);
        return {
          ...c,
          status,
          statusHistory: hasHistory
            ? c.statusHistory
            : [...c.statusHistory, { status, date: getTodayDate() }],
        };
      }),
    })),
  addPayment: (payment) =>
    set((state) => {
      const nextPayments = [...state.payments, payment];
      const client = state.clients.find((c) => c.id === payment.clientId);
      const updatedClients = state.clients.map((c) => {
        if (c.id !== payment.clientId || !client) return c;

        const shouldMarkPayment =
          getStatusOrder(c.status) >= getStatusOrder('Confirmed') &&
          getStatusOrder(c.status) < getStatusOrder('Payment Received');

        if (!shouldMarkPayment) return c;

        return {
          ...c,
          status: 'Payment Received' as ClientStatus,
          statusHistory: c.statusHistory.some((h) => h.status === 'Payment Received')
            ? c.statusHistory
            : [...c.statusHistory, { status: 'Payment Received' as ClientStatus, date: getTodayDate() }],
        } as Client;
      });

      return {
        payments: nextPayments,
        clients: updatedClients,
      };
    }),
  addBooking: (booking) =>
    set((state) => {
      const nextBookings = [...state.bookings, booking];
      const client = state.clients.find((c) => c.id === booking.clientId);
      const updatedClients = state.clients.map((c) => {
        if (c.id !== booking.clientId || !client) return c;

        const totalPaid = state.payments
          .filter((p) => p.clientId === c.id)
          .reduce((sum, p) => sum + p.amount, 0);

        const canStartBooking =
          totalPaid >= c.totalCost &&
          getStatusOrder(c.status) >= getStatusOrder('Payment Received') &&
          getStatusOrder(c.status) < getStatusOrder('Booking Started');

        if (!canStartBooking) return c;

        return {
          ...c,
          status: 'Booking Started' as ClientStatus,
          statusHistory: c.statusHistory.some((h) => h.status === 'Booking Started')
            ? c.statusHistory
            : [...c.statusHistory, { status: 'Booking Started' as ClientStatus, date: getTodayDate() }],
        } as Client;
      });

      return {
        bookings: nextBookings,
        clients: updatedClients,
      };
    }),
  confirmTrip: (clientId) =>
    set((state) => {
      const client = state.clients.find((c) => c.id === clientId);
      if (!client) return state;

      const totalPaid = state.payments
        .filter((p) => p.clientId === clientId)
        .reduce((sum, p) => sum + p.amount, 0);

      if (totalPaid < client.totalCost) return state;

      return {
        clients: state.clients.map((c) => {
          if (c.id !== clientId) return c;

          return {
            ...c,
            status: 'Trip Confirmed',
            statusHistory: c.statusHistory.some((h) => h.status === 'Trip Confirmed')
              ? c.statusHistory
              : [...c.statusHistory, { status: 'Trip Confirmed', date: getTodayDate() }],
          };
        }),
      };
    }),
  cancelBooking: (bookingId: string, reason: string, refundAmount: number) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Cancelled',
              cancellationReason: reason,
              cancellationDate: getTodayDate(),
              refundAmount,
            }
          : b,
      ),
    })),
  setUser: (user) => set({ user }),
}));
