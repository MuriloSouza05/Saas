/**
 * PÁGINA PRINCIPAL - GESTÃO DE RECEBÍVEIS
 * ======================================
 *
 * Sistema completo para administração de pagamentos e automação de cobranças.
 * Integra com Stripe, n8n e WhatsApp para gestão inteligente de recebíveis.
 */

import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { ImportBillingModal } from "@/components/Receivables/ImportBillingModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  Plus,
  Filter,
  Search,
  Eye,
  Send,
  Settings,
  BarChart3,
  Smartphone,
  Mail,
  ExternalLink,
  Import,
  Edit,
  Trash2,
  Phone,
  Building2,
  User,
} from "lucide-react";
import { 
  Invoice, 
  InvoiceStatus, 
  ClienteCobranca, 
  DashboardRecebiveis,
  NotificacaoAutomatica 
} from "@/types/receivables";

/**
 * DADOS MOCK PARA DEMONSTRAÇÃO
 * ============================
 * 
 * BACKEND: Estes dados virão das seguintes APIs:
 * - GET /api/recebiveis/dashboard - Estatísticas gerais
 * - GET /api/recebiveis/faturas - Lista de faturas com filtros
 * - GET /api/recebiveis/clientes - Clientes com dados de cobrança
 * - GET /api/recebiveis/notificacoes - Notificações automáticas
 */

const mockDashboard: DashboardRecebiveis = {
  faturasPagas: 68,
  faturasPendentes: 15,
  faturasVencidas: 1,
  faturasProximoVencimento: 4,
  valorTotal: 187500,
  valorPago: 142800,
  valorPendente: 39200,
  valorVencido: 5500,
  novosClientes: 12,
  taxaCobranças: 96.8,
  tempoMedioPagamento: 8,
  notificacoesAgendadas: 6,
  faturas3Dias: [],
  faturasVencidas: [],
  faturamentoMensal: 142800,
  crescimentoMensal: 22.4,
  clientesAtivos: 84
};

