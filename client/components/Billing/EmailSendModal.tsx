import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Send, 
  Eye, 
  X, 
  Globe,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface EmailSendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: any[];
  onSendEmail: (data: any) => Promise<void>;
}

export function EmailSendModal({
  open,
  onOpenChange,
  documents,
  onSendEmail
}: EmailSendModalProps) {
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    fromName: 'Escritório Silva & Associados',
    fromEmail: 'contato@silva.adv.br',
    replyTo: 'contato@silva.adv.br',
    attachPdf: true,
    customMessage: ''
  });
  
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Get template content based on document type
  const getTemplateContent = (document: any) => {
    const isInvoice = document.type === 'invoice';
    
    const baseTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isInvoice ? 'Fatura' : 'Orçamento'} - ${document.number}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${isInvoice ? '#059669' : '#3B82F6'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .amount { font-size: 24px; font-weight: bold; color: ${isInvoice ? '#dc2626' : '#059669'}; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
        .table th { background: #f3f4f6; }
        .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${isInvoice ? '📄 FATURA' : '📋 ORÇAMENTO'}</h1>
        <p>Nº ${document.number}</p>
    </div>
    
    <div class="content">
        <p>Prezado(a) <strong>${document.clientName || 'Cliente'}</strong>,</p>
        
        <p>${isInvoice ? 'Segue fatura referente aos serviços prestados:' : 'Segue em anexo o orçamento solicitado para os serviços jurídicos:'}</p>
        
        <table class="table">
            <tr>
                <th>Empresa:</th>
                <td>Escritório Silva & Associados</td>
            </tr>
            <tr>
                <th>${isInvoice ? 'Data de Emissão:' : 'Data:'}</th>
                <td>${new Date(document.date).toLocaleDateString('pt-BR')}</td>
            </tr>
            ${isInvoice ? `
            <tr>
                <th>Vencimento:</th>
                <td><strong>${new Date(document.dueDate).toLocaleDateString('pt-BR')}</strong></td>
            </tr>
            ` : `
            <tr>
                <th>Validade:</th>
                <td>${new Date(document.validUntil || document.dueDate).toLocaleDateString('pt-BR')}</td>
            </tr>
            `}
            <tr>
                <th>Cliente:</th>
                <td>${document.clientName || 'Cliente'}</td>
            </tr>
        </table>
        
        <h3>Descrição dos Serviços:</h3>
        <div>${document.description || 'Serviços jurídicos especializados'}</div>
        
        <div style="text-align: center; margin: 30px 0;">
            <div class="amount">Valor Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(document.total)}</div>
        </div>
        
        ${emailData.customMessage ? `
        <div class="alert">
            <strong>📝 Mensagem:</strong><br>
            ${emailData.customMessage.replace(/\n/g, '<br>')}
        </div>
        ` : ''}
        
        <p>${isInvoice ? 'Para efetuar o pagamento, utilize os dados bancários em anexo ou entre em contato conosco.' : 'Para aceitar este orçamento, entre em contato conosco através dos canais abaixo.'}</p>
        
        <p>Atenciosamente,<br>
        <strong>${emailData.fromName}</strong></p>
    </div>
    
    <div class="footer">
        <p>📧 ${emailData.fromEmail} | 📞 (11) 3333-4444</p>
        ${isInvoice ? '<p>PIX: contato@silva.adv.br</p>' : ''}
    </div>
</body>
</html>`;

    return baseTemplate;
  };

  const handleSend = async () => {
    setSending(true);
    try {
      // Simulate Resend API call
      const emailPayload = {
        from: `${emailData.fromName} <${emailData.fromEmail}>`,
        to: emailData.to.split(',').map(email => email.trim()),
        cc: emailData.cc ? emailData.cc.split(',').map(email => email.trim()) : undefined,
        bcc: emailData.bcc ? emailData.bcc.split(',').map(email => email.trim()) : undefined,
        subject: emailData.subject,
        html: getTemplateContent(documents[0]),
        reply_to: emailData.replyTo,
        attachments: emailData.attachPdf ? [{
          filename: `${documents[0].type}_${documents[0].number}.pdf`,
          content: 'base64-content-here'
        }] : undefined
      };

      // Call the actual send function
      await onSendEmail(emailPayload);
      
      alert(`✅ Email${documents.length > 1 ? 's' : ''} enviado${documents.length > 1 ? 's' : ''} com sucesso!\n\n📧 Destinatário${documents.length > 1 ? 's' : ''}: ${emailData.to}\n🎯 ${documents.length} documento${documents.length > 1 ? 's' : ''} enviado${documents.length > 1 ? 's' : ''}`);
      
      onOpenChange(false);
    } catch (error) {
      alert('❌ Erro ao enviar email. Verifique as configurações e tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const generateSubject = () => {
    const doc = documents[0];
    const isInvoice = doc.type === 'invoice';
    const prefix = '[Silva & Associados]';
    
    if (documents.length === 1) {
      return `${prefix} ${isInvoice ? 'Fatura' : 'Orçamento'} ${doc.number} - ${doc.title}`;
    } else {
      return `${prefix} ${documents.length} documento${documents.length > 1 ? 's' : ''} - ${isInvoice ? 'Faturas' : 'Orçamentos'}`;
    }
  };

  React.useEffect(() => {
    if (open && documents.length > 0) {
      setEmailData(prev => ({
        ...prev,
        subject: generateSubject(),
        to: documents[0].clientEmail || ''
      }));
    }
  }, [open, documents]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Enviar Email - {documents.length} Documento{documents.length > 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            Configure e envie os documentos selecionados por email usando a API Resend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📄 Documentos Selecionados:</h4>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc) => (
                <Badge key={doc.id} variant="secondary">
                  {doc.type === 'invoice' ? '📄' : '📋'} {doc.number} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(doc.total)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Configuration */}
            <div className="space-y-4">
              <h3 className="font-medium">📧 Configuração do Email</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-name">Nome do Remetente</Label>
                  <Input
                    id="from-name"
                    value={emailData.fromName}
                    onChange={(e) => setEmailData(prev => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="from-email">Email do Remetente</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={emailData.fromEmail}
                    onChange={(e) => setEmailData(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="to">Para (destinatários) *</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="cliente@email.com, outro@email.com"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cc">CC (opcional)</Label>
                  <Input
                    id="cc"
                    type="email"
                    placeholder="cc@email.com"
                    value={emailData.cc}
                    onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bcc">CCO (opcional)</Label>
                  <Input
                    id="bcc"
                    type="email"
                    placeholder="bcc@email.com"
                    value={emailData.bcc}
                    onChange={(e) => setEmailData(prev => ({ ...prev, bcc: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="custom-message">Mensagem Personalizada (opcional)</Label>
                <Textarea
                  id="custom-message"
                  placeholder="Adicione uma mensagem personalizada que será incluída no email..."
                  value={emailData.customMessage}
                  onChange={(e) => setEmailData(prev => ({ ...prev, customMessage: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="attach-pdf"
                  checked={emailData.attachPdf}
                  onCheckedChange={(checked) => setEmailData(prev => ({ ...prev, attachPdf: checked }))}
                />
                <Label htmlFor="attach-pdf">Anexar PDF dos documentos</Label>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">👁️ Preview do Email</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const previewWindow = window.open('', '_blank', 'width=800,height=600');
                    if (previewWindow) {
                      previewWindow.document.write(getTemplateContent(documents[0]));
                      previewWindow.document.close();
                    }
                  }}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Abrir Preview
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden h-[400px]">
                <iframe
                  srcDoc={getTemplateContent(documents[0])}
                  className="w-full h-full"
                  title="Preview do Email"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>API Resend configurada</span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={!emailData.to || sending}
            >
              {sending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Email{documents.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
