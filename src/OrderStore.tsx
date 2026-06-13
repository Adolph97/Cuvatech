import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Order {
  id: string;
  type: 'IT' | 'Print' | 'Marketing' | 'Branding' | 'Consultation' | 'Contact';
  customerName: string;
  customerEmail: string;
  status: 'Pending' | 'Reviewing' | 'Provisioned' | 'Completed';
  details: any;
  createdAt: string;
  notifications: string[];
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'notifications'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addNotification: (id: string, message: string) => void;
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'notifications'>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
      }
    } catch (err) {
      console.error("Error adding order:", err);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const addNotification = async (id: string, message: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
      }
    } catch (err) {
      console.error("Error adding notification:", err);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, addNotification, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
