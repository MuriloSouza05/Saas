/**
 * TIPOS - MÓDULO DE PUBLICAÇÕES
 * =============================
 *
 * Tipos TypeScript para o sistema de Publicações.
 * Inclui definições para publicações, status e filtros.
 *
 * IMPORTANTE PARA O BACKEND:
 * =========================
 *
 * STATUS WORKFLOW:
 * 1. 'nova' - Status inicial de todas as publicações vindas da API
 * 2. 'pendente' - Automaticamente setado quando usuário visualiza uma publicação 'nova'
 * 3. 'atribuida' - Setado quando uma tarefa é atribuída a um membro da equipe
 * 4. 'finalizada' - Quando o processo é concluído
 * 5. 'descartada' - Quando a publicação é descartada
 *
 * REGRAS DE NEGÓCIO:
 * - Nova publicação da API = status 'nova'
 * - Ao clicar para visualizar publicação 'nova' = mudar para 'pendente'
 * - Status 'atribuida' só aparece quando tarefa é atribuída a alguém
 * - Sistema de notificações para membros quando recebem atribuições
 */

export type PublicationStatus = 'nova' | 'pendente' | 'atribuida' | 'finalizada' | 'descartada';

export interface Publication {
  id: string;
  dataPublicacao: Date;
  processo: string;
  diario: string;
  varaComarca: string;
  nomePesquisado: string;
  status: PublicationStatus;
  conteudo?: string;
  observacoes?: string;
  responsavel?: string;
  dataAtualizacao?: Date;
  numeroProcesso?: string;
  cliente?: string;
  urgencia?: 'baixa' | 'media' | 'alta';
  tags?: string[];
}

export interface PublicationFilters {
  status?: PublicationStatus[];
  dataInicio?: Date;
  dataFim?: Date;
  processo?: string;
  diario?: string;
  varaComarca?: string;
  nomePesquisado?: string;
  responsavel?: string;
  urgencia?: ('baixa' | 'media' | 'alta')[];
}

export interface PublicationSearchParams {
  cliente?: string;
  numeroProcesso?: string;
  nomePessoa?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface ClienteProcesso {
  id: string;
  nome: string;
  numeroProcesso: string;
  varaComarca: string;
  status: string;
  dataInicio: Date;
  ultimaMovimentacao?: Date;
  observacoes?: string;
}

// Estatísticas do módulo
export interface PublicationStats {
  total: number;
  descartadas: number;
  atribuidas: number;
  finalizadas: number;
  pendentes: number;
  porcentagemConcluidas: number;
}

// Formato para exibição nas tabelas
export interface PublicationTableItem extends Publication {
  dataPublicacaoFormatted: string;
  statusFormatted: {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color: string;
  };
}
