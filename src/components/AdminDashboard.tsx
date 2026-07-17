import React, { useState, useEffect } from 'react';
import { useOrders, Order } from '../OrderStore';
import {
  LayoutDashboard,
  Package,
  User,
  Mail,
  Clock,
  CheckCircle,
  Search,
  Bell,
  Settings,
  ShieldCheck,
  Server,
  Shirt,
  BarChart,
  LogOut,
  Sparkles,
  Lock,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Coins,
  Check,
  AlertCircle,
  FileText,
  Trash2,
  ChevronRight,
  StickyNote,
  Send,
  Image as ImageIcon,
  Download,
  ArrowUpRight,
  X,
  Edit2,
  Plus,
  Tag,
  Box,
  Layers,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductWeightPerUnitKg } from '../printingWeight';

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

// Status flow: Pending → Reviewing → Provisioned → Completed
const STATUS_FLOW: Order['status'][] = ['Pending', 'Reviewing', 'Provisioned', 'Completed'];

const getNextStatus = (current: Order['status']): Order['status'] | null => {
  const idx = STATUS_FLOW.indexOf(current);
  return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
};

export default function AdminDashboard() {
  const { orders, updateOrderStatus, addNotification, deleteOrder } = useOrders();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cuva_admin_token') === 'cuva_admin_secure_session_token';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab switching
  const [activeTab, setActiveTab] = useState<'Overview' | 'Customers' | 'Analytics' | 'Notifications' | 'Settings' | 'Products' | 'Graphics'>('Overview');

  // Products state
  const [products, setProducts] = useState<any[]>([]);

  // Uploads state (graphics library)
  const [uploads, setUploads] = useState<any[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [uploadSearch, setUploadSearch] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    id: '',
    label: '',
    description: '',
    basePrice: '',
    unitLabel: 'Units',
    minQty: '1',
    weightPerUnitKg: '0.2',
    category: 'printing',
    imageUrl: ''
  });
  const [productImageUploading, setProductImageUploading] = useState(false);
  const [productImageError, setProductImageError] = useState('');

  // Order selection / search
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Password visibility
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Note adding
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Image lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Provisioning
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provUsername, setProvUsername] = useState('');
  const [provPassword, setProvPassword] = useState('');
  const [provLink, setProvLink] = useState('https://cloud.cuvatech.com/login');

  // Settings state
  const [settings, setSettings] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    canvaApiKey: '',
    paymentMode: 'sandbox',
    deliveryFee: 35,
    premiumDeliveryFee: 45,
    minOrderWeightKg: 10,
    premiumClients: ['Jastel Water', 'Surjen Healthcare']
  });

  // Delivery settings state (separate for focused editing)
  const [deliverySettings, setDeliverySettings] = useState({
    deliveryFee: 35,
    premiumDeliveryFee: 45,
    minOrderWeightKg: 10,
    premiumClients: ['Jastel Water', 'Surjen Healthcare']
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: 'success' });

  // Status update loading
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load settings/products once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/settings')
        .then(res => res.json())
        .then(data => {
          setSettings(data);
          setDeliverySettings({
            deliveryFee: data.deliveryFee ?? 35,
            premiumDeliveryFee: data.premiumDeliveryFee ?? 45,
            minOrderWeightKg: data.minOrderWeightKg ?? 10,
            premiumClients: data.premiumClients || ['Jastel Water', 'Surjen Healthcare']
          });
        })
        .catch(err => console.error('Error loading settings:', err));

      // Load products
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error('Error loading products:', err));
    }
  }, [isAuthenticated]);

  // Load uploads when Graphics tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'Graphics') {
      setUploadsLoading(true);
      fetch('/api/uploads')
        .then(res => res.json())
        .then(data => setUploads(data))
        .catch(err => console.error('Error loading uploads:', err))
        .finally(() => setUploadsLoading(false));
    }
  }, [isAuthenticated, activeTab]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('cuva_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        const err = await res.json();
        setLoginError(err.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Server offline. Verify your backend endpoint.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cuva_admin_token');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // ── Product Management ───────────────────────────────────────────────────

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productForm.id,
          label: productForm.label,
          description: productForm.description,
          basePrice: Number(productForm.basePrice),
          unitLabel: productForm.unitLabel,
          minQty: Number(productForm.minQty),
          weightPerUnitKg: Number(productForm.weightPerUnitKg),
          category: productForm.category,
          imageUrl: productForm.imageUrl || undefined
        })
      });

      if (res.ok) {
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        setShowAddProduct(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add product');
      }
    } catch {
      alert('Error connecting to server');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: productForm.label,
          description: productForm.description,
          basePrice: Number(productForm.basePrice),
          unitLabel: productForm.unitLabel,
          minQty: Number(productForm.minQty),
          weightPerUnitKg: Number(productForm.weightPerUnitKg),
          category: productForm.category,
          imageUrl: productForm.imageUrl || undefined
        })
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(products.map((p: any) => p.id === editingProduct.id ? updatedProduct : p));
        setEditingProduct(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update product');
      }
    } catch {
      alert('Error connecting to server');
    }
  };

  const handleProductImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setProductImageError('Choose a PNG, JPG, GIF, SVG, or WebP image.');
      return;
    }

    setProductImageError('');
    setProductImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Image upload failed');
      setProductForm(current => ({ ...current, imageUrl: data.url }));
    } catch (error) {
      setProductImageError(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setProductImageUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(`Delete product ${id}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p: any) => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch {
      alert('Error connecting to server');
    }
  };

  // ── Settings ──────────────────────────────────────────────────────────────
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Integration settings saved successfully.');
      } else {
        alert('Failed to save settings.');
      }
    } catch {
      alert('Error connecting to backend settings.');
    }
  };

  // ── Delivery Settings ──────────────────────────────────────────────────
  const handleSaveDeliverySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryFee: deliverySettings.deliveryFee,
          premiumDeliveryFee: deliverySettings.premiumDeliveryFee,
          minOrderWeightKg: deliverySettings.minOrderWeightKg,
          premiumClients: deliverySettings.premiumClients
        })
      });
      if (res.ok) {
        const updatedSettings = await res.json();
        setSettings({ ...settings, ...updatedSettings });
        alert('Delivery settings saved successfully.');
      } else {
        alert('Failed to save delivery settings.');
      }
    } catch {
      alert('Error connecting to backend settings.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: 'success' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (res.ok) {
        setPasswordMessage({ text: 'Password updated successfully.', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        setPasswordMessage({ text: data.error || 'Failed to update password.', type: 'error' });
      }
    } catch {
      setPasswordMessage({ text: 'Error connecting to password service.', type: 'error' });
    }
  };

  // ── CRM Actions ───────────────────────────────────────────────────────────

  const handleStatusAdvance = async (order: Order) => {
    const next = getNextStatus(order.status);
    if (!next) return;
    setUpdatingStatus(true);
    await updateOrderStatus(order.id, next);
    setUpdatingStatus(false);
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id);
    setDeleteConfirmId(null);
    if (selectedOrderId === id) setSelectedOrderId(null);
  };

  const handleAddNote = async (orderId: string) => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      await fetch(`/api/orders/${orderId}/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText.trim() })
      });
      // Refresh via polling (OrderStore will pick it up in 5s) — force immediate
      await addNotification(orderId, `📝 Note: "${noteText.trim().substring(0, 80)}"`);
      setNoteText('');
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setAddingNote(false);
    }
  };

  // ── Provisioning ──────────────────────────────────────────────────────────

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789#@*';
    let pass = 'CUVA-';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3) pass += '-';
    }
    setProvPassword(pass);
  };

  const handleStartProvision = (order: Order) => {
    setIsProvisioning(true);
    setProvUsername(order.customerEmail);
    generateTempPassword();
  };

  const handleConfirmProvisioning = async (orderId: string) => {
    if (!provUsername || !provPassword || !provLink) {
      alert('Please fill all credential fields.');
      return;
    }

    await updateOrderStatus(orderId, 'Provisioned');
    await addNotification(orderId, `✅ Admin provisioned credentials — User: ${provUsername} | Link: ${provLink}`);

    setIsProvisioning(false);
    setProvUsername('');
    setProvPassword('');
    alert('Credentials provisioned & logged to audit trail.');
  };

  // ── Computed values ───────────────────────────────────────────────────────

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const filteredOrders = orders.filter(o => {
    const matchSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getOrderIcon = (type: Order['type']) => {
    switch (type) {
      case 'IT': return <Server className="w-4 h-4" />;
      case 'Print': return <Shirt className="w-4 h-4" />;
      case 'Branding': return <Sparkles className="w-4 h-4" />;
      case 'Marketing': return <BarChart className="w-4 h-4" />;
      case 'Consultation': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Reviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Provisioned': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Completed': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  const totalRevenue = orders
    .filter(o => o.type === 'Print' && o.details?.total)
    .reduce((sum, o) => sum + Number(o.details.total), 0);

  const itCount = orders.filter(o => o.type === 'IT').length;
  const printCount = orders.filter(o => o.type === 'Print').length;
  const brandingCount = orders.filter(o => o.type === 'Branding').length;
  const marketingCount = orders.filter(o => o.type === 'Marketing').length;
  const consultCount = orders.filter(o => o.type === 'Consultation').length;
  const contactCount = orders.filter(o => o.type === 'Contact').length;

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const reviewingCount = orders.filter(o => o.status === 'Reviewing').length;
  const provisionedCount = orders.filter(o => o.status === 'Provisioned').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  const uniqueCustomers = Array.from(new Set(orders.map(o => o.customerEmail))).map(email => {
    const customerOrders = orders.filter(o => o.customerEmail === email);
    const latestOrder = customerOrders[0];
    return {
      email,
      name: latestOrder.customerName,
      ordersCount: customerOrders.length,
      latestOrderDate: latestOrder.createdAt,
      status: latestOrder.status
    };
  });

  const systemNotifications = orders.flatMap(o =>
    o.notifications.map(note => ({
      orderId: o.id,
      customerName: o.customerName,
      type: o.type,
      message: note,
      createdAt: o.createdAt
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ── Image helpers ─────────────────────────────────────────────────────────

  const isImageFile = (url?: string, type?: string) => {
    if (!url) return false;
    if (url.startsWith('data:image/')) return true;
    if (type && type.startsWith('image/')) return true;
    const ext = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '');
  };

  const getOrderAttachment = (details: any) => {
    if (!details) return null;

    const url = details.fileUrl || details.logoUrl || details.designUrl || details.imageUrl || details.fileData;
    if (!url) return null;

    const dataUrlType = typeof url === 'string' && url.startsWith('data:')
      ? url.slice(5, url.indexOf(';'))
      : '';

    return {
      url,
      name: details.fileName || details.logoFile || details.designFile || details.imageFile || 'Attached design',
      type: details.fileType || details.logoType || dataUrlType,
      label: details.logoUrl ? 'Attached Logo File' : 'Attached Design File'
    };
  };

  const hiddenDetailKeys = new Set([
    'fileData',
    'fileName',
    'fileUrl',
    'fileType',
    'logoFile',
    'logoUrl',
    'logoType',
    'designFile',
    'designUrl',
    'imageFile',
    'imageUrl'
  ]);

  const selectedAttachment = selectedOrder ? getOrderAttachment(selectedOrder.details) : null;

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-sans text-charcoal relative px-4 select-none">
        <div className="absolute top-12 right-12 w-80 h-80 rounded-full bg-primary/10 blur-[90px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-primary/5 blur-[120px] mix-blend-multiply pointer-events-none -z-10 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-charcoal/5 p-12 rounded-[2.5rem] shadow-2xl shadow-charcoal/5 max-w-md w-full space-y-8 relative"
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto shadow-inner">
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                <defs>
                  <mask id="login-logo-cutout">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="28" y="24" width="14" height="52" rx="7" fill="black" />
                    <rect x="35" y="38" width="65" height="24" fill="black" />
                  </mask>
                </defs>
                <circle cx="50" cy="50" r="48" fill="currentColor" mask="url(#login-logo-cutout)" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">cuva tech.</h1>
            <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest leading-none">Administrative Credentials Guard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            {loginError && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-50 px-4 py-3 rounded-2xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-primary text-white w-full py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Unlocking...' : 'Unlock Console'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg flex font-sans text-charcoal antialiased">

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
            onClick={() => setLightboxUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {isImageFile(lightboxUrl) ? (
                <img src={lightboxUrl} alt="Design Upload" className="max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="font-bold text-charcoal mb-2">Document Preview</p>
                  <p className="text-sm text-charcoal/60">Click download below to view the file</p>
                </div>
              )}
              <button
                onClick={() => setLightboxUrl(null)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-xl hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5 text-charcoal" />
              </button>
              <a
                href={lightboxUrl}
                download
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-charcoal text-xs font-bold px-6 py-3 rounded-full shadow-xl flex items-center space-x-2 hover:bg-primary hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Original</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-charcoal/5 flex flex-col justify-between py-10 px-6 sticky top-0 h-screen">
        <div className="space-y-12">
          <div className="flex items-center space-x-3 px-2">
            <div className="bg-black p-2 border border-charcoal/5 rounded-xl shadow-sm flex items-center justify-center w-10 h-10">
              <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="none">
                <defs>
                  <mask id="sidebar-logo-cutout">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="28" y="24" width="14" height="52" rx="7" fill="black" />
                    <rect x="35" y="38" width="65" height="24" fill="black" />
                  </mask>
                </defs>
                <circle cx="50" cy="50" r="48" fill="currentColor" mask="url(#sidebar-logo-cutout)" />
              </svg>
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">cuva tech.</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'Overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'Customers', label: 'Customers', icon: <User className="w-4 h-4" /> },
              { id: 'Analytics', label: 'Analytics', icon: <BarChart className="w-4 h-4" /> },
              { id: 'Notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
              { id: 'Products', label: 'Products', icon: <Layers className="w-4 h-4" /> },
              { id: 'Graphics', label: 'Graphics', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'Settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSelectedOrderId(null);
                  setIsProvisioning(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === item.id ? 'bg-primary/10 text-primary shadow-sm' : 'text-charcoal/40 hover:bg-bg hover:text-charcoal'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'Notifications' && pendingCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Quick stats in sidebar */}
          <div className="bg-bg rounded-2xl p-4 space-y-3 text-xs font-bold">
            <span className="text-charcoal/30 uppercase tracking-widest text-[9px] block">Pipeline</span>
            {[
              { label: 'Pending', count: pendingCount, color: 'bg-amber-400' },
              { label: 'Reviewing', count: reviewingCount, color: 'bg-blue-400' },
              { label: 'Provisioned', count: provisionedCount, color: 'bg-emerald-400' },
              { label: 'Completed', count: completedCount, color: 'bg-gray-300' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-charcoal/60">{s.label}</span>
                </div>
                <span className="text-charcoal">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-charcoal/40 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Dashboard</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display text-3xl font-extrabold">
              {activeTab === 'Overview' && 'Active Docket Overview'}
              {activeTab === 'Customers' && 'Registered Customers'}
              {activeTab === 'Analytics' && 'System Analytics'}
              {activeTab === 'Notifications' && 'System Notification Logs'}
              {activeTab === 'Products' && 'Product Catalog Management'}
              {activeTab === 'Graphics' && 'Graphics Library'}
              {activeTab === 'Settings' && 'Console & Integration Settings'}
            </h1>
            <p className="font-sans text-sm text-charcoal/40 font-medium mt-1">
              {activeTab === 'Overview' && 'Real-time orders from Cuva landing page. Click an order to manage it.'}
              {activeTab === 'Customers' && 'Unique client registrations, order history and contract status.'}
              {activeTab === 'Analytics' && 'Aggregated revenue and service volume metrics.'}
              {activeTab === 'Notifications' && 'Complete audit trail of all system events.'}
              {activeTab === 'Products' && 'Add, edit, and remove products from the catalog.'}
              {activeTab === 'Graphics' && 'View and manage all uploaded logo and design files.'}
              {activeTab === 'Settings' && 'Update credentials, Stripe, PayPal and Canva API keys.'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-charcoal/20 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-charcoal/5 pl-11 pr-6 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-56 shadow-sm"
              />
            </div>
            <div
              onClick={() => setActiveTab('Notifications')}
              className="w-10 h-10 bg-white border border-charcoal/5 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-bg shadow-sm transition-all"
            >
              <Bell className="w-5 h-5 text-charcoal/40" />
              {pendingCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-bg rounded-full animate-bounce" />
              )}
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-charcoal/5 shadow-sm">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=E58B6D&color=fff" alt="Admin" />
            </div>
          </div>
        </header>

        {/* ── TAB: OVERVIEW ─────────────────────────────────────────────────── */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Orders Table */}
            <div className="lg:col-span-7 space-y-4">

              {/* Filter pills */}
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                {['All', 'Pending', 'Reviewing', 'Provisioned', 'Completed'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                      statusFilter === s
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white border-charcoal/10 text-charcoal/40 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-charcoal/5 rounded-[2.5rem] shadow-xl shadow-charcoal/5 overflow-hidden">
                <div className="p-6 border-b border-charcoal/5 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">Incoming Requests</h2>
                  <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-widest bg-bg px-3 py-1 rounded-full">
                    {filteredOrders.length} shown
                  </span>
                </div>

                <div className="divide-y divide-charcoal/5">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-charcoal/30 font-medium text-sm">No requests match the query parameters.</div>
                  ) : (
                    filteredOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className={`px-6 py-5 flex items-center space-x-4 cursor-pointer transition-all hover:bg-bg/50 group ${selectedOrderId === order.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setIsProvisioning(false);
                          setNoteText('');
                        }}
                      >
                        <div className={`p-2.5 rounded-xl ${selectedOrderId === order.id ? 'bg-primary/10 text-primary' : 'bg-bg text-charcoal/40'}`}>
                          {getOrderIcon(order.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-xs font-bold text-primary">{order.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <span className="font-bold text-sm text-charcoal block truncate">{order.customerName}</span>
                          <span className="text-[10px] text-charcoal/30 font-medium">{order.type} • {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Quick delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(order.id);
                            }}
                            className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${selectedOrderId === order.id ? 'text-primary' : 'text-charcoal/10'}`} />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Order Detail Panel */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                {selectedOrder ? (
                  <motion.div
                    key={selectedOrder.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white border border-charcoal/5 rounded-[2.5rem] shadow-2xl shadow-charcoal/5 p-8 space-y-6 sticky top-10"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                      <span className="font-mono text-xs font-bold text-charcoal/20">{selectedOrder.id}</span>
                    </div>

                    <div className="pb-4 border-b border-charcoal/5">
                      <h3 className="font-display text-2xl font-bold">{selectedOrder.customerName}</h3>
                      <p className="text-sm text-charcoal/40 font-medium mt-1">{selectedOrder.customerEmail}</p>
                      <p className="text-[10px] text-charcoal/20 font-bold uppercase tracking-widest mt-1">
                        {selectedOrder.type} • {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Status pipeline */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.2em] block">Status Pipeline</span>
                      <div className="flex items-center space-x-1">
                        {STATUS_FLOW.map((s, i) => {
                          const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status);
                          const isDone = i <= currentIdx;
                          const isCurrent = i === currentIdx;
                          return (
                            <React.Fragment key={s}>
                              <div className={`flex-1 text-center py-1.5 px-2 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${
                                isCurrent ? 'bg-primary text-white shadow-sm' :
                                isDone ? 'bg-primary/20 text-primary' : 'bg-bg text-charcoal/20'
                              }`}>
                                {s}
                              </div>
                              {i < STATUS_FLOW.length - 1 && (
                                <ChevronRight className={`w-3 h-3 shrink-0 ${isDone && i < currentIdx ? 'text-primary' : 'text-charcoal/10'}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* Attached image */}
                    {selectedAttachment && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.2em] block">{selectedAttachment.label}</span>
                        {isImageFile(selectedAttachment.url, selectedAttachment.type) ? (
                          <div
                            className="border border-charcoal/5 rounded-2xl overflow-hidden bg-bg cursor-pointer relative group shadow-inner"
                            onClick={() => setLightboxUrl(selectedAttachment.url)}
                          >
                            <img
                              src={selectedAttachment.url}
                              alt={selectedAttachment.name}
                              className="w-full max-h-48 object-contain p-2"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                              <div className="bg-white text-charcoal text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-2">
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>View Full Size</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <a
                            href={selectedAttachment.url}
                            download={selectedAttachment.name}
                            className="flex items-center space-x-4 border border-charcoal/5 bg-bg p-4 rounded-2xl hover:bg-white hover:border-primary/20 transition-all cursor-pointer group shadow-inner"
                          >
                            <div className="p-3 bg-white rounded-xl text-primary shadow-sm">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-charcoal truncate block">{selectedAttachment.name}</span>
                              <span className="text-[9px] text-charcoal/40 font-bold uppercase tracking-widest block mt-0.5">Click to download</span>
                            </div>
                            <Download className="w-4 h-4 text-charcoal/30 group-hover:text-primary transition-colors" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Specs */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.2em] block">Order Specifications</span>
                      <div className="bg-bg rounded-2xl p-4 space-y-3 max-h-[180px] overflow-y-auto">
                        {Object.entries(selectedOrder.details)
                          .filter(([key, value]) => !hiddenDetailKeys.has(key) && value !== '' && value !== null && value !== undefined)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start text-xs">
                              <span className="text-charcoal/40 font-bold uppercase tracking-widest mr-4 shrink-0">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <span className="text-charcoal font-bold text-right max-w-[160px] break-words">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Audit log */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.2em] block">Audit Log</span>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {selectedOrder.notifications.map((note, i) => (
                          <div key={i} className="flex items-start space-x-2 text-[10px] font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="text-charcoal/50 leading-relaxed">{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add note */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.2em] block">Add Admin Note</span>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Type a note..."
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(selectedOrder.id); }}
                          className="flex-1 bg-bg border-none px-4 py-3 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                        <button
                          onClick={() => handleAddNote(selectedOrder.id)}
                          disabled={addingNote || !noteText.trim()}
                          className="bg-primary text-white p-3 rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    {isProvisioning ? (
                      <div className="bg-bg rounded-3xl p-5 space-y-4 font-sans text-xs border border-primary/10">
                        <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-widest block">[Secure Provision Gate]</span>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest block ml-1">Username / ID</label>
                          <input
                            type="text"
                            value={provUsername}
                            onChange={(e) => setProvUsername(e.target.value)}
                            className="w-full bg-white border border-charcoal/5 px-4 py-3 rounded-xl text-xs outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest block ml-1">Temporary Password</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={provPassword}
                              onChange={(e) => setProvPassword(e.target.value)}
                              className="flex-1 bg-white border border-charcoal/5 px-4 py-3 rounded-xl text-xs font-mono outline-none"
                            />
                            <button
                              onClick={generateTempPassword}
                              className="bg-white border border-charcoal/5 p-3 rounded-xl hover:bg-primary/5 transition-all text-charcoal/50 cursor-pointer"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest block ml-1">Access URL</label>
                          <input
                            type="text"
                            value={provLink}
                            onChange={(e) => setProvLink(e.target.value)}
                            className="w-full bg-white border border-charcoal/5 px-4 py-3 rounded-xl text-xs outline-none"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => handleConfirmProvisioning(selectedOrder.id)}
                            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
                          >
                            Dispatch Details
                          </button>
                          <button
                            onClick={() => setIsProvisioning(false)}
                            className="bg-white border border-charcoal/5 px-4 py-3 rounded-xl text-xs text-charcoal/40 font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-charcoal/5 space-y-3">
                        {/* Advance status button */}
                        {getNextStatus(selectedOrder.status) && (
                          <button
                            onClick={() => handleStatusAdvance(selectedOrder)}
                            disabled={updatingStatus}
                            className="w-full bg-charcoal text-white py-4 rounded-2xl font-bold text-sm hover:bg-charcoal/80 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Move to {getNextStatus(selectedOrder.status)}</span>
                          </button>
                        )}

                        {/* Provision credentials */}
                        {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Reviewing') && (
                          <button
                            onClick={() => handleStartProvision(selectedOrder)}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Provision Credentials</span>
                          </button>
                        )}

                        {/* Contact client */}
                        <a
                          href={`mailto:${selectedOrder.customerEmail}`}
                          className="w-full bg-bg border border-charcoal/5 text-charcoal py-4 rounded-2xl font-bold text-sm hover:bg-white transition-all flex items-center justify-center space-x-3 cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Email Client</span>
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteConfirmId(selectedOrder.id)}
                          className="w-full bg-red-50 border border-red-100 text-red-500 py-4 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center space-x-3 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Order</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="bg-bg border border-charcoal/5 border-dashed rounded-[2.5rem] p-16 text-center space-y-6">
                    <div className="p-6 bg-white rounded-full inline-block shadow-sm">
                      <Package className="w-10 h-10 text-charcoal/10" />
                    </div>
                    <p className="font-sans text-sm text-charcoal/20 font-bold uppercase tracking-widest leading-relaxed">
                      Select an order<br />to manage it
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── TAB: CUSTOMERS ────────────────────────────────────────────────── */}
        {activeTab === 'Customers' && (
          <div className="bg-white border border-charcoal/5 rounded-[2.5rem] shadow-xl shadow-charcoal/5 overflow-hidden">
            <div className="p-8 border-b border-charcoal/5">
              <h2 className="font-display text-xl font-bold">Registered Clients ({uniqueCustomers.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] bg-bg/50">
                    <th className="px-8 py-5">Client Name</th>
                    <th className="px-8 py-5">Email</th>
                    <th className="px-8 py-5">Requests</th>
                    <th className="px-8 py-5">Latest</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5 text-sm font-sans">
                  {uniqueCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-charcoal/30 font-medium">No registrations yet.</td>
                    </tr>
                  ) : (
                    uniqueCustomers.map((cust, i) => (
                      <tr key={i} className="hover:bg-bg/50 transition-all">
                        <td className="px-8 py-6 font-bold">{cust.name}</td>
                        <td className="px-8 py-6 font-mono text-xs">{cust.email}</td>
                        <td className="px-8 py-6 font-bold">{cust.ordersCount}</td>
                        <td className="px-8 py-6 text-charcoal/40 font-mono text-xs">{new Date(cust.latestOrderDate).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(cust.status)}`}>
                            {cust.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <a
                            href={`mailto:${cust.email}`}
                            className="p-2.5 bg-bg rounded-xl hover:bg-primary/10 hover:text-primary transition-all inline-flex text-charcoal/40"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: ANALYTICS ───────────────────────────────────────────────── */}
        {activeTab === 'Analytics' && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Orders', val: orders.length, sub: 'All time submissions', icon: <Package className="w-5 h-5" /> },
                { label: 'Pending Queue', val: pendingCount, sub: 'Needs action', icon: <Clock className="w-5 h-5" /> },
                { label: 'Provisioned', val: provisionedCount, sub: 'Client portal active', icon: <CheckCircle className="w-5 h-5" /> },
                { label: 'Print Revenue', val: `$${totalRevenue.toFixed(2)}`, sub: 'SSL Gate checkout', icon: <Coins className="w-5 h-5" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-charcoal/5 rounded-3xl p-8 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">{stat.label}</span>
                    <div className="p-2 bg-primary/5 rounded-xl text-primary">{stat.icon}</div>
                  </div>
                  <h3 className="font-display text-4xl font-extrabold text-charcoal leading-none">{stat.val}</h3>
                  <p className="text-xs text-charcoal/40">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-charcoal/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <h3 className="font-display text-xl font-bold">Service Distribution</h3>
                <div className="space-y-4">
                  {[
                    { label: 'IT Cloud & Networks', count: itCount, color: 'bg-primary' },
                    { label: 'Print & Stationery', count: printCount, color: 'bg-orange-500' },
                    { label: 'Branding & Design', count: brandingCount, color: 'bg-purple-500' },
                    { label: 'Digital Marketing', count: marketingCount, color: 'bg-emerald-500' },
                    { label: 'Consultations', count: consultCount, color: 'bg-blue-500' },
                    { label: 'General Queries', count: contactCount, color: 'bg-gray-400' },
                  ].map((item, idx) => {
                    const pct = orders.length > 0 ? (item.count / orders.length) * 100 : 0;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-charcoal/60">{item.label}</span>
                          <span>{item.count} ({Math.round(pct)}%)</span>
                        </div>
                        <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`${item.color} h-full rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-charcoal/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <h3 className="font-display text-xl font-bold">Pipeline Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Pending', count: pendingCount, color: 'bg-amber-400' },
                    { label: 'Reviewing', count: reviewingCount, color: 'bg-blue-400' },
                    { label: 'Provisioned', count: provisionedCount, color: 'bg-emerald-400' },
                    { label: 'Completed', count: completedCount, color: 'bg-gray-400' },
                  ].map((item, idx) => {
                    const pct = orders.length > 0 ? (item.count / orders.length) * 100 : 0;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-charcoal/60">{item.label}</span>
                          <span>{item.count} ({Math.round(pct)}%)</span>
                        </div>
                        <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`${item.color} h-full rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-charcoal/5 pt-6 space-y-4">
                  <h4 className="text-sm font-bold text-charcoal/60">Payment Gateway</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-charcoal/40 font-bold">Status</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-widest ${settings.stripePublishableKey ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {settings.stripePublishableKey ? 'Live' : 'Simulation'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal/40 font-bold">Mode</span>
                      <span className="font-mono font-bold uppercase text-[10px]">{settings.paymentMode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: NOTIFICATIONS ───────────────────────────────────────────── */}
        {activeTab === 'Notifications' && (
          <div className="bg-white border border-charcoal/5 rounded-[2.5rem] shadow-xl shadow-charcoal/5 overflow-hidden">
            <div className="p-8 border-b border-charcoal/5">
              <h2 className="font-display text-xl font-bold">Audit Event Log ({systemNotifications.length})</h2>
            </div>
            <div className="p-8 space-y-4 max-h-[640px] overflow-y-auto">
              {systemNotifications.length === 0 ? (
                <div className="text-center py-12 text-charcoal/30 font-medium">No events logged yet.</div>
              ) : (
                systemNotifications.map((note, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-start justify-between border-b border-charcoal/5 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-charcoal">{note.message}</span>
                        <div className="flex items-center space-x-3 text-[10px] text-charcoal/40 font-bold uppercase tracking-wider">
                          <span>{note.customerName}</span>
                          <span>•</span>
                          <span className="font-mono text-primary">{note.orderId}</span>
                          <span>•</span>
                          <span>{note.type}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-charcoal/30 font-mono shrink-0 ml-4">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB: SETTINGS ─────────────────────────────────────────────────── */}
        {activeTab === 'Settings' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* API Keys */}
            <div className="bg-white border border-charcoal/5 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center space-x-3 border-b border-charcoal/5 pb-6">
                <div className="bg-primary/10 p-3 rounded-xl text-primary"><Key className="w-5 h-5" /></div>
                <h3 className="font-display text-xl font-bold">API Gateways</h3>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Stripe Publishable Key</label>
                  <input
                    type="text"
                    value={settings.stripePublishableKey}
                    onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                    placeholder="pk_test_..."
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Stripe Secret Key</label>
                  <div className="relative">
                    <input
                      type={showSecretKey ? 'text' : 'password'}
                      value={settings.stripeSecretKey}
                      onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                      placeholder="sk_test_••••••••"
                      className="w-full bg-bg border-none px-5 py-4 pr-12 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors cursor-pointer"
                    >
                      {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">PayPal Client ID</label>
                  <input
                    type="text"
                    value={settings.paypalClientId}
                    onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                    placeholder="client_id_..."
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Canva API Key</label>
                  <input
                    type="text"
                    value={settings.canvaApiKey}
                    onChange={(e) => setSettings({ ...settings, canvaApiKey: e.target.value })}
                    placeholder="canva_key_..."
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Payment Mode</label>
                  <select
                    value={settings.paymentMode}
                    onChange={(e) => setSettings({ ...settings, paymentMode: e.target.value })}
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold appearance-none"
                  >
                    <option value="sandbox">Sandbox / Simulated</option>
                    <option value="live">Live Production</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white w-full py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-4"
                >
                  Save Integrations
                </button>
              </form>
            </div>

            {/* Password */}
            <div className="bg-white border border-charcoal/5 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center space-x-3 border-b border-charcoal/5 pb-6">
                <div className="bg-primary/10 p-3 rounded-xl text-primary"><Lock className="w-5 h-5" /></div>
                <h3 className="font-display text-xl font-bold">Console Credentials</h3>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">
                      {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm[field as keyof typeof passwordForm]}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                ))}

                {passwordMessage.text && (
                  <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs font-semibold ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {passwordMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{passwordMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-primary text-white w-full py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-4"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Delivery Settings */}
            <div className="bg-white border border-charcoal/5 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center space-x-3 border-b border-charcoal/5 pb-6">
                <div className="bg-primary/10 p-3 rounded-xl text-primary"><Coins className="w-5 h-5" /></div>
                <h3 className="font-display text-xl font-bold">Delivery Fees</h3>
              </div>

              <form onSubmit={handleSaveDeliverySettings} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Standard Delivery Fee ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={deliverySettings.deliveryFee}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryFee: Number(e.target.value) })}
                    placeholder="35.00"
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Premium Delivery Fee ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={deliverySettings.premiumDeliveryFee}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, premiumDeliveryFee: Number(e.target.value) })}
                    placeholder="45.00"
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Min Order Weight (kg)</label>
                  <input
                    type="number"
                    required
                    min="0.001"
                    step="0.001"
                    value={deliverySettings.minOrderWeightKg}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, minOrderWeightKg: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest ml-1">Premium Clients</label>
                  <input
                    type="text"
                    value={deliverySettings.premiumClients.join(', ')}
                    onChange={(e) => setDeliverySettings({
                      ...deliverySettings,
                      premiumClients: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    })}
                    placeholder="Jastel Water, Surjen Healthcare"
                    className="w-full bg-bg border-none px-5 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                  />
                  <p className="text-[9px] text-charcoal/30 font-medium">Comma-separated client names for premium delivery rates</p>
                </div>

                <button
                type="submit"
                className="bg-primary text-white w-full py-5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-4"
              >
                Save Delivery Settings
              </button>
            </form>
        </div>

        </div>
        )}

        {/* ── TAB: PRODUCTS ───────────────────────────────────────────────────── */}
        {activeTab === 'Products' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl font-extrabold">Product Catalog</h1>
                <p className="font-sans text-sm text-charcoal/40 font-medium mt-1">
                  Manage printing products, pricing, and specifications.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddProduct(true);
                  setProductForm({
                    id: '',
                    label: '',
                    description: '',
                    basePrice: '',
                    unitLabel: 'Units',
                    minQty: '1',
                    weightPerUnitKg: '0.2',
                    category: 'printing',
                    imageUrl: ''
                  });
                  setProductImageError('');
                }}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 flex items-center space-x-2 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Product</span>
              </button>
            </div>

            <div className="bg-white border border-charcoal/5 rounded-[2.5rem] shadow-xl shadow-charcoal/5 overflow-hidden">
              <div className="p-8 border-b border-charcoal/5">
                <h2 className="font-display text-xl font-bold">Printing Products ({products.length})</h2>
              </div>

              {productsLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <span className="text-charcoal/40 font-medium">Loading products...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em] bg-bg/50">
                        <th className="px-6 py-4">Product ID</th>
                        <th className="px-6 py-4">Label</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Unit</th>
                        <th className="px-6 py-4">Min Qty</th>
                        <th className="px-6 py-4">Weight / Unit</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5 text-sm font-sans">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-charcoal/30 font-medium">No products found.</td>
                        </tr>
                      ) : (
                        products.map((product: any) => (
                          <tr key={product.id} className="hover:bg-bg/50 transition-all">
                            <td className="px-6 py-4 font-mono text-xs">{product.id}</td>
                            <td className="px-6 py-4 font-bold">{product.label}</td>
                            <td className="px-6 py-4 font-bold">${product.basePrice.toFixed(2)}</td>
                            <td className="px-6 py-4">{product.unitLabel}</td>
                            <td className="px-6 py-4">{product.minQty}</td>
                            <td className="px-6 py-4 font-bold">{getProductWeightPerUnitKg(product).toFixed(3)} kg</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setProductForm({
                                      id: product.id,
                                      label: product.label,
                                      description: product.description,
                                      basePrice: String(product.basePrice),
                                      unitLabel: product.unitLabel,
                                      minQty: String(product.minQty),
                                      weightPerUnitKg: String(getProductWeightPerUnitKg(product)),
                                      category: product.category,
                                      imageUrl: product.imageUrl || ''
                                    });
                                    setProductImageError('');
                                  }}
                                  className="p-2 rounded-lg bg-bg hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                  title="Edit product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: GRAPHICS LIBRARY ───────────────────────────────────────────── */}
        {activeTab === 'Graphics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl font-extrabold">Graphics Library</h1>
                <p className="font-sans text-sm text-charcoal/40 font-medium mt-1">
                  View and manage all uploaded logo and design files.
                </p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-charcoal/20 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search uploads..."
                  value={uploadSearch}
                  onChange={(e) => setUploadSearch(e.target.value)}
                  className="bg-white border border-charcoal/5 pl-11 pr-6 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-56 shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white border border-charcoal/5 rounded-[2.5rem] shadow-xl shadow-charcoal/5 overflow-hidden">
              <div className="p-8 border-b border-charcoal/5">
                <h2 className="font-display text-xl font-bold">Uploaded Files ({uploads.length})</h2>
              </div>

              {uploadsLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <span className="text-charcoal/40 font-medium">Loading graphics...</span>
                </div>
              ) : uploads.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="inline-block p-6 bg-primary/5 rounded-full mb-6">
                    <ImageIcon className="w-10 h-10 text-primary/40" />
                  </div>
                  <p className="font-sans text-charcoal/40 font-medium">No uploaded files yet. Upload images via the Canva Integration or Print Configurator.</p>
                </div>
              ) : (
                <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {uploads
                    .filter((u: any) => u.filename.toLowerCase().includes(uploadSearch.toLowerCase()))
                    .map((upload: any) => (
                      <div key={upload.filename} className="group bg-bg border border-charcoal/5 rounded-2xl p-4 hover:bg-white transition-all">
                        <div
                          onClick={() => setLightboxUrl(upload.url)}
                          className="aspect-square bg-white border border-charcoal/5 rounded-xl overflow-hidden cursor-pointer mb-3"
                        >
                          {upload.type.startsWith('image/') ? (
                            <img
                              src={upload.url}
                              alt={upload.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-8 h-8 text-charcoal/20" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-xs font-bold text-charcoal truncate" title={upload.filename}>
                            {upload.filename}
                          </p>
                          <p className="text-[9px] text-charcoal/30 font-bold">
                            {upload.sizeKB} KB • {new Date(upload.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm(`Delete ${upload.filename}?`)) {
                              try {
                                const res = await fetch(`/api/uploads/${upload.filename}`, { method: 'DELETE' });
                                if (res.ok) {
                                  setUploads(uploads.filter((u: any) => u.filename !== upload.filename));
                                }
                              } catch (err) {
                                alert('Failed to delete file');
                              }
                            }
                          }}
                          className="mt-2 w-full bg-red-50 text-red-500 py-1.5 rounded-lg text-[9px] font-bold hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        <AnimatePresence>
          {(showAddProduct || editingProduct) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
              onClick={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                    }}
                    className="p-2 rounded-full hover:bg-bg transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5 text-charcoal/40" />
                  </button>
                </div>

                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Product ID</label>
                      <input
                        type="text"
                        required
                        value={productForm.id}
                        onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                        disabled={!!editingProduct}
                        placeholder="e.g., custom-shirts"
                        className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none font-bold"
                      >
                        <option value="printing">Printing</option>
                        <option value="it">IT Services</option>
                        <option value="branding">Branding</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Label</label>
                    <input
                      type="text"
                      required
                      value={productForm.label}
                      onChange={(e) => setProductForm({ ...productForm, label: e.target.value })}
                      placeholder="Product name"
                      className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Product image</label>
                    <div className="flex items-center gap-4 rounded-xl bg-bg p-3">
                      {productForm.imageUrl ? (
                        <img
                          src={productForm.imageUrl}
                          alt="Product image preview"
                          className="h-16 w-16 rounded-lg border border-charcoal/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-charcoal/20 bg-white">
                          <ImageIcon className="w-5 h-5 text-charcoal/30" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-charcoal shadow-sm transition-colors hover:text-primary">
                          <UploadCloud className="w-4 h-4" />
                          <span>{productImageUploading ? 'Uploading...' : 'Upload image'}</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
                            disabled={productImageUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleProductImageUpload(file);
                              e.currentTarget.value = '';
                            }}
                            className="sr-only"
                          />
                        </label>
                        {productForm.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setProductForm(current => ({ ...current, imageUrl: '' }))}
                            className="ml-3 text-xs font-bold text-charcoal/50 hover:text-primary"
                          >
                            Use generic icon
                          </button>
                        )}
                        <p className="mt-1 text-[10px] text-charcoal/40">Optional. The generic icon appears when no image is assigned.</p>
                        {productImageError && <p role="alert" className="mt-1 text-[10px] font-bold text-red-500">{productImageError}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Description</label>
                    <textarea
                      rows={2}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Product description"
                      className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Price ($)</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        min="0.01"
                        value={productForm.basePrice}
                        onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                        placeholder="16.50"
                        className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Unit Label</label>
                      <input
                        type="text"
                        required
                        value={productForm.unitLabel}
                        onChange={(e) => setProductForm({ ...productForm, unitLabel: e.target.value })}
                        placeholder="Items"
                        className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Min Qty</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        value={productForm.minQty}
                        onChange={(e) => setProductForm({ ...productForm, minQty: e.target.value })}
                        placeholder="10"
                        className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="product-weight-per-unit" className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">Weight / Unit (kg)</label>
                      <input
                        id="product-weight-per-unit"
                        type="number"
                        required
                        min="0.001"
                        step="0.001"
                        value={productForm.weightPerUnitKg}
                        onChange={(e) => setProductForm({ ...productForm, weightPerUnitKg: e.target.value })}
                        placeholder="0.200"
                        className="w-full bg-bg border-none px-4 py-3 rounded-xl text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProduct(false);
                        setEditingProduct(null);
                      }}
                      className="bg-bg border border-charcoal/10 text-charcoal py-4 px-6 rounded-2xl font-bold text-sm hover:bg-white transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold">Delete Order?</h3>
                <p className="text-sm text-charcoal/40 font-medium leading-relaxed">
                  This will permanently remove order <span className="font-mono font-bold text-primary">{deleteConfirmId}</span> and any associated uploaded files. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteOrder(deleteConfirmId)}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-red-600 transition-all cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 bg-bg border border-charcoal/10 text-charcoal py-4 rounded-2xl font-bold text-sm hover:bg-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
