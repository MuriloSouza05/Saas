import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  DollarSign,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Project, ProjectStage, ProjectStatus } from '@/types/projects';

interface ProjectKanbanProps {
  stages: ProjectStage[];
  onAddProject: (status: ProjectStatus) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onMoveProject: (projectId: string, newStatus: ProjectStatus) => void;
  onViewProject: (project: Project) => void;
}

const statusConfig = {
  novo: { name: 'Novo', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  analise: { name: 'Em Análise', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  andamento: { name: 'Em Andamento', color: 'bg-green-100 text-green-800 border-green-200' },
  aguardando: { name: 'Aguardando Cliente', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  revisao: { name: 'Revisão', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  concluido: { name: 'Concluído', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelado: { name: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200' },
  arquivado: { name: 'Arquivado', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

const priorityConfig = {
  low: { icon: '🔵', color: 'text-blue-600' },
  medium: { icon: '🟡', color: 'text-yellow-600' },
  high: { icon: '🟠', color: 'text-orange-600' },
  urgent: { icon: '🔴', color: 'text-red-600' },
};

export function ProjectKanban({ 
  stages, 
  onAddProject, 
  onEditProject, 
  onDeleteProject, 
  onMoveProject,
  onViewProject
}: ProjectKanbanProps) {
  const formatCurrency = (value: number, currency: string) => {
    const formatters = {
      BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    };
    return formatters[currency as keyof typeof formatters]?.format(value) || `${currency} ${value}`;
  };

  const getTotalValue = (projects: Project[]) => {
    return projects.reduce((total, project) => total + project.budget, 0);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (dueDate: string) => {
    return getDaysUntilDue(dueDate) < 0;
  };

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.setData('text/plain', projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ProjectStatus) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    onMoveProject(projectId, targetStatus);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex flex-col h-full"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {statusConfig[stage.id]?.name || stage.name}
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddProject(stage.id)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{stage.projects.length} projetos</span>
                <span>
                  {formatCurrency(getTotalValue(stage.projects), 'BRL')}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 p-3 pt-0">
              {stage.projects.map((project) => {
                const daysUntilDue = getDaysUntilDue(project.dueDate);
                const overdue = isOverdue(project.dueDate);
                
                return (
                  <Card
                    key={project.id}
                    className="cursor-move hover:shadow-md transition-shadow border-l-4"
                    style={{ borderLeftColor: statusConfig[project.status]?.color.includes('blue') ? '#3b82f6' : 
                                             statusConfig[project.status]?.color.includes('yellow') ? '#f59e0b' :
                                             statusConfig[project.status]?.color.includes('green') ? '#10b981' :
                                             statusConfig[project.status]?.color.includes('orange') ? '#f97316' :
                                             statusConfig[project.status]?.color.includes('purple') ? '#8b5cf6' :
                                             statusConfig[project.status]?.color.includes('red') ? '#ef4444' : '#6b7280' }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project.id)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 
                              className="text-sm font-medium line-clamp-2 cursor-pointer hover:text-blue-600"
                              onClick={() => onViewProject(project)}
                            >
                              {project.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {project.clientName}
                              {project.organization && ` • ${project.organization}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">
                              {priorityConfig[project.priority].icon}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onViewProject(project)}>
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEditProject(project)}>
                                  <Edit className="mr-2 h-3 w-3" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => onDeleteProject(project.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-3 w-3" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1" />
                        </div>

                        {/* Budget */}
                        <div className="flex items-center text-xs">
                          <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {formatCurrency(project.budget, project.currency)}
                          </span>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className={overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                            {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                            {overdue && (
                              <span className="ml-1">
                                <AlertTriangle className="h-3 w-3 inline" />
                                Vencido
                              </span>
                            )}
                            {!overdue && daysUntilDue <= 7 && daysUntilDue > 0 && (
                              <span className="ml-1 text-orange-600">
                                <Clock className="h-3 w-3 inline" />
                                {daysUntilDue}d
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Assigned Users */}
                        {project.assignedTo.length > 0 && (
                          <div className="flex items-center text-xs">
                            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                            <div className="flex -space-x-1">
                              {project.assignedTo.slice(0, 3).map((user, index) => (
                                <Avatar key={index} className="h-5 w-5 border border-background">
                                  <AvatarFallback className="text-xs">
                                    {user.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {project.assignedTo.length > 3 && (
                                <div className="h-5 w-5 rounded-full bg-muted border border-background flex items-center justify-center text-xs">
                                  +{project.assignedTo.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{project.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Description preview */}
                        {project.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        {/* Created date */}
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          Criado: {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {stage.projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Nenhum projeto</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddProject(stage.id)}
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
