/**
 * SISTEMA DE GESTÃO JURÍDICA - MÓDULO CONFIGURAÇÕES
 * =================================================
 *
 * Módulo completo de configurações do sistema para escritórios de advocacia.
 * Organizado em abas especializadas para diferentes aspectos da configuração:
 *
 * ABAS DISPONÍVEIS:
 *
 * 1. EMPRESA
 *    - Dados da empresa (nome, CNPJ, contatos)
 *    - Upload de logo e favicon
 *    - Informações de contato
 *
 * 2. USUÁRIOS
 *    - Gestão de usuários do sistema
 *    - Perfis e permissões
 *    - Grupos de acesso
 *
 * 3. EMAIL
 *    - Configuração SMTP
 *    - Templates de orçamento e fatura
 *    - Assinaturas personalizadas
 *
 * 4. VISUAL
 *    - Temas claro/escuro
 *    - Cores personalizadas
 *    - Fonte e layout
 *
 * 5. NOTIFICAÇÕES
 *    - Preferências de notificação
 *    - Lembretes de prazos
 *    - Alertas de faturas
 *
 * 6. JURÍDICO
 *    - Status INSS personalizados
 *    - Categorias de casos
 *    - Templates de contratos
 *    - Prazos processuais
 *
 * 7. FINANCEIRO
 *    - Contas bancárias
 *    - Formas de pagamento
 *    - Impostos e taxas
 *    - Integração contábil
 *
 * 8. SEGURANÇA
 *    - Política de senhas
 *    - Sessões ativas
 *    - Logs de auditoria
 *    - Backup e recuperação
 *
 * FUNCIONALIDADES ESPECIAIS:
 * - Upload de arquivos com validação
 * - Editor de templates avançado
 * - Gestão de contas bancárias
 * - Configuração de 2FA
 * - Controle de sessões
 *
 * Autor: Sistema de Gestão Jurídica
 * Data: 2024
 * Versão: 2.0
 */

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Settings as SettingsIcon,
  Building,
  Users,
  Mail,
  Palette,
  Bell,
  Shield,
  Globe,
  Scale,
  DollarSign,
  Save,
  Upload,
  Download,
  Edit,
  Plus,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserManagement } from '@/components/Settings/UserManagement';

