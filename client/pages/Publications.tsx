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
import { PublicationViewDialog } from "@/components/Publications/PublicationViewDialog";

// Dados mock para demonstração
const mockPublications: Publication[] = [
  {
    id: "1",
    dataPublicacao: new Date("2024-01-15"),
    processo: "1001234-56.2024.8.26.0100",
    diario: "Diário de Justiça Eletrônico",
    varaComarca: "1ª Vara Cível - São Paulo/SP",
    nomePesquisado: "João Silva Santos",
    status: "atribuida",
    conteudo: "Intimação para audiência de conciliação...",
    responsavel: "Dr. Advogado Silva",
    urgencia: "alta"
  },
  {
    id: "2",
    dataPublicacao: new Date("2024-01-14"),
    processo: "2001234-56.2024.8.26.0200",
    diario: "Diário Oficial do Estado",
    varaComarca: "2ª Vara Criminal - Rio de Janeiro/RJ",
    nomePesquisado: "Maria Oliveira Costa",
    status: "finalizada",
    conteudo: "Sentença publicada nos autos...",
    responsavel: "Dra. Advogada Santos",
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
];

const getStatusBadge = (status: PublicationStatus) => {
  const statusConfig = {
    descartada: { label: "Descartada", variant: "secondary" as const, color: "text-gray-600" },
    atribuida: { label: "Atribuída", variant: "default" as const, color: "text-blue-600" },
    finalizada: { label: "Finalizada", variant: "outline" as const, color: "text-green-600" }
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
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const handleViewPublication = (publication: Publication) => {
    setSelectedPublication(publication);
    setShowViewDialog(true);
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
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Publicação
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

        {/* Dialog de Visualização */}
        {selectedPublication && (
          <PublicationViewDialog
            publication={selectedPublication}
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