const mockInvoices: Invoice[] = [
  // ÚNICA FATURA VENCIDA (conforme solicitado)
  {
    id: "1",
    clienteId: "client1",
    numeroFatura: "REC-2025-001",
    valor: 5500,
    descricao: "Honorários Advocatícios - Dezembro/2024",
    servicoPrestado: "Consultoria Jurídica Especializada",
    dataEmissao: new Date("2024-12-01"),
    dataVencimento: new Date("2024-12-31"),
    status: "vencida",
    tentativasCobranca: 3,
    stripeInvoiceId: "in_stripe123",
    linkPagamento: "https://checkout.stripe.com/xyz",
    recorrente: true,
    intervaloDias: 30,
    proximaFaturaData: new Date("2025-01-31"),
    criadoPor: "Dr. Silva",
    criadoEm: new Date("2024-12-01"),
    atualizadoEm: new Date("2025-01-05"),
    urgencia: "alta",
    ultimaNotificacao: new Date("2025-01-03"),
  },
  // FATURAS PRÓXIMAS AO VENCIMENTO (3 dias ou menos)
  {
    id: "2",
    clienteId: "client2",
    numeroFatura: "REC-2025-015",
    valor: 3200,
    descricao: "Ação Trabalhista - Acompanhamento Processual",
    servicoPrestado: "Processo Judicial",
    dataEmissao: new Date("2025-01-05"),
    dataVencimento: new Date("2025-01-28"), // 3 dias
    status: "pendente",
    tentativasCobranca: 1,
    linkPagamento: "https://checkout.stripe.com/abc123",
    recorrente: false,
    criadoPor: "Dra. Costa",
    criadoEm: new Date("2025-01-05"),
    atualizadoEm: new Date("2025-01-20"),
    urgencia: "media",
    proximaNotificacao: new Date("2025-01-25"),
  },
  {
    id: "3",
    clienteId: "client3",
    numeroFatura: "REC-2025-018",
    valor: 2800,
    descricao: "Elaboração de Contrato Empresarial",
    servicoPrestado: "Elaboração de Contratos",
    dataEmissao: new Date("2025-01-10"),
    dataVencimento: new Date("2025-01-27"), // 2 dias
    status: "nova",
    tentativasCobranca: 0,
    linkPagamento: "https://checkout.stripe.com/def456",
    recorrente: false,
    criadoPor: "Dr. Silva",
    criadoEm: new Date("2025-01-10"),
    atualizadoEm: new Date("2025-01-10"),
    urgencia: "alta",
  },
  // FATURAS PENDENTES (prazo normal)
  {
    id: "4",
    clienteId: "client4",
    numeroFatura: "REC-2025-020",
    valor: 4200,
    descricao: "Consultoria Jurídica - Janeiro/2025",
    servicoPrestado: "Consultoria Empresarial",
    dataEmissao: new Date("2025-01-15"),
    dataVencimento: new Date("2025-02-15"),
    status: "pendente",
    tentativasCobranca: 0,
    linkPagamento: "https://checkout.stripe.com/ghi789",
    recorrente: true,
    intervaloDias: 30,
    proximaFaturaData: new Date("2025-02-15"),
    criadoPor: "Dra. Costa",
    criadoEm: new Date("2025-01-15"),
    atualizadoEm: new Date("2025-01-15"),
    urgencia: "media",
  },
  // FATURAS PAGAS (algumas amostras)
  {
    id: "5",
    clienteId: "client5",
    numeroFatura: "REC-2025-010",
    valor: 3500,
    descricao: "Assessoria Jurídica Completa",
    servicoPrestado: "Consultoria Jurídica",
    dataEmissao: new Date("2025-01-02"),
    dataVencimento: new Date("2025-01-20"),
    dataPagamento: new Date("2025-01-18"),
    status: "paga",
    tentativasCobranca: 1,
    stripePaymentIntentId: "pi_payment123",
    recorrente: false,
    criadoPor: "Dr. Silva",
    criadoEm: new Date("2025-01-02"),
    atualizadoEm: new Date("2025-01-18"),
    urgencia: "baixa",
  },
  {
    id: "6",
    clienteId: "client6",
    numeroFatura: "REC-2025-012",
    valor: 2400,
    descricao: "Revisão Contratual",
    servicoPrestado: "Análise de Contratos",
    dataEmissao: new Date("2025-01-05"),
    dataVencimento: new Date("2025-01-22"),
    dataPagamento: new Date("2025-01-21"),
    status: "paga",
    tentativasCobranca: 0,
    stripePaymentIntentId: "pi_payment456",
    recorrente: false,
    criadoPor: "Dra. Costa",
    criadoEm: new Date("2025-01-05"),
    atualizadoEm: new Date("2025-01-21"),
    urgencia: "baixa",
  },
];

const mockClientes: ClienteCobranca[] = [
  {
    id: "client1",
    nome: "Tech Solutions LTDA",
    email: "contato@techsolutions.com",
    telefone: "(11) 99999-1111",
    whatsapp: "5511999991111",
    enderecoCobranca: {
      cep: "01310-100",
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP"
    },
    stripeCustomerId: "cus_stripe123",
    receberWhatsApp: true,
    receberEmail: true,
    horaPreferencialNotificacao: "09:00",
    totalFaturado: 12000,
    totalPago: 9500,
    faturasPendentes: 1,
    ultimoPagamento: new Date("2023-12-15"),
    ativo: true,
    bloqueado: false,
  },
  {
    id: "client2",
    nome: "Maria Silva - MEI",
    email: "maria@email.com",
    telefone: "(11) 88888-2222",
    whatsapp: "5511888882222",
    enderecoCobranca: {
      cep: "04038-001",
      logradouro: "Rua Vergueiro",
      numero: "500",
      bairro: "Vila Mariana",
      cidade: "São Paulo",
      estado: "SP"
    },
    receberWhatsApp: true,
    receberEmail: false,
    totalFaturado: 5400,
    totalPago: 3600,
    faturasPendentes: 1,
    ativo: true,
    bloqueado: false,
  },
];