export function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<'budget' | 'invoice' | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [accounts, setAccounts] = useState([
    { id: '1', bank: 'Banco do Brasil', account: '1234-5', balance: 45280.50, type: 'Conta Corrente' },
    { id: '2', bank: 'Caixa Econômica', account: '6789-0', balance: 12750.30, type: 'Poupança' },
    { id: '3', bank: 'Itaú', account: '9876-1', balance: 8900.00, type: 'Conta Corrente' }
  ]);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  // Tratamento de erro
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Erro nas Configurações</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => setError(null)}>Tentar Novamente</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Handlers para funcionalidades
  const handleSaveCompany = () => {
    try {
      // Simular upload de arquivos
      if (logoFile) {
        console.log('Uploading logo:', logoFile.name);
        // Aqui seria feito o upload real para o servidor
      }
      if (faviconFile) {
        console.log('Uploading favicon:', faviconFile.name);
        // Aqui seria feito o upload real para o servidor
      }

      alert(`✅ Configurações da empresa salvas com sucesso!${logoFile ? '\n🇫Logo atualizado!' : ''}${faviconFile ? '\n🌐Favicon atualizado!' : ''}`);

      // Resetar arquivos após o sucesso
      setLogoFile(null);
      setFaviconFile(null);
    } catch (error) {
      setError('Erro ao salvar configurações da empresa');
    }
  };

  const handleSaveEmail = () => {
    try {
      alert('✅ Configurações de email salvas com sucesso!');
    } catch (error) {
      setError('Erro ao salvar configurações de email');
    }
  };

  const handleSaveAppearance = () => {
    try {
      alert('✅ Tema aplicado com sucesso!');
    } catch (error) {
      setError('Erro ao aplicar tema');
    }
  };

  const handleSaveNotifications = () => {
    try {
      alert('✅ Preferências de notificações salvas!');
    } catch (error) {
      setError('Erro ao salvar preferências de notificações');
    }
  };

  const handleSaveSecurity = () => {
    try {
      alert('✅ Configurações de segurança salvas!');
    } catch (error) {
      setError('Erro ao salvar configurações de segurança');
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tipo de arquivo
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo não suportado. Use PNG, JPEG ou SVG.');
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Arquivo muito grande. Tamanho máximo: 5MB.');
        return;
      }

      setLogoFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setError(null);
    }
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tipo de arquivo
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo não suportado. Use PNG, JPEG ou SVG.');
        return;
      }

      // Verificar tamanho (máximo 1MB para favicon)
      if (file.size > 1024 * 1024) {
        setError('Arquivo muito grande para favicon. Tamanho máximo: 1MB.');
        return;
      }

      setFaviconFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setError(null);
    }
  };

  const handleUploadLogo = () => {
    document.getElementById('logo-upload')?.click();
  };

  const handleUploadFavicon = () => {
    document.getElementById('favicon-upload')?.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Configurações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Personalização do sistema, perfis, integrações e segurança
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
            <TabsTrigger value="company" className="flex items-center">
              <Building className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>

            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center">
              <Scale className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Jurídico</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Perfil da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input id="company-name" defaultValue="Escritório Silva & Associados" />
                    </div>
                    <div>
                      <Label htmlFor="company-cnpj">CNPJ</Label>
                      <Input id="company-cnpj" defaultValue="12.345.678/0001-90" />
                    </div>
                    <div>
                      <Label htmlFor="company-email">Email</Label>
                      <Input id="company-email" type="email" defaultValue="contato@silva.adv.br" />
                    </div>
                    <div>
                      <Label htmlFor="company-phone">Telefone</Label>
                      <Input id="company-phone" defaultValue="(11) 3333-4444" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-address">Endereço</Label>
                      <Input id="company-address" defaultValue="Av. Paulista, 1000, Bela Vista" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company-city">Cidade</Label>
                        <Input id="company-city" defaultValue="São Paulo" />
                      </div>
                      <div>
                        <Label htmlFor="company-state">Estado</Label>
                        <Input id="company-state" defaultValue="SP" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company-zipcode">CEP</Label>
                        <Input id="company-zipcode" defaultValue="01310-100" />
                      </div>
                      <div>
                        <Label htmlFor="company-country">País</Label>
                        <Input id="company-country" defaultValue="Brasil" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-website">Website</Label>
                    <Input id="company-website" placeholder="https://www.silva.adv.br" />
                  </div>
                  <div>
                    <Label htmlFor="company-description">Descrição</Label>
                    <Textarea
                      id="company-description"
                      placeholder="Descrição do escritório..."
                      defaultValue="Escritório de advocacia especializado em direito civil, trabalhista e previdenciário."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logo e Marca</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Logo da Empresa</Label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                          ) : (
                            <Building className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" onClick={handleUploadLogo}>
                            <Upload className="h-4 w-4 mr-2" />
                            {logoFile ? 'Trocar Logo' : 'Upload Logo'}
                          </Button>
                          {logoFile && (
                            <div className="text-xs text-muted-foreground">
                              {logoFile.name} ({(logoFile.size / 1024).toFixed(1)}KB)
                            </div>
                          )}
                        </div>
                        <input
                          id="logo-upload"
                          type="file"
                          accept=".png,.jpg,.jpeg,.svg"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Formatos aceitos: PNG, JPEG, SVG. Tamanho máximo: 5MB
                      </p>
                    </div>
                    <div>
                      <Label>Favicon</Label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center overflow-hidden">
                          {faviconPreview ? (
                            <img src={faviconPreview} alt="Favicon preview" className="w-full h-full object-contain" />
                          ) : (
                            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" onClick={handleUploadFavicon}>
                            <Upload className="h-4 w-4 mr-2" />
                            {faviconFile ? 'Trocar Favicon' : 'Upload Favicon'}
                          </Button>
                          {faviconFile && (
                            <div className="text-xs text-muted-foreground">
                              {faviconFile.name} ({(faviconFile.size / 1024).toFixed(1)}KB)
                            </div>
                          )}
                        </div>
                        <input
                          id="favicon-upload"
                          type="file"
                          accept=".png,.jpg,.jpeg,.svg"
                          onChange={handleFaviconUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Formatos aceitos: PNG, JPEG, SVG. Tamanho máximo: 1MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveCompany}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Configurações de Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email-provider">Provedor de Email</Label>
                    <Select defaultValue="smtp">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="brevo">Brevo</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-host">Host SMTP</Label>
                      <Input id="smtp-host" placeholder="smtp.gmail.com" />
                    </div>
                    <div>
                      <Label htmlFor="smtp-port">Porta</Label>
                      <Input id="smtp-port" type="number" placeholder="587" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-username">Usuário</Label>
                      <Input id="smtp-username" placeholder="seu-email@gmail.com" />
                    </div>
                    <div>
                      <Label htmlFor="smtp-password">Senha</Label>
                      <Input id="smtp-password" type="password" placeholder="••••••••" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from-email">Email de Envio</Label>
                      <Input id="from-email" defaultValue="contato@silva.adv.br" />
                    </div>
                    <div>
                      <Label htmlFor="from-name">Nome de Envio</Label>
                      <Input id="from-name" defaultValue="Escritório Silva & Associados" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Templates de Email</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Template de Orçamento</Label>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          setCurrentTemplate('budget');
                          setTemplateContent('Modelo de template de orçamento...\n\nEmpresa: [NOME_EMPRESA]\nData: [DATA]\nCliente: [NOME_CLIENTE]\n\nDetalhes do orçamento:\n[DESCRICAO_SERVICOS]\n\nValor total: [VALOR_TOTAL]\n\nAtenciosamente,\n[ASSINATURA]');
                          setShowTemplateModal(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Template
                      </Button>
                    </div>
                    <div>
                      <Label>Template de Fatura</Label>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          setCurrentTemplate('invoice');
                          setTemplateContent('Modelo de template de fatura...\n\nEmpresa: [NOME_EMPRESA]\nFatura Nº: [NUMERO_FATURA]\nData de emissão: [DATA_EMISSAO]\nVencimento: [DATA_VENCIMENTO]\n\nCliente: [NOME_CLIENTE]\nCNPJ/CPF: [DOCUMENTO_CLIENTE]\n\nDescrição dos serviços:\n[DESCRICAO_SERVICOS]\n\nValor total: [VALOR_TOTAL]\nForma de pagamento: [FORMA_PAGAMENTO]\n\nAtenciosamente,\n[ASSINATURA]');
                          setShowTemplateModal(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveEmail}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Configurações de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Notificações no navegador</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-3">
                    <Label>Prazos de Projetos</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avisar 3 dias antes</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avisar 7 dias antes</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avisar 15 dias antes</span>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Lembretes de Faturas</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">3 dias antes do vencimento</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">1 dia depois do vencimento</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Frequência semanal</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Settings */}
          <TabsContent value="legal">
            <div className="space-y-6">
              {/* Status INSS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="h-5 w-5 mr-2" />
                    Status INSS Personalizados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Status Disponíveis</Label>
                      <div className="mt-2 space-y-2">
                        {['Ativo', 'Inativo', 'Pendente', 'Em Análise', 'Suspenso', 'Cancelado'].map((status) => (
                          <div key={status} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{status}</span>
                            <div className="flex items-center space-x-2">
                              <Switch defaultChecked={status === 'Ativo' || status === 'Inativo'} />
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new-inss-status">Adicionar Novo Status</Label>
                      <div className="mt-2 flex space-x-2">
                        <Input placeholder="Nome do status" />
                        <Button>Adicionar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categorias de Casos */}
              <Card>
                <CardHeader>
                  <CardTitle>Categorias de Casos Jurídicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Áreas do Direito</Label>
                      <div className="mt-2 space-y-2">
                        {[
                          'Direito Civil',
                          'Direito Trabalhista',
                          'Direito Previdenciário',
                          'Direito Empresarial',
                          'Direito Família',
                          'Direito Criminal',
                          'Direito Tributário',
                          'Direito Consumidor'
                        ].map((area) => (
                          <div key={area} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{area}</span>
                            <div className="flex items-center space-x-2">
                              <Switch defaultChecked />
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Tipos de Processo</Label>
                      <div className="mt-2 space-y-2">
                        {[
                          'Consultoria',
                          'Ação Judicial',
                          'Recurso',
                          'Execução',
                          'Mediação',
                          'Arbitragem',
                          'Acordo Extrajudicial',
                          'Petição Inicial'
                        ].map((tipo) => (
                          <div key={tipo} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{tipo}</span>
                            <div className="flex items-center space-x-2">
                              <Switch defaultChecked />
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Templates de Contratos */}
              <Card>
                <CardHeader>
                  <CardTitle>Templates de Contratos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Contrato de Honorários',
                      'Procuração Judicial',
                      'Acordo de Mediação',
                      'Termo de Confidencialidade',
                      'Contrato de Consultoria',
                      'Distrato'
                    ].map((template) => (
                      <div key={template} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{template}</h4>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Template padrão para {template.toLowerCase()}
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Atualizar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prazos Padrão */}
              <Card>
                <CardHeader>
                  <CardTitle>Prazos Processuais Padrão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Prazos Recursais</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="prazo-apelacao">Apelação</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="prazo-apelacao" defaultValue="15" className="w-16" />
                            <span className="text-sm">dias</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="prazo-agravo">Agravo</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="prazo-agravo" defaultValue="15" className="w-16" />
                            <span className="text-sm">dias</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="prazo-especial">Recurso Especial</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="prazo-especial" defaultValue="15" className="w-16" />
                            <span className="text-sm">dias</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Prazos Processuais</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="prazo-contestacao">Contestação</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="prazo-contestacao" defaultValue="15" className="w-16" />
                            <span className="text-sm">dias</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="prazo-impugnacao">Impugnação</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="prazo-impugnacao" defaultValue="15" className="w-16" />
                            <span className="text-sm">dias</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label htmlFor="prazo-manifesto">Manifesto</Label>
                          <div className="flex items-center space-x-2">
                            <Input id="prazo-manifesto" defaultValue="10" className="w-16" />
                            <span className="text-sm">dias</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Prazos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Settings */}
          <TabsContent value="financial">
            <div className="space-y-6">

              {/* Formas de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle>Formas de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Métodos Aceitos</Label>
                      <div className="mt-2 space-y-2">
                        {[
                          { method: 'PIX', icon: '🏦', enabled: true },
                          { method: 'Cartão de Crédito', icon: '💳', enabled: true },
                          { method: 'Cartão de Débito', icon: '💳', enabled: true },
                          { method: 'Transferência Bancária', icon: '🏧', enabled: true },
                          { method: 'Boleto', icon: '📄', enabled: false },
                          { method: 'Dinheiro', icon: '💰', enabled: true }
                        ].map((payment) => (
                          <div key={payment.method} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{payment.icon}</span>
                              <span className="text-sm">{payment.method}</span>
                            </div>
                            <Switch defaultChecked={payment.enabled} />
                          </div>
                        ))}
                      </div>
                    </div>


                  </div>
                </CardContent>
              </Card>





              <div className="flex justify-end">
                <Button onClick={() => {
                  try {
                    alert('✅ Configurações financeiras salvas com sucesso!');
                  } catch (error) {
                    setError('Erro ao salvar configurações financeiras');
                  }
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações Financeiras
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Política de Senhas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min-length">Comprimento Mínimo</Label>
                        <Input id="min-length" type="number" defaultValue="8" />
                      </div>
                      <div>
                        <Label htmlFor="password-expiry">Expiração (dias)</Label>
                        <Input id="password-expiry" type="number" defaultValue="90" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label>Requer letras maiúsculas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label>Requer números</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label>Requer caracteres especiais</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sessões</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="session-timeout">Timeout (minutos)</Label>
                        <Input id="session-timeout" type="number" defaultValue="60" />
                      </div>
                      <div>
                        <Label htmlFor="max-sessions">Máximo de Sessões</Label>
                        <Input id="max-sessions" type="number" defaultValue="3" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Log de Auditoria</h3>
                    <div>
                      <Label htmlFor="audit-retention">Retenção (dias)</Label>
                      <Input id="audit-retention" type="number" defaultValue="365" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Registrar todas as ações</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Autenticação de Dois Fatores</h3>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Switch />
                      <Label>Ativar autenticação de dois fatores (2FA)</Label>
                    </div>
                    <Button variant="outline" onClick={() => alert('📱 Configurando 2FA via QR Code...')}>
                      <Shield className="h-4 w-4 mr-2" />
                      Configurar 2FA
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Backup e Recuperação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" onClick={() => alert('💾 Gerando backup completo do sistema...')}>
                        <Download className="h-4 w-4 mr-2" />
                        Gerar Backup
                      </Button>
                      <Button variant="outline" onClick={() => alert('�� Abrindo assistente de restauração...')}>
                        <Upload className="h-4 w-4 mr-2" />
                        Restaurar Backup
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sessões Ativas</h3>
                    <div className="space-y-2">
                      {[
                        { device: 'Chrome - Windows', location: 'São Paulo, BR', lastActive: 'Agora', current: true },
                        { device: 'Safari - iPhone', location: 'São Paulo, BR', lastActive: '2 horas atrás', current: false },
                        { device: 'Firefox - Linux', location: 'Rio de Janeiro, BR', lastActive: '1 dia atrás', current: false }
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{session.device}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.location} • {session.lastActive}
                              {session.current && <Badge variant="outline" className="ml-2">Atual</Badge>}
                            </div>
                          </div>
                          {!session.current && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alert('🔒 Sessão encerrada com sucesso!')}
                            >
                              Encerrar
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => alert('🔒 Todas as outras sessões foram encerradas!')}
                    >
                      Encerrar Todas as Outras Sessões
                    </Button>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => alert('📊 Exportando logs de auditoria...')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Logs
                    </Button>
                    <Button onClick={handleSaveSecurity}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Template Editor Modal */}
        <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Editar Template de {currentTemplate === 'budget' ? 'Orçamento' : 'Fatura'}
              </DialogTitle>
              <DialogDescription>
                Personalize o template de {currentTemplate === 'budget' ? 'orçamento' : 'fatura'}. Use as variáveis entre colchetes como [NOME_EMPRESA], [VALOR_TOTAL], etc.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="template-content">Conteúdo do Template</Label>
                <Textarea
                  id="template-content"
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  placeholder="Digite o conteúdo do template..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📝 Variáveis disponíveis:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <code>[NOME_EMPRESA]</code>
                  <code>[DATA]</code>
                  <code>[NOME_CLIENTE]</code>
                  <code>[DOCUMENTO_CLIENTE]</code>
                  <code>[VALOR_TOTAL]</code>
                  <code>[DESCRICAO_SERVICOS]</code>
                  {currentTemplate === 'invoice' && (
                    <>
                      <code>[NUMERO_FATURA]</code>
                      <code>[DATA_EMISSAO]</code>
                      <code>[DATA_VENCIMENTO]</code>
                      <code>[FORMA_PAGAMENTO]</code>
                    </>
                  )}
                  <code>[ASSINATURA]</code>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  try {
                    setCurrentTemplate(null);
                    setTemplateContent('');
                    setTimeout(() => {
                      setShowTemplateModal(false);
                    }, 0);
                  } catch (error) {
                    console.error('Erro ao cancelar:', error);
                    setShowTemplateModal(false);
                  }
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  alert(`✅ Template de ${currentTemplate === 'budget' ? 'orçamento' : 'fatura'} salvo com sucesso!`);
                  setShowTemplateModal(false);
                  setCurrentTemplate(null);
                  setTemplateContent('');
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Account Modal */}
        <Dialog open={showNewAccountModal} onOpenChange={setShowNewAccountModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                {editingAccount ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
              </DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Atualize as informações da conta bancária.' : 'Adicione uma nova conta bancária ao sistema.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bank-name">Banco</Label>
                <Input
                  id="bank-name"
                  placeholder="Nome do banco"
                  defaultValue={editingAccount?.bank || ''}
                />
              </div>
              <div>
                <Label htmlFor="account-number">Número da Conta</Label>
                <Input
                  id="account-number"
                  placeholder="1234-5"
                  defaultValue={editingAccount?.account || ''}
                />
              </div>
              <div>
                <Label htmlFor="account-type">Tipo de Conta</Label>
                <Select defaultValue={editingAccount?.type || 'Conta Corrente'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conta Corrente">Conta Corrente</SelectItem>
                    <SelectItem value="Poupança">Poupança</SelectItem>
                    <SelectItem value="Conta Investimento">Conta Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="initial-balance">Saldo Inicial</Label>
                <Input
                  id="initial-balance"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  defaultValue={editingAccount?.balance || ''}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  try {
                    setEditingAccount(null);
                    setTimeout(() => {
                      setShowNewAccountModal(false);
                    }, 0);
                  } catch (error) {
                    console.error('Erro ao cancelar:', error);
                    setShowNewAccountModal(false);
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (editingAccount) {
                    alert('✅ Conta bancária atualizada com sucesso!');
                  } else {
                    const newAccount = {
                      id: Date.now().toString(),
                      bank: 'Nova Conta',
                      account: '0000-0',
                      balance: 0,
                      type: 'Conta Corrente'
                    };
                    setAccounts([...accounts, newAccount]);
                    alert('✅ Nova conta bancária adicionada com sucesso!');
                  }
                  setShowNewAccountModal(false);
                  setEditingAccount(null);
                }}
              >
                {editingAccount ? 'Atualizar' : 'Adicionar'} Conta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
