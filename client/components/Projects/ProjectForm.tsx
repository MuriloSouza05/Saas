import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';
import { Project, ProjectContact, ProjectStatus } from '@/types/projects';

const projectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  clientName: z.string().min(1, 'Cliente é obrigatório'),
  organization: z.string().optional(),
  address: z.string().optional(),
  budget: z.number().min(0, 'Orçamento deve ser positivo').optional(),
  currency: z.enum(['BRL', 'USD', 'EUR']),
  status: z.enum(['novo', 'analise', 'andamento', 'aguardando', 'revisao', 'concluido', 'cancelado', 'arquivado']),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  progress: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSubmit: (data: ProjectFormData & { tags: string[]; contacts: ProjectContact[] }) => void;
  isEditing?: boolean;
}

const statusOptions = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  { value: 'analise', label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'andamento', label: 'Em Andamento', color: 'bg-green-100 text-green-800' },
  { value: 'aguardando', label: 'Aguardando Cliente', color: 'bg-orange-100 text-orange-800' },
  { value: 'revisao', label: 'Revisão', color: 'bg-purple-100 text-purple-800' },
  { value: 'concluido', label: 'Concluído', color: 'bg-green-100 text-green-800' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  { value: 'arquivado', label: 'Arquivado', color: 'bg-gray-100 text-gray-800' },
];

const priorityOptions = [
  { value: 'low', label: 'Baixa', color: 'text-gray-600' },
  { value: 'medium', label: 'Média', color: 'text-blue-600' },
  { value: 'high', label: 'Alta', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgente', color: 'text-red-600' },
];

export function ProjectForm({ open, onOpenChange, project, onSubmit, isEditing = false }: ProjectFormProps) {
  const [tags, setTags] = useState<string[]>(project?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [contacts, setContacts] = useState<ProjectContact[]>(project?.contacts || []);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', role: '' });

  // FUNCIONALIDADE: Upload de arquivos para projeto
  // Sistema de planos futuros:
  // - Plano Básico: 1 arquivo por projeto
  // - Plano Intermediário: 2 arquivos por projeto
  // - Plano Premium: arquivos ilimitados por projeto
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const MAX_FILES_BY_PLAN = 5; // Temporário - será dinâmico baseado no plano

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      clientName: project?.clientName || '',
      organization: project?.organization || '',
      address: project?.address || '',
      budget: project?.budget || 0,
      currency: project?.currency || 'BRL',
      status: project?.status || 'novo',
      startDate: project?.startDate ? project.startDate.split('T')[0] : '',
      dueDate: project?.dueDate ? project.dueDate.split('T')[0] : '',
      priority: project?.priority || 'medium',
      progress: project?.progress || 0,
      notes: project?.notes || '',
    },
  });

  // Atualizar formulário quando project mudar
  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title || '',
        description: project.description || '',
        clientName: project.clientName || '',
        organization: project.organization || '',
        address: project.address || '',
        budget: project.budget || 0,
        currency: project.currency || 'BRL',
        status: project.status || 'novo',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        dueDate: project.dueDate ? project.dueDate.split('T')[0] : '',
        priority: project.priority || 'medium',
        progress: project.progress || 0,
        notes: project.notes || '',
      });
      setTags(project.tags || []);
      setContacts(project.contacts || []);
    } else {
      setTags([]);
      setContacts([]);
    }
  }, [project, form]);

  const handleSubmit = (data: ProjectFormData) => {
    onSubmit({ ...data, tags, contacts });
    onOpenChange(false);
    form.reset();
    setTags([]);
    setContacts([]);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.email.trim()) {
      const contact: ProjectContact = {
        id: Date.now().toString(),
        ...newContact,
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', email: '', phone: '', role: '' });
    }
  };

  const removeContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  // FUNCIONALIDADE: Gerenciamento de arquivos do projeto
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Verificar limite de arquivos baseado no plano
    if (projectFiles.length + files.length > MAX_FILES_BY_PLAN) {
      setFileError(`Limite excedido. Seu plano permite até ${MAX_FILES_BY_PLAN} arquivos por projeto.`);
      return;
    }

    // Verificar tipos de arquivo permitidos
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setFileError('Apenas arquivos PNG, JPEG e PDF são permitidos.');
      return;
    }

    // Verificar tamanho dos arquivos (máximo 10MB por arquivo)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setFileError('Arquivos devem ter no máximo 10MB.');
      return;
    }

    setProjectFiles([...projectFiles, ...files]);
    setFileError(null);
  };

  const removeFile = (index: number) => {
    setProjectFiles(projectFiles.filter((_, i) => i !== index));
    setFileError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do projeto jurídico. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Projeto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Título do Projeto *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Ação Trabalhista - João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descrição detalhada do projeto..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organização</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BRL">Real (R$)</SelectItem>
                          <SelectItem value="USD">Dólar (US$)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status e Cronograma */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status e Cronograma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Vencimento *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progresso (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contatos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contatos do Projeto</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input
                    placeholder="Nome"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                  <Input
                    placeholder="Email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                  <Input
                    placeholder="Telefone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Função"
                      value={newContact.role}
                      onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    />
                    <Button type="button" onClick={addContact}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {contact.email} • {contact.phone} • {contact.role}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Informações adicionais sobre o projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {
                try {
                  setTimeout(() => {
                    onOpenChange(false);
                  }, 0);
                } catch (error) {
                  console.error('Erro ao cancelar:', error);
                  onOpenChange(false);
                }
              }}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar Projeto' : 'Criar Projeto'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
