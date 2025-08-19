/**
 * PÁGINA PRINCIPAL - PAINEL DE PUBLICAÇÕES
 * =======================================
 *
 * Página principal do módulo de Publicações com navegação por abas.
 * Inclui duas seções: Publicações e Consultar Cliente/Processos.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Newspaper, 
  Search, 
  Filter, 
  Eye, 
  Plus,
  FileSearch,
  Calendar,
  Building2,
  Scale
} from "lucide-react";
import { Publication, PublicationStatus } from "@/types/publications";

/**
 * DADOS MOCK - SERÃO SUBSTITUÍDOS POR API
 * ======================================
 *
 * IMPORTANTE PARA O BACKEND:
 *
 * ENDPOINT NECESSÁRIO: GET /api/publicacoes/carregar
 * - Busca novas publicações dos diários oficiais
 * - Retorna: Data Publicação, Processo, Diário, Vara/Comarca, Nome Pesquisado
 * - Todas as novas publicações devem vir com status: 'nova'
 * - Implementar filtros por data, comarca, etc.
 *
 * ENDPOINT: PATCH /api/publicacoes/{id}/status
 * - Atualiza status da publicação
 * - Usado para mudança automática NOVA -> PENDENTE ao visualizar
 */
const mockPublications: Publication[] = [
  {
    id: "1",
    dataPublicacao: new Date("2024-01-15"),
    processo: "1001234-56.2024.8.26.0100",
    diario: "Diário de Justiça Eletrônico",
    varaComarca: "1ª Vara Cível - São Paulo/SP",
    nomePesquisado: "João Silva Santos",
    status: "nova", // Status inicial de publicações da API
    conteudo: "Intimação para audiência de conciliação...",
    urgencia: "alta"
  },
  {
    id: "2",
    dataPublicacao: new Date("2024-01-14"),
    processo: "2001234-56.2024.8.26.0200",
    diario: "Diário Oficial do Estado",
    varaComarca: "2ª Vara Criminal - Rio de Janeiro/RJ",
    nomePesquisado: "Maria Oliveira Costa",
    status: "pendente", // Já foi visualizada
    conteudo: "Sentença publicada nos autos...",
    urgencia: "media"
  },
  {
    id: "3",
    dataPublicacao: new Date("2024-01-13"),
    processo: "3001234-56.2024.8.26.0300",
    diario: "Diário de Justiça Eletrônico",
    varaComarca: "Vara de Família - Brasília/DF",
    nomePesquisado: "Carlos Eduardo Lima",
    status: "descartada",
    conteudo: "Publicação não relacionada ao caso...",
    urgencia: "baixa"
  },
  {
    id: "4",
    dataPublicacao: new Date("2024-01-12"),
    processo: "4001234-56.2024.8.26.0400",
    diario: "Diário de Justiça Eletrônico",
    varaComarca: "3ª Vara Trabalhista - São Paulo/SP",
    nomePesquisado: "Ana Paula Silva",
    status: "atribuida",
    conteudo: "Despacho do juiz...",
    responsavel: "Dr. Silva",
    urgencia: "alta",
    atribuidoPara: {
      id: "1",
      nome: "Dr. Silva",
      email: "silva@escritorio.com",
      cargo: "Gerente",
      ativo: true
    }
  },
];

const getStatusBadge = (status: PublicationStatus) => {
  const statusConfig = {
    nova: {
      label: "Nova",
      variant: "default" as const,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    pendente: {
      label: "Pendente",
      variant: "secondary" as const,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    },
    atribuida: {
      label: "Atribuída",
      variant: "outline" as const,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    },
    finalizada: {
      label: "Finalizada",
      variant: "outline" as const,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    },
    descartada: {
      label: "Descartada",
      variant: "destructive" as const,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  };

  return statusConfig[status];
};

const getUrgencyColor = (urgencia?: string) => {
  switch (urgencia) {
    case 'alta': return 'text-red-600';
    case 'media': return 'text-yellow-600';
    case 'baixa': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

export function Publications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleViewPublication = (publication: Publication) => {
    // BACKEND: Implementar mudança automática de status NOVA -> PENDENTE
    if (publication.status === 'nova') {
      // Fazer PATCH /api/publicacoes/{id}/status para mudar para 'pendente'
      console.log(`Mudando status da publicação ${publication.id} de NOVA para PENDENTE`);
    }
    navigate(`/publicacoes/${publication.id}`);
  };

  const handleLoadPublications = async () => {
    setIsLoading(true);
    try {
      // BACKEND: Implementar chamada para API
      // const response = await fetch('/api/publicacoes/carregar');
      // const newPublications = await response.json();

      console.log('Carregando novas publicações da API...');

      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Atualizar estado com novas publicações
      console.log('Publicações carregadas com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar publicações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPublications = mockPublications.filter(pub =>
    pub.processo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.nomePesquisado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.varaComarca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Painel de Publicações</h1>
          </div>
        </div>

        <Tabs defaultValue="publicacoes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="publicacoes" className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4" />
              <span>Publicações</span>
            </TabsTrigger>
            <TabsTrigger value="consultar" className="flex items-center space-x-2">
              <FileSearch className="h-4 w-4" />
              <span>Consultar Cliente/Processos</span>
            </TabsTrigger>
          </TabsList>

          {/* ABA PUBLICAÇÕES */}
          <TabsContent value="publicacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Newspaper className="h-5 w-5" />
                    <span>Lista de Publicações</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleLoadPublications}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Carregando...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Carregar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por processo, nome ou comarca..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data Publicação</TableHead>
                        <TableHead>Processo</TableHead>
                        <TableHead>Diário</TableHead>
                        <TableHead>Vara/Comarca</TableHead>
                        <TableHead>Nome Pesquisado</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Urgência</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPublications.map((publication) => {
                        const statusConfig = getStatusBadge(publication.status);
                        return (
                          <TableRow 
                            key={publication.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleViewPublication(publication)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{publication.dataPublicacao.toLocaleDateString('pt-BR')}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {publication.processo}
                            </TableCell>
                            <TableCell>{publication.diario}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{publication.varaComarca}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {publication.nomePesquisado}
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusConfig.variant} className={statusConfig.color}>
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`text-xs font-medium ${getUrgencyColor(publication.urgencia)}`}>
                                {publication.urgencia?.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPublication(publication);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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

          {/* ABA CONSULTAR CLIENTE/PROCESSOS */}
          <TabsContent value="consultar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileSearch className="h-5 w-5" />
                  <span>Consultar Cliente/Processos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center space-y-2">
                    <FileSearch className="h-12 w-12 mx-auto opacity-50" />
                    <p>Funcionalidade de consulta em desenvolvimento</p>
                    <p className="text-sm">Em breve você poderá consultar clientes e processos</p>
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