const getStatusBadge = (status: InvoiceStatus) => {
  const configs = {
    pendente: { 
      label: "Pendente", 
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" 
    },
    paga: { 
      label: "Paga", 
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
    },
    vencida: { 
      label: "Vencida", 
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
    },
    cancelada: { 
      label: "Cancelada", 
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" 
    },
    processando: { 
      label: "Processando", 
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
    },
  };
  
  return configs[status];
};

const calcularDiasVencimento = (dataVencimento: Date): number => {
  const hoje = new Date();
  const diff = dataVencimento.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export function Receivables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  /**
   * FUNÇÃO PARA DETECÇÃO DE VENCIMENTOS (3 DIAS)
   * ============================================
   * 
   * BACKEND: Esta lógica deve ser implementada como CRON JOB
   * que executa diariamente às 09:00 da manhã:
   * 
   * 1. Query no banco: SELECT * FROM faturas WHERE 
   *    data_vencimento = CURRENT_DATE + INTERVAL '3 days'
   *    AND status = 'pendente'
   * 
   * 2. Para cada fatura encontrada:
   *    - Criar notificação automática
   *    - Dispara webhook para n8n
   *    - n8n envia WhatsApp com link de pagamento
   * 
   * 3. Implementar retry mechanism para falhas
   * 4. Log de todas as notificações enviadas
   */
  const handleNotificarCliente = async (invoice: Invoice) => {
    console.log("Enviando notificação para fatura:", invoice.numeroFatura);
    
    // BACKEND: POST /api/recebiveis/notificar
    // Payload: { faturaId, tipo: 'manual', canal: 'whatsapp' }
    
    // Webhook para n8n
    const webhookPayload = {
      evento: 'lembrete_pagamento',
      fatura: {
        id: invoice.id,
        numero: invoice.numeroFatura,
        valor: invoice.valor,
        vencimento: invoice.dataVencimento.toISOString(),
        linkPagamento: invoice.linkPagamento || ''
      },
      cliente: {
        // Buscar dados do cliente
        id: invoice.clienteId,
        nome: "Cliente Exemplo",
        whatsapp: "5511999999999"
      }
    };
    
    console.log("Payload para n8n:", webhookPayload);
  };

  const handleEnviarCobrancaLote = () => {
    console.log("Enviando cobrança em lote para faturas:", selectedInvoices);
    // BACKEND: POST /api/recebiveis/cobranca-lote
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.numeroFatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleImportBilling = (importedInvoices: any[]) => {
    // Adicionar faturas importadas ao estado
    const newInvoices = importedInvoices.map(imported => ({
      ...imported,
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }));

    setInvoices(prev => [...prev, ...newInvoices]);

    // Notificação de sucesso
    console.log(`✅ ${importedInvoices.length} fatura(s) importada(s) com sucesso!`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setShowViewDialog(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    console.log("Editando fatura:", invoice.numeroFatura);
    // Implementar modal de edição
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    if (confirm(`Deseja realmente excluir a fatura ${invoice.numeroFatura}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
      console.log("Fatura excluída:", invoice.numeroFatura);
    }
  };

  const invoicesProximoVencimento = invoices.filter(invoice => {
    const dias = calcularDiasVencimento(invoice.dataVencimento);
    return dias <= 3 && dias >= 0 && invoice.status === 'pendente';
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Gestão de Recebíveis</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
            >
              <Import className="h-4 w-4 mr-2" />
              Importar Cobranças
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Fatura
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturas Pagas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockDashboard.faturasPagas}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(mockDashboard.valorPago)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockDashboard.faturasPendentes}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(mockDashboard.valorPendente)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockDashboard.faturasProximoVencimento}
              </div>
              <p className="text-xs text-muted-foreground">
                3 dias ou menos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockDashboard.faturasVencidas}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(mockDashboard.valorVencido)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Abas Principais */}
        <Tabs defaultValue="faturas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="faturas">Faturas</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>

          {/* ABA FATURAS */}
          <TabsContent value="faturas" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lista de Faturas</CardTitle>
                  <div className="flex items-center space-x-2">
                    {selectedInvoices.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleEnviarCobrancaLote}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enviar Cobrança ({selectedInvoices.length})
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar faturas..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos Status</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="paga">Paga</SelectItem>
                      <SelectItem value="vencida">Vencida</SelectItem>
                      <SelectItem value="processando">Processando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dias</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => {
                        const statusConfig = getStatusBadge(invoice.status);
                        const diasVencimento = calcularDiasVencimento(invoice.dataVencimento);
                        const cliente = mockClientes.find(c => c.id === invoice.clienteId);
                        
                        return (
                          <TableRow key={invoice.id}>
                            <TableCell>
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300"
                                checked={selectedInvoices.includes(invoice.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedInvoices([...selectedInvoices, invoice.id]);
                                  } else {
                                    setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-mono">
                              {invoice.numeroFatura}
                            </TableCell>
                            <TableCell>{cliente?.nome || "Cliente não encontrado"}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(invoice.valor)}
                            </TableCell>
                            <TableCell>
                              {invoice.dataVencimento.toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusConfig.className}>
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {invoice.status === 'pendente' && (
                                <span className={
                                  diasVencimento < 0 ? "text-red-600 font-semibold" :
                                  diasVencimento <= 3 ? "text-orange-600 font-semibold" :
                                  "text-muted-foreground"
                                }>
                                  {diasVencimento < 0 ? `${Math.abs(diasVencimento)} dias em atraso` :
                                   diasVencimento === 0 ? "Vence hoje" :
                                   `${diasVencimento} dias`}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {invoice.status === 'pendente' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleNotificarCliente(invoice)}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                )}
                                {invoice.linkPagamento && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={invoice.linkPagamento} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA CLIENTES */}
          <TabsContent value="clientes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clientes - Gestão de Cobrança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClientes.map((cliente) => (
                    <div key={cliente.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold">{cliente.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              {cliente.email} • {cliente.telefone}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {cliente.receberWhatsApp && (
                              <Badge variant="outline" className="text-green-600">
                                <Smartphone className="h-3 w-3 mr-1" />
                                WhatsApp
                              </Badge>
                            )}
                            {cliente.receberEmail && (
                              <Badge variant="outline" className="text-blue-600">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(cliente.totalFaturado)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {cliente.faturasPendentes} pendente(s)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA NOTIFICAÇÕES */}
          <TabsContent value="notificacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notificações Automáticas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sistema integrado com n8n e WhatsApp para automação de cobranças
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Sistema de Notificações Automáticas
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Configuração completa de automação será implementada com integração n8n
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">3 Dias Antes</h4>
                      <p className="text-sm text-muted-foreground">
                        Lembrete automático via WhatsApp
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">1 Dia Antes</h4>
                      <p className="text-sm text-muted-foreground">
                        Segundo lembrete com urgência
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Após Vencimento</h4>
                      <p className="text-sm text-muted-foreground">
                        Cobrança de atraso automática
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA RELATÓRIOS */}
          <TabsContent value="relatorios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios e Análises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Taxa de Cobrança</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {mockDashboard.taxaCobranças}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cobranças bem-sucedidas
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Tempo Médio</h4>
                    </div>
                    <p className="text-2xl font-bold">
                      {mockDashboard.tempoMedioPagamento} dias
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Para pagamento
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Crescimento</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      +{mockDashboard.crescimentoMensal}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mensal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
