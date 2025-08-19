/**
 * COMPONENTE - MODAL DE IMPORTAÇÃO DE COBRANÇAS
 * ============================================
 *
 * Modal para importar documentos de cobrança do módulo Billing
 * para o sistema de Gestão de Recebíveis com validação e configuração.
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Receipt,
  Calculator,
  User,
  Phone,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Import,
} from "lucide-react";
import { Invoice, Estimate } from "@/types/billing";

interface ImportBillingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (importedInvoices: any[]) => void;
}

// Dados mock dos documentos de cobrança
const mockBillingDocuments: (Invoice | Estimate)[] = [
  {
    id: "1",
    type: "invoice",
    number: "INV-001",
    title: "Serviços Jurídicos - Janeiro 2025",
    date: "2025-01-15T00:00:00Z",
    dueDate: "2025-02-15T00:00:00Z",
    total: 2750,
    currency: "BRL",
    status: "SENT",
    receiverName: "Tech Solutions LTDA",
    receiverDetails: {
      name: "Tech Solutions LTDA",
      document: "12.345.678/0001-90",
      email: "contato@techsolutions.com",
      phone: "(11) 99999-1111",
      address: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      country: "Brasil",
    },
    items: [
      {
        id: "1",
        description: "Assessoria Jurídica Empresarial",
        quantity: 1,
        rate: 2500,
        amount: 2500,
      },
    ],
    subtotal: 2500,
    discount: 0,
    discountType: "fixed",
    fee: 0,
    feeType: "fixed",
    tax: 250,
    taxType: "fixed",
    paymentStatus: "PENDING",
    emailSent: true,
    remindersSent: 1,
    senderId: "1",
    senderName: "Escritório Silva & Associados",
    senderDetails: {
      name: "Escritório Silva & Associados",
      document: "98.765.432/0001-10",
      email: "contato@silva.adv.br",
      phone: "(11) 3333-4444",
      address: "Rua Augusta, 500",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      country: "Brasil",
    },
    receiverId: "1",
    attachments: [],
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-16T10:00:00Z",
    createdBy: "Dr. Silva",
    lastModifiedBy: "Dr. Silva",
  },
  {
    id: "2",
    type: "invoice",
    number: "INV-002",
    title: "Ação Trabalhista - Acompanhamento",
    date: "2025-01-20T00:00:00Z",
    dueDate: "2025-02-20T00:00:00Z",
    total: 1800,
    currency: "BRL",
    status: "PENDING",
    receiverName: "Maria Silva - MEI",
    receiverDetails: {
      name: "Maria Silva - MEI",
      document: "123.456.789-00",
      email: "maria@email.com",
      phone: "(11) 88888-2222",
      address: "Rua Vergueiro, 500",
      city: "São Paulo",
      state: "SP",
      zipCode: "04038-001",
      country: "Brasil",
    },
    items: [
      {
        id: "1",
        description: "Acompanhamento Processual",
        quantity: 1,
        rate: 1800,
        amount: 1800,
      },
    ],
    subtotal: 1800,
    discount: 0,
    discountType: "fixed",
    fee: 0,
    feeType: "fixed",
    tax: 0,
    taxType: "fixed",
    paymentStatus: "PENDING",
    emailSent: false,
    remindersSent: 0,
    senderId: "1",
    senderName: "Escritório Silva & Associados",
    senderDetails: {
      name: "Escritório Silva & Associados",
      document: "98.765.432/0001-10",
      email: "contato@silva.adv.br",
      phone: "(11) 3333-4444",
      address: "Rua Augusta, 500",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      country: "Brasil",
    },
    receiverId: "2",
    attachments: [],
    createdAt: "2025-01-20T09:00:00Z",
    updatedAt: "2025-01-20T09:00:00Z",
    createdBy: "Dra. Costa",
    lastModifiedBy: "Dra. Costa",
  },
  {
    id: "3",
    type: "estimate",
    number: "EST-001",
    title: "Orçamento - Consultoria Empresarial",
    date: "2025-01-18T00:00:00Z",
    dueDate: "2025-02-18T00:00:00Z",
    validUntil: "2025-02-18T00:00:00Z",
    total: 3200,
    currency: "BRL",
    status: "SENT",
    convertedToInvoice: false,
    receiverName: "Startup Innovation LTDA",
    receiverDetails: {
      name: "Startup Innovation LTDA",
      document: "87.654.321/0001-23",
      email: "contato@startup.com",
      phone: "(11) 77777-3333",
      address: "Av. Faria Lima, 2000",
      city: "São Paulo",
      state: "SP",
      zipCode: "04538-000",
      country: "Brasil",
    },
    items: [
      {
        id: "1",
        description: "Consultoria Jurídica Especializada",
        quantity: 1,
        rate: 3200,
        amount: 3200,
      },
    ],
    subtotal: 3200,
    discount: 0,
    discountType: "fixed",
    fee: 0,
    feeType: "fixed",
    tax: 0,
    taxType: "fixed",
    senderId: "1",
    senderName: "Escritório Silva & Associados",
    senderDetails: {
      name: "Escritório Silva & Associados",
      document: "98.765.432/0001-10",
      email: "contato@silva.adv.br",
      phone: "(11) 3333-4444",
      address: "Rua Augusta, 500",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      country: "Brasil",
    },
    receiverId: "3",
    attachments: [],
    createdAt: "2025-01-18T09:00:00Z",
    updatedAt: "2025-01-18T09:00:00Z",
    createdBy: "Dr. Silva",
    lastModifiedBy: "Dr. Silva",
  },
];

interface ImportData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  parcelas: number;
  valorParcela: number;
  dataInicio: string;
  observacoes: string;
}

export function ImportBillingModal({ open, onOpenChange, onImport }: ImportBillingModalProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [importData, setImportData] = useState<Record<string, ImportData>>({});
  const [step, setStep] = useState<'selection' | 'configuration'>('selection');

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    const invoiceIds = mockBillingDocuments
      .filter(doc => doc.type === 'invoice' && doc.status !== 'PAID')
      .map(doc => doc.id);
    setSelectedDocuments(invoiceIds);
  };

  const handleClearAll = () => {
    setSelectedDocuments([]);
  };

  const handleNextStep = () => {
    if (selectedDocuments.length === 0) {
      alert('Selecione pelo menos um documento para importar.');
      return;
    }

    // Inicializar dados de importação para documentos selecionados
    const initialData: Record<string, ImportData> = {};
    selectedDocuments.forEach(docId => {
      const doc = mockBillingDocuments.find(d => d.id === docId);
      if (doc) {
        initialData[docId] = {
          clientName: doc.receiverName,
          clientPhone: doc.receiverDetails.phone || '',
          clientEmail: doc.receiverDetails.email,
          parcelas: 1,
          valorParcela: doc.total,
          dataInicio: new Date().toISOString().split('T')[0],
          observacoes: `Importado de ${doc.number} - ${doc.title}`,
        };
      }
    });
    
    setImportData(initialData);
    setStep('configuration');
  };

  const handleBackStep = () => {
    setStep('selection');
  };

  const handleImportDataChange = (docId: string, field: keyof ImportData, value: string | number) => {
    setImportData(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value,
        // Recalcular valor da parcela quando número de parcelas muda
        ...(field === 'parcelas' && typeof value === 'number' ? {
          valorParcela: Math.round((mockBillingDocuments.find(d => d.id === docId)?.total || 0) / value * 100) / 100
        } : {})
      }
    }));
  };

  const handleConfirmImport = () => {
    const importedInvoices = selectedDocuments.map(docId => {
      const originalDoc = mockBillingDocuments.find(d => d.id === docId);
      const configData = importData[docId];
      
      if (!originalDoc || !configData) return null;

      // Criar faturas para o sistema de recebíveis
      const baseInvoice = {
        id: `imported_${docId}_${Date.now()}`,
        clienteId: originalDoc.receiverId,
        numeroFatura: `REC-${originalDoc.number}`,
        valor: configData.valorParcela,
        descricao: originalDoc.title,
        servicoPrestado: originalDoc.items[0]?.description || 'Serviços Jurídicos',
        dataEmissao: new Date(),
        dataVencimento: new Date(configData.dataInicio),
        status: 'nova' as const,
        tentativasCobranca: 0,
        recorrente: configData.parcelas > 1,
        intervaloDias: 30,
        criadoPor: originalDoc.createdBy,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        observacoes: configData.observacoes,
        // Dados do cliente
        clienteNome: configData.clientName,
        clienteEmail: configData.clientEmail,
        clienteTelefone: configData.clientPhone,
        // Dados originais para referência
        documentoOriginal: {
          id: originalDoc.id,
          numero: originalDoc.number,
          tipo: originalDoc.type,
        }
      };

      // Se tem múltiplas parcelas, criar array de faturas
      if (configData.parcelas > 1) {
        const faturas = [];
        for (let i = 0; i < configData.parcelas; i++) {
          const dataVencimento = new Date(configData.dataInicio);
          dataVencimento.setMonth(dataVencimento.getMonth() + i);
          
          faturas.push({
            ...baseInvoice,
            id: `${baseInvoice.id}_parcela_${i + 1}`,
            numeroFatura: `${baseInvoice.numeroFatura}-${i + 1}/${configData.parcelas}`,
            dataVencimento,
            descricao: `${originalDoc.title} - Parcela ${i + 1}/${configData.parcelas}`,
            parcela: {
              numero: i + 1,
              total: configData.parcelas,
            }
          });
        }
        return faturas;
      }

      return baseInvoice;
    }).filter(Boolean).flat();

    onImport(importedInvoices);
    onOpenChange(false);
    
    // Reset state
    setSelectedDocuments([]);
    setImportData({});
    setStep('selection');
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      DRAFT: { label: "Rascunho", className: "bg-gray-100 text-gray-800" },
      SENT: { label: "Enviado", className: "bg-blue-100 text-blue-800" },
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
      PAID: { label: "Pago", className: "bg-green-100 text-green-800" },
      OVERDUE: { label: "Vencido", className: "bg-red-100 text-red-800" },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filtrar apenas faturas que podem ser importadas (não pagas)
  const availableDocuments = mockBillingDocuments.filter(doc => 
    doc.type === 'invoice' && doc.status !== 'PAID'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Import className="h-5 w-5 text-primary" />
            <span>
              {step === 'selection' ? 'Importar Documentos de Cobrança' : 'Configurar Importação'}
            </span>
          </DialogTitle>
        </DialogHeader>

        {step === 'selection' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Selecione os documentos de cobrança que deseja importar para o sistema de recebíveis.
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Selecionar Todos
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Limpar Seleção
                </Button>
              </div>
            </div>

            <ScrollArea className="h-96 w-full border rounded-lg">
              <div className="p-4 space-y-3">
                {availableDocuments.map((doc) => {
                  const isSelected = selectedDocuments.includes(doc.id);
                  const statusConfig = getStatusBadge(doc.status);
                  
                  return (
                    <div
                      key={doc.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => {}} // Controlled by parent click
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {doc.type === 'invoice' ? (
                                <Receipt className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Calculator className="h-4 w-4 text-green-600" />
                              )}
                              <span className="font-semibold">{doc.number}</span>
                              <Badge className={statusConfig.className}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <span className="font-bold text-green-600">
                              {formatCurrency(doc.total)}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-medium">{doc.title}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{doc.receiverName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Vence: {new Date(doc.dueDate).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedDocuments.length} documento(s) selecionado(s)
              </p>
              <Button 
                onClick={handleNextStep}
                disabled={selectedDocuments.length === 0}
              >
                Próximo: Configurar
              </Button>
            </div>
          </div>
        )}

        {step === 'configuration' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Configure os dados para importação no sistema de recebíveis.
              </p>
              <Button variant="outline" size="sm" onClick={handleBackStep}>
                Voltar
              </Button>
            </div>

            <ScrollArea className="h-96 w-full">
              <div className="space-y-6">
                {selectedDocuments.map((docId) => {
                  const doc = mockBillingDocuments.find(d => d.id === docId);
                  const data = importData[docId];
                  
                  if (!doc || !data) return null;

                  return (
                    <div key={docId} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">{doc.number}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-sm">{doc.title}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`cliente-${docId}`}>
                            <User className="h-4 w-4 inline mr-1" />
                            Nome do Cliente *
                          </Label>
                          <Input
                            id={`cliente-${docId}`}
                            value={data.clientName}
                            onChange={(e) => handleImportDataChange(docId, 'clientName', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`telefone-${docId}`}>
                            <Phone className="h-4 w-4 inline mr-1" />
                            Telefone/WhatsApp *
                          </Label>
                          <Input
                            id={`telefone-${docId}`}
                            value={data.clientPhone}
                            onChange={(e) => handleImportDataChange(docId, 'clientPhone', e.target.value)}
                            placeholder="(11) 99999-9999"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`parcelas-${docId}`}>
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            Quantidade de Parcelas
                          </Label>
                          <Select
                            value={data.parcelas.toString()}
                            onValueChange={(value) => handleImportDataChange(docId, 'parcelas', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}x de {formatCurrency(doc.total / num)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`inicio-${docId}`}>
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Data de Início
                          </Label>
                          <Input
                            id={`inicio-${docId}`}
                            type="date"
                            value={data.dataInicio}
                            onChange={(e) => handleImportDataChange(docId, 'dataInicio', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span>Valor Total: <strong>{formatCurrency(doc.total)}</strong></span>
                          <span>Valor por Parcela: <strong>{formatCurrency(data.valorParcela)}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <Separator />

            <div className="flex justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Verifique todos os dados antes de confirmar a importação</span>
              </div>
              <Button onClick={handleConfirmImport} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar Importação
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
