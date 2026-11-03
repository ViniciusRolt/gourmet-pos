import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Utensils, Wine, ChevronRight, ArrowLeft, Check, 
  Users, LogOut, FileText, Trash2, AlertCircle, Package, Lock, BarChart3, X, RotateCcw 
} from 'lucide-react';

// --- CARDÁPIO COMPLETO ---
const MENU = {
  Comida: {
    Carnes: [
      { id: 'c1', name: 'Bife Acebolado', price: 35 },
      { id: 'c2', name: 'Bife à Milanesa', price: 38 },
      { id: 'c3', name: 'Picanha na Chapa', price: 65 }
    ],
    Frango: [
      { id: 'f1', name: 'Frango Grelhado', price: 28 },
      { id: 'f2', name: 'Frango a Passarinho', price: 32 },
      { id: 'f3', name: 'Strogonoff de Frango', price: 30 }
    ],
    Peixes: [
      { id: 'p1', name: 'Filé de Tilápia', price: 40 },
      { id: 'p2', name: 'Salmão Grelhado', price: 55 }
    ]
  },
  Bebidas: {
    Sucos: [
      { id: 's1', name: 'Suco de Laranja', price: 10 },
      { id: 's2', name: 'Limonada Suíça', price: 12 },
      { id: 's3', name: 'Suco de Abacaxi', price: 10 }
    ],
    Cervejas: [
      { id: 'b1', name: 'Heineken 600ml', price: 18 },
      { id: 'b2', name: 'Original 600ml', price: 15 },
      { id: 'b3', name: 'Chopp Pilsen', price: 12 }
    ],
    Refrigerantes: [
      { id: 'r1', name: 'Coca-Cola Lata', price: 8 },
      { id: 'r2', name: 'Guaraná Lata', price: 8 }
    ]
  }
};

// --- COMPONENTE DE NOTIFICAÇÃO ---
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map(toast => (
      <div key={toast.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white font-bold text-sm pointer-events-auto transition-all animate-fade-in-down ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
        {toast.type === 'error' && <AlertCircle size={18} />}
        {toast.type === 'success' && <Check size={18} />}
        {toast.type === 'info' && <AlertCircle size={18} />}
        <span>{toast.message}</span>
      </div>
    ))}
  </div>
);

// --- MAIN APP COMPONENT ---
export default function RestaurantApp() {
  const [appUser, setAppUser] = useState(null);
  
  // Estado Local (Simulando Banco de Dados para o Deploy Rápido)
  const [employees, setEmployees] = useState([
    { id: 'admin1', name: 'Dono (Admin)', role: 'admin', pin: '0000' },
    { id: 'waiter1', name: 'Lari (Garçom)', role: 'waiter', pin: '1234' },
    { id: 'waiter2', name: 'Gusta (Garçom)', role: 'waiter', pin: '5678' }
  ]);
  const [tables, setTables] = useState(
    Array.from({ length: 12 }, (_, i) => ({ id: `mesa_${i+1}`, number: i+1, status: 'free', currentOrder: null }))
  );
  const [sales, setSales] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState({});
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const updateTable = (tableId, newData) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, ...newData } : t));
  };

  const addSale = (saleData) => setSales(prev => [...prev, saleData]);
  const addCancellation = (cancelData) => setCancellations(prev => [...prev, cancelData]);
  const toggleStock = (itemId, isOut) => setOutOfStockItems(prev => ({ ...prev, [itemId]: isOut }));

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-gray-100 overflow-hidden font-sans">
      <ToastContainer toasts={toasts} removeToast={id => setToasts(prev => prev.filter(t => t.id !== id))} />
      
      {!appUser ? (
        <LoginScreen employees={employees} onLogin={setAppUser} />
      ) : (
        <MainLayout appUser={appUser} onLogout={() => setAppUser(null)}>
          {appUser.role === 'admin' ? (
            <AdminDashboard 
              tables={tables} outOfStockItems={outOfStockItems} appUser={appUser} 
              addToast={addToast} sales={sales} cancellations={cancellations}
              updateTable={updateTable} addSale={addSale} addCancellation={addCancellation} toggleStock={toggleStock}
            />
          ) : (
            <WaiterDashboard 
              tables={tables} outOfStockItems={outOfStockItems} appUser={appUser} addToast={addToast}
              updateTable={updateTable} addCancellation={addCancellation}
            />
          )}
        </MainLayout>
      )}
    </div>
  );
}

