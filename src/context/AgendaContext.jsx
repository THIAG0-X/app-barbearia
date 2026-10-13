// src/context/AgendaContext.jsx — serviços, horários e agendamentos
import { createContext, useCallback, useMemo, useState } from 'react';
import { AGENDAMENTOS_INICIAIS, HORARIOS_BASE, SERVICOS } from '@/data/mockData';
import { addDays, parseISODate, toISODate } from '@/utils/date';

export const AgendaContext = createContext(null);

const inicioDoDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const novoId = () => `ag${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

export function AgendaProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS);
  const [servicos, setServicos] = useState(SERVICOS);
  // { [barbeiroId]: ['08:00', ...] } — sem entrada = todos os horários base
  const [horariosPorBarbeiro, setHorariosPorBarbeiro] = useState({});

  // ── Catálogo ──────────────────────────────────────────────
  const getServico = useCallback((id) => servicos.find((s) => s.id === id), [servicos]);

  const servicosDoBarbeiro = useCallback(
    (barbeiroId) => servicos.filter((s) => s.barbeiros.includes(barbeiroId)),
    [servicos],
  );

  // Preço "congelado" no agendamento; cai para o preço atual nos dados antigos.
  const precoDoAgendamento = useCallback(
    (ag) => ag.preco ?? getServico(ag.servicoId)?.preco ?? 0,
    [getServico],
  );

  // ── Horários ──────────────────────────────────────────────
  const horariosDoBarbeiro = useCallback(
    (barbeiroId) => horariosPorBarbeiro[barbeiroId] ?? HORARIOS_BASE,
    [horariosPorBarbeiro],
  );

  const horariosDisponiveis = useCallback(
    (barbeiroId, data) => {
      const ocupados = new Set(
        agendamentos
          .filter((a) => a.barbeiroId === barbeiroId && a.data === data && a.status !== 'cancelado')
          .map((a) => a.horario),
      );
      const agora = new Date();
      const ehHoje = data === toISODate(agora);
      return horariosDoBarbeiro(barbeiroId).filter(
        (h) => !ocupados.has(h) && (!ehHoje || parseISODate(data, h) > agora),
      );
    },
    [agendamentos, horariosDoBarbeiro],
  );

  const salvarHorarios = useCallback((barbeiroId, lista) => {
    setHorariosPorBarbeiro((prev) => ({
      ...prev,
      [barbeiroId]: HORARIOS_BASE.filter((h) => lista.includes(h)),
    }));
  }, []);

  // ── Gestão de serviços (barbeiro) ─────────────────────────
  const atualizarPreco = useCallback((servicoId, preco) => {
    setServicos((prev) => prev.map((s) => (s.id === servicoId ? { ...s, preco } : s)));
  }, []);

  const alternarServicoDoBarbeiro = useCallback((servicoId, barbeiroId) => {
    setServicos((prev) =>
      prev.map((s) => {
        if (s.id !== servicoId) return s;
        const tem = s.barbeiros.includes(barbeiroId);
        return {
          ...s,
          barbeiros: tem ? s.barbeiros.filter((b) => b !== barbeiroId) : [...s.barbeiros, barbeiroId],
        };
      }),
    );
  }, []);

  // Barbeiro recém-cadastrado passa a oferecer todos os serviços (antes ficava sem nenhum).
  const vincularBarbeiroATodosServicos = useCallback((barbeiroId) => {
    setServicos((prev) =>
      prev.map((s) => (s.barbeiros.includes(barbeiroId) ? s : { ...s, barbeiros: [...s.barbeiros, barbeiroId] })),
    );
  }, []);

  // ── Agendamentos ──────────────────────────────────────────
  const criarAgendamento = useCallback(
    ({ clienteId, barbeiroId, servicoId, data, horario }) => {
      const servico = getServico(servicoId);
      if (!servico || !servico.barbeiros.includes(barbeiroId)) {
        return { ok: false, erro: 'Este barbeiro não realiza o serviço selecionado.' };
      }
      if (!horariosDisponiveis(barbeiroId, data).includes(horario)) {
        return { ok: false, erro: 'Horário não disponível.' };
      }
      setAgendamentos((prev) => [
        ...prev,
        { id: novoId(), clienteId, barbeiroId, servicoId, data, horario, preco: servico.preco, status: 'pendente' },
      ]);
      return { ok: true };
    },
    [getServico, horariosDisponiveis],
  );

  const atualizarStatus = useCallback((id, status) => {
    setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);
  const cancelarAgendamento = useCallback((id) => atualizarStatus(id, 'cancelado'), [atualizarStatus]);
  const concluirAgendamento = useCallback((id) => atualizarStatus(id, 'concluido'), [atualizarStatus]);

  const agendamentosCliente = useCallback(
    (clienteId) => agendamentos.filter((a) => a.clienteId === clienteId),
    [agendamentos],
  );
  const agendamentosBarbeiro = useCallback(
    (barbeiroId) => agendamentos.filter((a) => a.barbeiroId === barbeiroId),
    [agendamentos],
  );

  // ── Dashboard do barbeiro ─────────────────────────────────
  // Finanças e contagens consideram só atendimentos CONCLUÍDOS
  // (antes entravam agendamentos futuros/pendentes no "lucro").
  const dashboardBarbeiro = useCallback(
    (barbeiroId) => {
      const meus = agendamentos.filter((a) => a.barbeiroId === barbeiroId && a.status !== 'cancelado');
      const concluidos = meus.filter((a) => a.status === 'concluido');

      const hoje = inicioDoDia(new Date());
      const amanha = addDays(hoje, 1);
      const inicioSemana = addDays(hoje, -6);
      const inicioMes = new Date(hoje);
      inicioMes.setMonth(inicioMes.getMonth() - 1);

      const entre = (lista, ini, fim) =>
        lista.filter((a) => {
          const d = parseISODate(a.data);
          return d >= ini && d < fim;
        });
      const somar = (lista) => lista.reduce((acc, a) => acc + precoDoAgendamento(a), 0);

      const daSemana = entre(concluidos, inicioSemana, amanha);
      const doMes = entre(concluidos, inicioMes, amanha);

      const contagem = {};
      meus.forEach((a) => {
        contagem[a.data] = (contagem[a.data] || 0) + 1;
      });
      const diaMaisMovimentado =
        Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      const grafico = [3, 2, 1, 0].map((i) => {
        const fim = addDays(amanha, -i * 7);
        const inicio = addDays(fim, -7);
        return { semana: `S${4 - i}`, atendimentos: entre(concluidos, inicio, fim).length };
      });

      return {
        totalMes: doMes.length,
        totalSemana: daSemana.length,
        lucroSemana: somar(daSemana),
        lucroMes: somar(doMes),
        clientesUnicos: new Set(concluidos.map((a) => a.clienteId)).size,
        diaMaisMovimentado,
        grafico,
      };
    },
    [agendamentos, precoDoAgendamento],
  );

  const value = useMemo(
    () => ({
      agendamentos,
      servicos,
      getServico,
      servicosDoBarbeiro,
      precoDoAgendamento,
      horariosDoBarbeiro,
      horariosDisponiveis,
      salvarHorarios,
      atualizarPreco,
      alternarServicoDoBarbeiro,
      vincularBarbeiroATodosServicos,
      criarAgendamento,
      cancelarAgendamento,
      concluirAgendamento,
      agendamentosCliente,
      agendamentosBarbeiro,
      dashboardBarbeiro,
    }),
    [
      agendamentos, servicos, getServico, servicosDoBarbeiro, precoDoAgendamento,
      horariosDoBarbeiro, horariosDisponiveis, salvarHorarios, atualizarPreco,
      alternarServicoDoBarbeiro, vincularBarbeiroATodosServicos, criarAgendamento,
      cancelarAgendamento, concluirAgendamento, agendamentosCliente,
      agendamentosBarbeiro, dashboardBarbeiro,
    ],
  );

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
}
