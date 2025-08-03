import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users, 
  Shield,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react';
import { User, UserRole } from '@/types/settings';

// Mock data
const mockRoles: UserRole[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acesso completo ao sistema',
    permissions: [
      { module: 'crm', action: 'admin', granted: true },
      { module: 'projetos', action: 'admin', granted: true },
      { module: 'financeiro', action: 'admin', granted: true },
      { module: 'configuracoes', action: 'admin', granted: true },
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Advogado Sênior',
    description: 'Acesso limitado - casos específicos',
    permissions: [
      { module: 'crm', action: 'write', granted: true },
      { module: 'projetos', action: 'write', granted: true },
      { module: 'financeiro', action: 'read', granted: true },
      { module: 'configuracoes', action: 'read', granted: false },
    ],
    isSystem: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Paralegal',
    description: 'Acesso somente leitura',
    permissions: [
      { module: 'crm', action: 'read', granted: true },
      { module: 'projetos', action: 'read', granted: true },
      { module: 'financeiro', action: 'read', granted: false },
      { module: 'configuracoes', action: 'read', granted: false },
    ],
    isSystem: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Silva',
    email: 'silva@escritorio.com.br',
    phone: '(11) 99999-1234',
    roleId: '1',
    role: mockRoles[0],
    status: 'active',
    lastLogin: '2024-01-28T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-28T14:30:00Z',
    permissions: mockRoles[0].permissions,
    clientPortalAccess: false,
  },
  {
    id: '2',
    name: 'Dra. Costa',
    email: 'costa@escritorio.com.br',
    phone: '(11) 88888-5678',
    roleId: '2',
    role: mockRoles[1],
    status: 'active',
    lastLogin: '2024-01-28T10:15:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-28T10:15:00Z',
    permissions: mockRoles[1].permissions,
    clientPortalAccess: false,
  },
  {
    id: '3',
    name: 'Ana Paralegal',
    email: 'ana@escritorio.com.br',
    phone: '(11) 77777-9999',
    roleId: '3',
    role: mockRoles[2],
    status: 'active',
    lastLogin: '2024-01-27T16:45:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-27T16:45:00Z',
    permissions: mockRoles[2].permissions,
    clientPortalAccess: true,
  },
  {
    id: '4',
    name: 'Carlos Estagiário',
    email: 'carlos@escritorio.com.br',
    roleId: '3',
    role: mockRoles[2],
    status: 'pending',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    permissions: mockRoles[2].permissions,
    clientPortalAccess: false,
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<UserRole[]>(mockRoles);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [editingRole, setEditingRole] = useState<UserRole | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="space-y-6">
      {/* Users Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gerenciamento de Usuários
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie usuários, permissões e acesso ao sistema
              </p>
            </div>
            <Button onClick={() => setShowUserDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Portal Cliente</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center w-fit">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          {new Date(user.lastLogin).toLocaleString('pt-BR')}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.clientPortalAccess}
                          onCheckedChange={(checked) => {
                            setUsers(users.map(u => 
                              u.id === user.id 
                                ? { ...u, clientPortalAccess: checked }
                                : u
                            ));
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {user.clientPortalAccess ? 'Habilitado' : 'Desabilitado'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            {user.status === 'active' ? (
                              <><UserX className="mr-2 h-4 w-4" />Desativar</>
                            ) : (
                              <><UserCheck className="mr-2 h-4 w-4" />Ativar</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteUser(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Roles Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Funções e Permissões
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure níveis de acesso e permissões por função
              </p>
            </div>
            <Button onClick={() => setShowRoleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Função
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    {!role.isSystem && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingRole(role)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  {role.isSystem && (
                    <Badge variant="secondary" className="w-fit">Sistema</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Permissões:</h4>
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{permission.module}</span>
                        <Badge 
                          variant={permission.granted ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {permission.action}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      {users.filter(u => u.roleId === role.id).length} usuários
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              Configure as informações e permissões do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nome completo" />
            <Input type="email" placeholder="Email" />
            <Input placeholder="Telefone" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch />
              <span className="text-sm">Acesso ao Portal do Cliente</span>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Cancelar
              </Button>
              <Button>
                {editingUser ? 'Atualizar' : 'Criar'} Usuário
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Form Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Editar Função' : 'Nova Função'}
            </DialogTitle>
            <DialogDescription>
              Configure o nome, descrição e permissões da função.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nome da função" />
            <Input placeholder="Descrição" />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Permissões por Módulo:</h4>
              {['CRM', 'Projetos', 'Tarefas', 'Cobrança', 'Financeiro', 'Configurações'].map((module) => (
                <div key={module} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{module}</span>
                  <div className="flex space-x-2">
                    {['read', 'write', 'delete', 'admin'].map((action) => (
                      <label key={action} className="flex items-center space-x-1 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span className="capitalize">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                Cancelar
              </Button>
              <Button>
                {editingRole ? 'Atualizar' : 'Criar'} Função
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
