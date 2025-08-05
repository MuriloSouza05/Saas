import React from 'react';
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
import { X } from 'lucide-react';
import { Client } from '@/types/crm';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  organization: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  mobile: z.string().min(1, 'Telefone é obrigatório'),
  country: z.string().min(1, 'País é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
  address: z.string().optional(),
  city: z.string().min(1, 'Cidade é obrigatória'),
  zipCode: z.string().optional(),
  budget: z.number().min(0, 'Orçamento deve ser positivo').optional(),
  currency: z.enum(['BRL', 'USD', 'EUR']),
  level: z.string().optional(),
  description: z.string().optional(),
  pis: z.string().optional(),
  cei: z.string().optional(),
  professionalTitle: z.string().optional(),
  maritalStatus: z.string().optional(),
  birthDate: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  inssStatus: z.string().optional(),
  amountPaid: z.number().optional(),
  referredBy: z.string().optional(),
  registeredBy: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  onSubmit: (data: ClientFormData) => void;
  isEditing?: boolean;
}

const countries = [
  { value: 'BR', label: 'Brasil' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'DE', label: 'Alemanha' },
  { value: 'FR', label: 'França' },
];

const maritalStatuses = [
  { value: 'single', label: 'Solteiro(a)' },
  { value: 'married', label: 'Casado(a)' },
  { value: 'divorced', label: 'Divorciado(a)' },
  { value: 'widowed', label: 'Viúvo(a)' },
];

const inssStatuses = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'retired', label: 'Aposentado' },
  { value: 'pensioner', label: 'Pensionista' },
];

export function ClientForm({ open, onOpenChange, client, onSubmit, isEditing = false }: ClientFormProps) {
  const [tags, setTags] = React.useState<string[]>(client?.tags || []);
  const [newTag, setNewTag] = React.useState('');

  // FUNCIONALIDADE: Upload de arquivos para cliente
  // Sistema de planos futuros:
  // - Plano Básico: 1 arquivo por cliente
  // - Plano Intermediário: 2 arquivos por cliente
  // - Plano Premium: arquivos ilimitados por cliente
  const [clientFiles, setClientFiles] = React.useState<File[]>([]);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const MAX_FILES_BY_PLAN = 3; // Temporário - será dinâmico baseado no plano

  // Atualizar tags quando client mudar
  React.useEffect(() => {
    setTags(client?.tags || []);
  }, [client]);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      organization: client?.organization || '',
      email: client?.email || '',
      mobile: client?.mobile || '',
      country: client?.country || 'BR',
      state: client?.state || '',
      address: client?.address || '',
      city: client?.city || '',
      zipCode: client?.zipCode || '',
      budget: client?.budget || 0,
      currency: client?.currency || 'BRL',
      level: client?.level || '',
      description: client?.description || '',
      pis: client?.pis || '',
      cei: client?.cei || '',
      professionalTitle: client?.professionalTitle || '',
      maritalStatus: client?.maritalStatus || '',
      birthDate: client?.birthDate || '',
      cpf: client?.cpf || '',
      rg: client?.rg || '',
      inssStatus: client?.inssStatus || '',
      amountPaid: client?.amountPaid || 0,
      referredBy: client?.referredBy || '',
      registeredBy: client?.registeredBy || 'Dr. Advogado',
    },
  });

  // Atualizar formulário quando client mudar
  React.useEffect(() => {
    if (client) {
      form.reset({
        name: client.name || '',
        organization: client.organization || '',
        email: client.email || '',
        mobile: client.mobile || '',
        country: client.country || 'BR',
        state: client.state || '',
        address: client.address || '',
        city: client.city || '',
        zipCode: client.zipCode || '',
        budget: client.budget || 0,
        currency: client.currency || 'BRL',
        level: client.level || '',
        description: client.description || '',
        pis: client.pis || '',
        cei: client.cei || '',
        professionalTitle: client.professionalTitle || '',
        maritalStatus: client.maritalStatus || '',
        birthDate: client.birthDate || '',
        cpf: client.cpf || '',
        rg: client.rg || '',
        inssStatus: client.inssStatus || '',
        amountPaid: client.amountPaid || 0,
        referredBy: client.referredBy || '',
        registeredBy: client.registeredBy || 'Dr. Advogado',
      });
    }
  }, [client, form]);

  const handleSubmit = (data: ClientFormData) => {
    onSubmit({ ...data, tags });
    onOpenChange(false);
    form.reset();
    setTags([]);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do cliente. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
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
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
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
                        <Input placeholder="Rua, número, bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
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

            {/* Campos Jurídicos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Jurídicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RG</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIS</FormLabel>
                      <FormControl>
                        <Input placeholder="000.00000.00-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cei"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEI</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.00000/00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="professionalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título Profissional</FormLabel>
                      <FormControl>
                        <Input placeholder="Advogado, Aposentado, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Civil</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado civil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {maritalStatuses.map((status) => (
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
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inssStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status INSS</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status INSS" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inssStatuses.map((status) => (
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
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Pago (R$)</FormLabel>
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
                  name="referredBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicado Por</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do indicador" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registeredBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colaborador que Cadastrou</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do colaborador" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Informações adicionais sobre o cliente" {...field} />
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
                {isEditing ? 'Atualizar Cliente' : 'Adicionar Cliente'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