// --- TELA DE LOGIN ---
function LoginScreen({ employees, onLogin }) {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleNumClick = (num) => pin.length < 4 && setPin(prev => prev + num);
  
  const handleLoginSubmit = () => {
    if (!selectedEmp) return;
    if (selectedEmp.pin === pin) onLogin(selectedEmp);
    else { setError('PIN Incorreto'); setPin(''); }
  };

  useEffect(() => { if (pin.length === 4 && selectedEmp) handleLoginSubmit(); }, [pin]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center rotate-3">
            <Utensils className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">GourmetPOS</h1>
        </div>

        {!selectedEmp ? (
          <div className="space-y-4">
            <p className="text-center font-bold text-gray-500 mb-6 uppercase text-sm tracking-wider">Selecione seu Perfil</p>
            {employees.map(emp => (
              <button key={emp.id} onClick={() => { setSelectedEmp(emp); setError(''); setPin(''); }} className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-colors">
                <span className="font-bold text-gray-800 text-lg flex items-center gap-3"><Users size={20} className="text-blue-500"/> {emp.name}</span>
                <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-lg text-gray-500 uppercase">{emp.role === 'admin' ? 'Administrador' : 'Garçom'}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-center font-bold text-gray-800 mb-1 text-xl">{selectedEmp.name}</p>
            <button onClick={() => { setSelectedEmp(null); setPin(''); setError(''); }} className="text-sm text-blue-600 font-bold mb-6 hover:underline">Trocar de Usuário</button>
            
            <div className="flex gap-3 mb-8">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-colors ${pin.length > idx ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-300'}`}>
                  {pin.length > idx ? '•' : ''}
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 font-bold mb-4 animate-bounce">{error}</p>}
            
            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} type="button" onClick={() => handleNumClick(num.toString())} className="p-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-black rounded-2xl text-2xl transition-colors">{num}</button>
              ))}
              <button type="button" onClick={() => setPin('')} className="p-4 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 font-bold rounded-2xl text-sm transition-colors uppercase">Limpar</button>
              <button type="button" onClick={() => handleNumClick('0')} className="p-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-black rounded-2xl text-2xl transition-colors">0</button>
              <button type="button" onClick={handleLoginSubmit} className="p-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl text-sm transition-colors uppercase shadow-lg shadow-blue-200">Entrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- LAYOUT PRINCIPAL ---
function MainLayout({ appUser, onLogout, children }) {
  return (
    <div className="flex-1 w-full flex flex-col relative overflow-hidden bg-gray-100">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-1.5 rounded-lg"><Utensils size={18} className="text-white"/></div>
          <div>
            <h1 className="font-black text-lg leading-tight">GourmetPOS</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{appUser.role === 'admin' ? 'Painel Gerencial' : 'Terminal Garçom'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors border border-gray-700">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-sm text-gray-200 leading-tight">{appUser.name}</p>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">{appUser.role}</p>
          </div>
          <LogOut size={18} className="text-red-400" />
        </button>
      </header>
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {children}
      </main>
    </div>
  );
}

// --- PAINEL DO GARÇOM ---
function WaiterDashboard({ appUser, tables, outOfStockItems, addToast, updateTable, addCancellation }) {
  const [activeTable, setActiveTable] = useState(null);

  if (activeTable) {
    return <TableOrderView 
      table={activeTable} appUser={appUser} onBack={() => setActiveTable(null)} 
      outOfStockItems={outOfStockItems} addToast={addToast} updateTable={updateTable} addCancellation={addCancellation}
    />;
  }

  const occupiedCount = tables.filter(t => t.status === 'occupied' || t.status === 'closing').length;
  const isHighOccupancy = tables.length > 0 && (occupiedCount / tables.length) > 0.7;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
      <h2 className="text-xl font-black text-gray-800 mb-4 px-2">Visão Geral do Salão</h2>
      
      {isHighOccupancy && (
        <div className="mb-6 bg-orange-100 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={20} />
          <p className="text-orange-800 text-sm font-bold leading-tight">Atenção: A casa está com mais de 70% de ocupação. Avise os clientes que os pedidos podem demorar um pouco mais!</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pb-20">
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => setActiveTable(table)}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm border-2 transition-all hover:scale-105 active:scale-95 ${
              table.status === 'closing' ? 'bg-red-50 border-red-500 text-red-700' 
              : table.status === 'occupied' ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
              : 'bg-white border-green-500 text-green-700 hover:bg-green-50'
            }`}
          >
            <span className="text-4xl font-black mb-2">{table.number}</span>
            <span className={`text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
              table.status === 'closing' ? 'bg-red-200' : table.status === 'occupied' ? 'bg-yellow-200' : 'bg-green-100'
            }`}>
              {table.status === 'closing' ? 'Fechamento' : table.status === 'occupied' ? 'Ocupada' : 'Livre'}
            </span>
            
            {(table.status === 'occupied' || table.status === 'closing') && table.currentOrder && (
               <div className="mt-3 bg-white/60 px-3 py-1 rounded-lg text-xs font-bold border border-black/5">
                 R$ {table.currentOrder.total.toFixed(2)}
               </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- PAINEL DO ADMIN ---
function AdminDashboard({ tables, outOfStockItems, appUser, addToast, sales, cancellations, updateTable, addSale, addCancellation, toggleStock }) {
  const [activeTab, setActiveTab] = useState('mesas');
  const [activeTable, setActiveTable] = useState(null);

  if (activeTable) {
    return <TableOrderView 
      table={activeTable} appUser={appUser} onBack={() => setActiveTable(null)} 
      outOfStockItems={outOfStockItems} addToast={addToast} 
      updateTable={updateTable} addCancellation={addCancellation} addSale={addSale}
    />;
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOf3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).getTime();
  const startOf1Year = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime();

  const safeSales = Array.isArray(sales) ? sales : [];
  const safeCancellations = Array.isArray(cancellations) ? cancellations : [];

  const salesToday = safeSales.filter(s => (s.timestamp || 0) >= startOfDay).reduce((acc, s) => acc + (s.amount || 0), 0);
  const sales3Months = safeSales.filter(s => (s.timestamp || 0) >= startOf3Months).reduce((acc, s) => acc + (s.amount || 0), 0);
  const salesYear = safeSales.filter(s => (s.timestamp || 0) >= startOf1Year).reduce((acc, s) => acc + (s.amount || 0), 0);
  const ticketMedio = safeSales.length > 0 ? (safeSales.reduce((acc, s) => acc + (s.amount || 0), 0) / safeSales.length) : 0;

  const statsPorGarcom = {};
  safeSales.forEach(sale => {
    if (sale.items && Array.isArray(sale.items)) {
      sale.items.forEach(item => {
        const wName = item.waiterName || 'Desconhecido';
        if (!statsPorGarcom[wName]) statsPorGarcom[wName] = { vendas: 0, cancelamentos: 0 };
        statsPorGarcom[wName].vendas += (item.price || 0);
      });
    }
  });

  safeCancellations.forEach(cancel => {
    const wName = cancel.waiterName || 'Desconhecido';
    if (!statsPorGarcom[wName]) statsPorGarcom[wName] = { vendas: 0, cancelamentos: 0 };
    statsPorGarcom[wName].cancelamentos += (cancel.price || 0);
  });

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden bg-gray-100">
      <div className="bg-gray-900 flex md:flex-col overflow-x-auto md:overflow-y-auto md:w-64 shrink-0 shadow-xl z-10 border-t border-gray-800 hide-scrollbar">
        <button onClick={() => setActiveTab('mesas')} className={`flex items-center gap-3 p-4 hover:bg-gray-800 font-bold whitespace-nowrap transition-colors ${activeTab === 'mesas' ? 'bg-gray-800 text-blue-400 md:border-l-4 border-b-4 md:border-b-0 border-blue-500' : 'text-gray-400'}`}>
          <Utensils size={20}/> Salão / Caixa
        </button>
        <button onClick={() => setActiveTab('crm')} className={`flex items-center gap-3 p-4 hover:bg-gray-800 font-bold whitespace-nowrap transition-colors ${activeTab === 'crm' ? 'bg-gray-800 text-blue-400 md:border-l-4 border-b-4 md:border-b-0 border-blue-500' : 'text-gray-400'}`}>
          <BarChart3 size={20}/> CRM & Metas
        </button>
        <button onClick={() => setActiveTab('estoque')} className={`flex items-center gap-3 p-4 hover:bg-gray-800 font-bold whitespace-nowrap transition-colors ${activeTab === 'estoque' ? 'bg-gray-800 text-blue-400 md:border-l-4 border-b-4 md:border-b-0 border-blue-500' : 'text-gray-400'}`}>
          <Package size={20}/> Estoque Rápido
        </button>
      </div>

      <div className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-y-auto">
        {activeTab === 'mesas' && (
          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-6">Controle do Salão e Caixa</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setActiveTable(table)}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm border-2 transition-transform hover:scale-105 active:scale-95 ${
                    table.status === 'closing' ? 'bg-red-50 border-red-500 text-red-700 animate-pulse' 
                      : table.status === 'occupied' ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                      : 'bg-white border-green-500 text-green-700'
                  }`}
                >
                  <span className="text-4xl font-black mb-2">{table.number}</span>
                  <span className={`text-[10px] sm:text-xs uppercase font-black px-3 py-1 rounded-full tracking-wider ${
                    table.status === 'closing' ? 'bg-red-200' : table.status === 'occupied' ? 'bg-yellow-200' : 'bg-green-100'
                  }`}>
                    {table.status === 'closing' ? 'Cobrar Conta' : table.status === 'occupied' ? 'Ocupada' : 'Livre'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-6">CRM & Faturamento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vendas Hoje</p>
                <p className="text-3xl font-black text-gray-900 mt-1">R$ {salesToday.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Últimos 3 Meses</p>
                <p className="text-3xl font-black text-gray-900 mt-1">R$ {sales3Months.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Último 1 Ano</p>
                <p className="text-3xl font-black text-gray-900 mt-1">R$ {salesYear.toFixed(2)}</p>
              </div>
              <div className="bg-blue-600 p-6 rounded-2xl shadow-md sm:col-span-3 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Ticket Médio por Mesa</p>
                  <p className="text-4xl font-black mt-1">R$ {ticketMedio.toFixed(2)}</p>
                </div>
                <BarChart3 size={48} className="text-blue-400 opacity-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-4">Desempenho Individual</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Equipe</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Vendas</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Cancelado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(statsPorGarcom).length === 0 && (
                        <tr><td colSpan="3" className="p-6 text-center text-gray-400 font-medium">Sem dados registrados hoje.</td></tr>
                      )}
                      {Object.entries(statsPorGarcom).map(([nome, stats]) => (
                        <tr key={nome} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="p-4 font-bold text-gray-800 flex items-center gap-2"><Users size={16} className="text-blue-500"/> {nome}</td>
                          <td className="p-4 text-green-600 font-black text-right">R$ {stats.vendas.toFixed(2)}</td>
                          <td className="p-4 text-red-500 font-bold text-right">R$ {stats.cancelamentos.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-800 mb-4">Auditoria de Cancelamentos</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-3 h-[300px] overflow-y-auto">
                  {safeCancellations.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 font-medium">Nenhum cancelamento.</div>
                  ) : (
                    safeCancellations.slice().reverse().map(c => (
                      <div key={c.id || Math.random()} className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <p className="font-black text-red-800">{c.itemName} <span className="text-red-600 font-bold ml-1">(R$ {(c.price || 0).toFixed(2)})</span></p>
                          <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-md border">{c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
                        </div>
                        <p className="text-sm text-gray-700 bg-white p-2 rounded-lg border border-red-50 font-medium"><span className="font-bold text-gray-500">Motivo:</span> "{c.reason || 'Não informado'}"</p>
                        <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-1"><Users size={12}/> Resp: {c.waiterName || 'Desconhecido'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estoque' && (
          <div className="max-w-3xl">
             <h2 className="text-2xl font-black text-gray-800 mb-6">Controle Rápido de Estoque</h2>
             <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8">
               {Object.keys(MENU).map(cat => (
                 <div key={cat} className="mb-8 last:mb-0">
                   <h3 className="font-black text-xl text-gray-800 border-b-2 border-gray-100 pb-2 mb-4 flex items-center gap-2">
                     {cat === 'Comida' ? <Utensils className="text-blue-500"/> : <Wine className="text-purple-500"/>} {cat}
                   </h3>
                   {Object.keys(MENU[cat]).map(sub => (
                     <div key={sub} className="mb-6 pl-0 sm:pl-4">
                       <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{sub}</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {MENU[cat][sub].map(prod => (
                           <div key={prod.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                             <span className="font-bold text-gray-800">{prod.name}</span>
                             <button
                               onClick={() => {
                                 const isOut = !outOfStockItems[prod.id];
                                 toggleStock(prod.id, isOut);
                                 addToast(isOut ? `${prod.name} esgotado` : `${prod.name} liberado`, isOut ? 'error' : 'success');
                               }}
                               className={`px-4 py-2 rounded-lg text-xs font-black transition-colors ${outOfStockItems[prod.id] ? 'bg-red-500 hover:bg-red-600 text-white shadow-inner' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
                             >
                               {outOfStockItems[prod.id] ? 'ESGOTADO' : 'DISPONÍVEL'}
                             </button>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- VISÃO DA MESA (PEDIDOS) ---
function TableOrderView({ table, appUser, onBack, outOfStockItems = {}, addToast, updateTable, addCancellation, addSale }) {
  const [menuPath, setMenuPath] = useState([]);
  const [localOrder, setLocalOrder] = useState(table.currentOrder ? { ...table.currentOrder } : { items: [], total: 0 });
  const [checkoutModal, setCheckoutModal] = useState(table.status === 'closing' && appUser.role === 'admin');
  const [cancelModalItem, setCancelModalItem] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const isClosing = table.status === 'closing';

  const getCurrentMenuLevel = () => {
    if (menuPath.length === 0) return Object.keys(MENU);
    if (menuPath.length === 1) return Object.keys(MENU[menuPath[0]]);
    if (menuPath.length === 2) return MENU[menuPath[0]][menuPath[1]];
    return [];
  };

  const handleMenuClick = (item) => {
    if (menuPath.length < 2) {
      setMenuPath([...menuPath, item]);
    } else {
      if (outOfStockItems[item.id]) return;
      const newItem = {
        ...item,
        orderItemId: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        status: 'pending',
        categoryGroup: menuPath[0],
        waiterId: appUser.id,
        waiterName: appUser.name,
        timestamp: Date.now()
      };
      setLocalOrder(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        total: prev.total + item.price
      }));
    }
  };

  const saveOrder = () => {
    const pendingItems = localOrder.items.filter(i => i.status === 'pending');
    if (pendingItems.length === 0) return;

    const updatedItems = localOrder.items.map(i => ({...i, status: 'sent'}));
    const newOrder = { ...localOrder, items: updatedItems };

    updateTable(table.id, { status: 'occupied', currentOrder: newOrder });
    setLocalOrder(newOrder);
    addToast(`${pendingItems.length} itens lançados na cozinha/copa!`, "success");
    setIsMobileSheetOpen(false);
  };

  const handleInitiateCancel = (item) => {
    if (item.status === 'pending') {
      const newItems = localOrder.items.filter(i => i.orderItemId !== item.orderItemId);
      const newTotal = newItems.reduce((acc, i) => acc + i.price, 0);
      setLocalOrder({ items: newItems, total: newTotal });
    } else {
      setCancelModalItem(item);
      setCancelReason('');
    }
  };

  const confirmCancelWithReason = () => {
    if (!cancelReason.trim()) {
      addToast("Digite o motivo do cancelamento!", "error");
      return;
    }

    const item = cancelModalItem;
    const newItems = localOrder.items.filter(i => i.orderItemId !== item.orderItemId);
    const newTotal = newItems.reduce((acc, i) => acc + i.price, 0);
    const newOrder = { items: newItems, total: newTotal };

    const nextTableStatus = newItems.length === 0 ? 'free' : (table.status === 'closing' ? 'closing' : 'occupied');
    const nextCurrentOrder = newItems.length === 0 ? null : newOrder;

    setLocalOrder(newOrder);
    updateTable(table.id, { status: nextTableStatus, currentOrder: nextCurrentOrder });

    addCancellation({
      id: Date.now().toString(),
      waiterName: appUser.name,
      itemName: item.name,
      price: item.price,
      reason: cancelReason,
      timestamp: Date.now()
    });

    addToast(`Item cancelado. Motivo registrado.`, "info");
    setCancelModalItem(null);
    setCancelReason('');
    
    if (nextTableStatus === 'free') onBack();
  };

  const confirmBillRequest = () => {
    updateTable(table.id, { status: 'closing', currentOrder: localOrder });
    addToast(`Mesa ${table.number} colocada em fechamento.`, "info");
    onBack();
  };

  const reopenTableAdmin = () => {
    updateTable(table.id, { status: 'occupied', currentOrder: localOrder });
    addToast(`Mesa ${table.number} reaberta para novos pedidos!`, "info");
    setCheckoutModal(false);
    onBack();
  };

  const finalizePaymentAdmin = () => {
    if (appUser.role !== 'admin') return;

    const totalComTaxa = localOrder.total * 1.1;

    addSale({
      id: Date.now().toString(),
      adminId: appUser.id,
      amount: totalComTaxa,
      subtotal: localOrder.total,
      tableNumber: table.number,
      items: localOrder.items,
      timestamp: Date.now()
    });

    updateTable(table.id, { status: 'free', currentOrder: null });
    addToast(`Pagamento R$ ${totalComTaxa.toFixed(2)} confirmado! Mesa Livre.`, "success");
    setCheckoutModal(false);
    onBack();
  };

  const pendingCount = localOrder.items.filter(i => i.status === 'pending').length;

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row bg-gray-50 relative overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-3 sm:p-4 bg-white border-b flex items-center gap-3 shadow-sm z-10 shrink-0">
          <button onClick={() => { if (menuPath.length > 0) setMenuPath(prev => prev.slice(0, -1)); else onBack(); }} className="p-2 sm:p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <ArrowLeft size={20} className="text-gray-700"/>
          </button>
          <div className="flex flex-col">
            <h2 className="font-black text-lg sm:text-xl text-gray-900 leading-tight">Mesa {table.number} {isClosing && <span className="text-red-500 text-sm ml-2">(Fechamento)</span>}</h2>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 font-bold mt-0.5">
              <button onClick={() => setMenuPath([])} className={menuPath.length === 0 ? 'text-blue-600' : 'hover:text-gray-800'}>Cardápio</button>
              {menuPath.map((path, idx) => (
                <React.Fragment key={path}>
                  <ChevronRight size={14} className="text-gray-400 mx-0.5" />
                  <button onClick={() => setMenuPath(menuPath.slice(0, idx + 1))} className={`truncate max-w-[80px] sm:max-w-none ${idx === menuPath.length - 1 ? 'text-blue-600' : 'hover:text-gray-800'}`}>{path}</button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-24 md:pb-10">
            {menuPath.length < 2 ? (
              getCurrentMenuLevel().map(cat => (
                <button
                  key={cat} disabled={isClosing && appUser.role !== 'admin'} onClick={() => handleMenuClick(cat)}
                  className={`bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-4 shadow-sm transition-all ${isClosing ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-1 active:translate-y-0'}`}
                >
                  <div className="p-4 bg-gray-50 rounded-full">
                    {cat === 'Comida' || cat === 'Carnes' || cat === 'Frango' || cat === 'Peixes' ? <Utensils size={36} className="text-blue-500" /> : <Wine size={36} className="text-purple-500" />}
                  </div>
                  <span className="font-black text-base sm:text-lg text-gray-800 uppercase tracking-wide">{cat}</span>
                </button>
              ))
            ) : (
              getCurrentMenuLevel().map(prod => {
                const isOutOfStock = outOfStockItems[prod.id];
                return (
                  <button
                    key={prod.id} disabled={isClosing || isOutOfStock} onClick={() => handleMenuClick(prod)}
                    className={`relative bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start justify-between h-32 sm:h-36 shadow-sm text-left transition-all ${isClosing || isOutOfStock ? 'opacity-50 bg-gray-100 cursor-not-allowed' : 'hover:border-green-500 hover:bg-green-50 active:scale-95'}`}
                  >
                    <span className="font-black text-gray-900 text-sm sm:text-base leading-tight line-clamp-2">{prod.name}</span>
                    <div className="flex flex-col mt-auto w-full">
                      <span className="text-green-600 font-black text-lg sm:text-xl">R$ {prod.price.toFixed(2)}</span>
                    </div>
                    {isOutOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center font-black text-red-600 bg-white/90 text-xs sm:text-sm uppercase tracking-widest rounded-xl border-2 border-red-300 transform -rotate-6 backdrop-blur-sm">ESGOTADO</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* OVERLAY ESCURO PARA CELULAR CUANDO A COMANDA ESTÁ ABERTA */}
      {isMobileSheetOpen && (
        <div 
          onClick={() => setIsMobileSheetOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden animate-fade-in backdrop-blur-xs"
        />
      )}

      {/* COMANDA COM GAVETA DESLIZANTE NO MOBILE */}
      <div className={`w-full md:w-96 bg-white flex flex-col fixed md:relative bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out md:translate-y-0 rounded-t-3xl md:rounded-none md:h-full shadow-[0_-10px_30px_rgba(0,0,0,0.2)] md:shadow-none ${
        isMobileSheetOpen ? 'h-[80vh] translate-y-0' : 'h-16 translate-y-0 md:h-full'
      }`}>
        {/* CABEÇALHO DA COMANDA (CLICÁVEL NO CELULAR PARA ABRIR/FECHAR) */}
        <div 
          onClick={() => setIsMobileSheetOpen(prev => !prev)}
          className="p-4 bg-gray-900 text-white flex justify-between items-center shrink-0 rounded-t-3xl md:rounded-none cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gray-600 rounded-full absolute top-2 left-1/2 -translate-x-1/2 md:hidden" />
            <FileText size={18} className="text-blue-400"/>
            <h3 className="font-black uppercase tracking-wider text-sm">Comanda</h3>
            {localOrder.items.length > 0 && (
              <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full ml-1">
                {localOrder.items.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/10 px-3 py-1.5 rounded-xl font-black text-lg">
              R$ {localOrder.total.toFixed(2)}
            </span>
            <button className="md:hidden text-gray-400 hover:text-white p-1">
              <ChevronRight size={20} className={`transform transition-transform ${isMobileSheetOpen ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </div>
        </div>
        
        {/* CORPO DA COMANDA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
           {localOrder.items.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 opacity-50 py-8">
               <FileText size={48} />
               <p className="font-bold text-sm">Comanda Vazia</p>
             </div>
           ) : (
             localOrder.items.map(item => (
                <div key={item.orderItemId} className={`bg-white p-3 sm:p-4 rounded-2xl border-2 shadow-sm flex flex-col transition-all ${item.status === 'pending' ? 'border-orange-300 bg-orange-50/50' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="font-black text-gray-900 text-sm sm:text-base leading-tight">{item.name}</p>
                      <p className="text-green-600 font-black text-sm mt-1">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleInitiateCancel(item); }} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl transition-colors" title="Cancelar Item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1"><Users size={12}/> {item.waiterName || 'N/A'}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-bold">{item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
                  </div>
                </div>
             ))
           )}
        </div>

        {/* RODAPÉ E BOTÕES DE AÇÃO */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe">
          {pendingCount > 0 ? (
            <button onClick={saveOrder} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all text-base sm:text-lg">
              <Check size={24} /> Lançar {pendingCount} Itens
            </button>
          ) : (
            <button 
              disabled={localOrder.items.length === 0 || (isClosing && appUser.role !== 'admin')}
              onClick={() => appUser.role === 'admin' ? setCheckoutModal(true) : confirmBillRequest()}
              className={`w-full py-4 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-base sm:text-lg ${isClosing ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none'}`}
            >
              {appUser.role === 'admin' ? 'Cobrar / Fechar Mesa' : isClosing ? 'Aguardando Caixa...' : 'Pedir a Conta'}
            </button>
          )}
        </div>
      </div>

      {/* MODAL 1: JUSTIFICATIVA DE CANCELAMENTO (GARÇOM) */}
      {cancelModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl transform transition-all scale-100">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Motivo do Cancelamento</h3>
            <p className="text-sm font-medium text-gray-600 mb-6">Excluindo: <span className="font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{cancelModalItem.name}</span></p>

            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Cliente desistiu, lançado errado..."
              className="w-full p-4 border-2 border-gray-200 rounded-2xl mb-6 focus:border-red-500 focus:ring-4 focus:ring-red-50 focus:outline-none text-sm font-bold bg-gray-50 transition-all resize-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setCancelModalItem(null)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-colors uppercase text-sm">Voltar</button>
              <button onClick={confirmCancelWithReason} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 shadow-lg shadow-red-200 transition-colors uppercase text-sm">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FECHAMENTO DE CONTA & LIBERAÇÃO (ADMIN) */}
      {checkoutModal && appUser.role === 'admin' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 shadow-2xl">
             <div className="text-center mb-6">
               <h3 className="text-2xl font-black text-gray-900">Caixa da Mesa {table.number}</h3>
               <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">Fechamento de Conta</p>
             </div>
             
             <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                <div className="flex justify-between text-gray-600 font-bold text-sm">
                  <span>Subtotal</span>
                  <span>R$ {localOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-bold text-sm">
                  <span>Taxa de Serviço (10%)</span>
                  <span>R$ {(localOrder.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 pt-4 border-t-2 border-gray-200 border-dashed">
                  <span>TOTAL FINAL</span>
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-lg">R$ {(localOrder.total * 1.1).toFixed(2)}</span>
                </div>
             </div>
             
             <div className="flex flex-col gap-3">
               <button onClick={finalizePaymentAdmin} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-lg shadow-green-200 transition-all text-base uppercase">
                 Receber e Liberar Mesa
               </button>
               
               <button onClick={reopenTableAdmin} className="w-full py-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl font-black flex items-center justify-center gap-2 transition-colors text-sm uppercase mt-2">
                 <RotateCcw size={18} /> Reabrir para Pedidos
               </button>

               <button onClick={() => setCheckoutModal(false)} className="w-full py-4 bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-2xl font-bold transition-colors mt-1">
                 Cancelar e Fechar Janela
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Renderização Principal do React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RestaurantApp />
  </React.StrictMode>
);
