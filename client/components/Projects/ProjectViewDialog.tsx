import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  FolderKanban,
  DollarSign,
  Calendar,
  Edit,
  Users,
  Tag,
  FileText,
  AlertTriangle,
  Clock,
  User,
  Building,
  Mail,
  Phone,
} from 'lucide-react';
import { Project } from '@/types/projects';

interface ProjectViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onEdit?: (project: Project) => void;
}

export function ProjectViewDialog({ 
  open, 
  onOpenChange, 
  project, 
  onEdit 
}: ProjectViewDialogProps) {
  if (!project) return null;

  const formatCurrency = (value: number, currency: string) => {
    const formatters = {
      BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    };
    return formatters[currency as keyof typeof formatters]?.format(value) || `${currency} ${value}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      planejamento: 'Planejamento',
      andamento: 'Em Andamento',
      revisao: 'Em Revisão',
      aguardando_cliente: 'Aguardando Cliente',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
      arquivado: 'Arquivado',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planejamento: 'bg-blue-100 text-blue-800',
      andamento: 'bg-yellow-100 text-yellow-800',
      revisao: 'bg-purple-100 text-purple-800',
      aguardando_cliente: 'bg-orange-100 text-orange-800',
      concluido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      arquivado: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: string) => {
    const priorityMap = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isOverdue = new Date(project.dueDate) < new Date() && 
                   !['concluido', 'cancelado', 'arquivado'].includes(project.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FolderKanban className="h-8 w-8 text-blue-600" />
              <div>
                <DialogTitle className="text-xl">{project.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{project.clientName}</span>
                    {project.organization && (
                      <>
                        <span>•</span>
                        <Building className="h-4 w-4" />
                        <span>{project.organization}</span>
                      </>
                    )}
                  </div>
                  {/* IMPLEMENTAÇÃO: Mostrar colaborador que criou o projeto */}
                  {project.createdBy && (
                    <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                      <span>Criado por: {project.createdBy}</span>
                    </div>
                  )}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
              <Badge className={getPriorityColor(project.priority)}>
                {getPriorityLabel(project.priority)}
              </Badge>
              {isOverdue && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Atrasado
                </Badge>
              )}
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progresso */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso do Projeto</span>
              <span className="text-sm text-muted-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Cronograma
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data de Início:</span>
                  <span>{formatDate(project.startDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prazo:</span>
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {formatDate(project.dueDate)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Atualizado em:</span>
                  <span>{formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Informações Financeiras
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Orçamento:</span>
                  <span className="font-medium">
                    {formatCurrency(project.budget, project.currency)}
                  </span>
                </div>
                {project.address && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Endereço:</span>
                    <span className="text-right flex-1 ml-2">{project.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Equipe Atribuída */}
          {project.assignedTo && project.assignedTo.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <Users className="h-5 w-5 mr-2" />
                Equipe Atribuída
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.assignedTo.map((member) => (
                  <Badge key={member} variant="outline">
                    {member}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contatos */}
          {project.contacts && project.contacts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <User className="h-5 w-5 mr-2" />
                Contatos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.contacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{contact.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {contact.role}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Descrição */}
          {project.description && (
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <FileText className="h-5 w-5 mr-2" />
                Descrição
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          )}

          {/* Notas */}
          {project.notes && (
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <FileText className="h-5 w-5 mr-2" />
                Observações
              </h3>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">{project.notes}</p>
              </div>
            </div>
          )}

          {/* Anexos */}
          {project.attachments && project.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Anexos</h3>
              <div className="space-y-2">
                {project.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{attachment}</span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
