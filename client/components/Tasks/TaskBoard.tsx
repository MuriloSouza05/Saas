import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
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
  Clock,
  AlertTriangle,
  User,
  CheckSquare,
  Timer
} from 'lucide-react';
import { Task, TaskBoard as TaskBoardType, TaskStatus } from '@/types/tasks';

interface TaskBoardProps {
  boards: TaskBoardType[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onViewTask: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

const statusConfig = {
  not_started: { name: '🔴 Não Feito', color: 'bg-red-100 text-red-800 border-red-200' },
  in_progress: { name: '🟡 Em Progresso', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  completed: { name: '🟢 Feito', color: 'bg-green-100 text-green-800 border-green-200' },
  on_hold: { name: '⏸️ Pausado', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  cancelled: { name: '❌ Cancelado', color: 'bg-red-100 text-red-800 border-red-200' },
};

const priorityConfig = {
  low: { icon: '🔵', color: 'text-blue-600' },
  medium: { icon: '🟡', color: 'text-yellow-600' },
  high: { icon: '🟠', color: 'text-orange-600' },
  urgent: { icon: '🔴', color: 'text-red-600' },
};

export function TaskBoard({ 
  boards, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onMoveTask,
  onViewTask,
  onToggleSubtask
}: TaskBoardProps) {
  const getDaysUntilDue = (endDate: string) => {
    const due = new Date(endDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (endDate: string) => {
    return getDaysUntilDue(endDate) < 0;
  };

  const getCompletedSubtasks = (task: Task) => {
    const completed = task.subtasks.filter(st => st.completed).length;
    const total = task.subtasks.length;
    return { completed, total };
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onMoveTask(taskId, targetStatus);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
      {boards.map((board) => (
        <div
          key={board.id}
          className="flex flex-col h-full"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, board.id)}
        >
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {statusConfig[board.id]?.name || board.name}
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddTask(board.id)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                {board.tasks.length} tarefas
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 p-3 pt-0">
              {board.tasks.map((task) => {
                const daysUntilDue = getDaysUntilDue(task.endDate);
                const overdue = isOverdue(task.endDate);
                const subtaskStats = getCompletedSubtasks(task);
                
                return (
                  <Card
                    key={task.id}
                    className="cursor-move hover:shadow-md transition-shadow border-l-4"
                    style={{ borderLeftColor: 
                      task.priority === 'urgent' ? '#ef4444' : 
                      task.priority === 'high' ? '#f97316' :
                      task.priority === 'medium' ? '#f59e0b' : '#6b7280' }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 
                              className="text-sm font-medium line-clamp-2 cursor-pointer hover:text-blue-600"
                              onClick={() => onViewTask(task)}
                            >
                              {task.title}
                            </h4>
                            {task.projectTitle && (
                              <p className="text-xs text-muted-foreground mt-1">
                                📁 {task.projectTitle}
                              </p>
                            )}
                            {task.clientName && (
                              <p className="text-xs text-muted-foreground">
                                👤 {task.clientName}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">
                              {priorityConfig[task.priority].icon}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onViewTask(task)}>
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEditTask(task)}>
                                  <Edit className="mr-2 h-3 w-3" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => onDeleteTask(task.id)}
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
                            <span className="font-medium">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-1" />
                        </div>

                        {/* Assigned User */}
                        <div className="flex items-center text-xs">
                          <User className="h-3 w-3 mr-1 text-muted-foreground" />
                          <Avatar className="h-5 w-5 mr-2">
                            <AvatarFallback className="text-xs">
                              {task.assignedTo.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{task.assignedTo}</span>
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className={overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                            {new Date(task.endDate).toLocaleDateString('pt-BR')}
                            {overdue && (
                              <span className="ml-1">
                                <AlertTriangle className="h-3 w-3 inline" />
                                Vencido
                              </span>
                            )}
                            {!overdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                              <span className="ml-1 text-orange-600">
                                <Clock className="h-3 w-3 inline" />
                                {daysUntilDue}d
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Hours */}
                        {(task.estimatedHours || task.actualHours) && (
                          <div className="flex items-center text-xs">
                            <Timer className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {task.actualHours || 0}h / {task.estimatedHours || 0}h
                            </span>
                          </div>
                        )}

                        {/* Subtasks */}
                        {task.subtasks.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center text-xs">
                              <CheckSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {subtaskStats.completed}/{subtaskStats.total} subtarefas
                              </span>
                            </div>
                            <div className="space-y-1">
                              {task.subtasks.slice(0, 3).map((subtask) => (
                                <div key={subtask.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={subtask.completed}
                                    onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                                    className="h-3 w-3"
                                  />
                                  <span className={`text-xs ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {subtask.title}
                                  </span>
                                </div>
                              ))}
                              {task.subtasks.length > 3 && (
                                <p className="text-xs text-muted-foreground">
                                  +{task.subtasks.length - 3} mais
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Description preview */}
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Created date */}
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          Criado: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {board.tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Nenhuma tarefa</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddTask(board.id)}
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
