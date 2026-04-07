// ─────────────────────────────────────────────────────────────
//  AppContext.js  —  estado global do BarberPro
//  Coloque em:  src/context/AppContext.js
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState } from "react";
import {
    USUARIOS,
    AGENDAMENTOS_INICIAIS,
    HORARIOS_BASE,
    getServico,
} from "./mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [usuario, setUsuario]           = useState(null);           // usuário logado
    const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS);

    // ── Autenticação ──────────────────────────────────────────
    const login = (email, senha) => {
        const found = USUARIOS.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
        );
        if (found) {
            setUsuario(found);
            return { ok: true, tipo: found.tipo };
        }
        return { ok: false, erro: "E-mail ou senha incorretos." };
    };

    const cadastrar = (nome, email, senha, tipo) => {
        const existe = USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existe) return { ok: false, erro: "E-mail já cadastrado." };

        const novo = {
            id: "u" + Date.now(),
            nome, email, senha, tipo, foto: null,
            ...(tipo === "barbeiro" ? { especialidade: "Corte & Barba" } : {}),
        };
        USUARIOS.push(novo);
        setUsuario(novo);
        return { ok: true, tipo };
    };

    const logout = () => setUsuario(null);

    // ── Agendamentos ──────────────────────────────────────────

    // Horários já ocupados de um barbeiro em uma data
    const horariosOcupados = (barbeiroId, data) =>
        agendamentos
            .filter(a => a.barbeiroId === barbeiroId && a.data === data && a.status !== "cancelado")
            .map(a => a.horario);

    // Horários disponíveis (base - ocupados)
    const horariosDisponiveis = (barbeiroId, data) => {
        const ocupados = horariosOcupados(barbeiroId, data);
        return HORARIOS_BASE.filter(h => !ocupados.includes(h));
    };

    // Criar agendamento
    const criarAgendamento = ({ barbeiroId, servicoId, data, horario }) => {
        // Verificar conflito
        const conflito = agendamentos.find(
            a => a.barbeiroId === barbeiroId &&
                 a.data === data &&
                 a.horario === horario &&
                 a.status !== "cancelado"
        );
        if (conflito) return { ok: false, erro: "Horário não disponível." };

        const novo = {
            id: "ag" + Date.now(),
            clienteId: usuario.id,
            barbeiroId,
            servicoId,
            data,
            horario,
            status: "pendente",
        };
        setAgendamentos(prev => [...prev, novo]);
        return { ok: true };
    };

    // Cancelar agendamento
    const cancelarAgendamento = (id) => {
        setAgendamentos(prev =>
            prev.map(a => a.id === id ? { ...a, status: "cancelado" } : a)
        );
    };

    // Concluir agendamento (barbeiro)
    const concluirAgendamento = (id) => {
        setAgendamentos(prev =>
            prev.map(a => a.id === id ? { ...a, status: "concluido" } : a)
        );
    };

    // Agendamentos do cliente logado
    const agendamentosCliente = (clienteId) =>
        agendamentos.filter(a => a.clienteId === clienteId);

    // Agendamentos do barbeiro logado
    const agendamentosBarbeiro = (barbeiroId) =>
        agendamentos.filter(a => a.barbeiroId === barbeiroId);

    // ── Dashboard do barbeiro ──────────────────────────────────
    const dashboardBarbeiro = (barbeiroId) => {
        const meus = agendamentos.filter(
            a => a.barbeiroId === barbeiroId && a.status !== "cancelado"
        );

        const hoje = new Date();
        const semanaAtras = new Date(hoje); semanaAtras.setDate(hoje.getDate() - 7);
        const mesAtras    = new Date(hoje); mesAtras.setMonth(hoje.getMonth() - 1);

        const daSemana = meus.filter(a => new Date(a.data) >= semanaAtras);
        const doMes    = meus.filter(a => new Date(a.data) >= mesAtras);

        // Lucro
        const lucroSemana = daSemana.reduce((acc, a) => {
            const s = getServico(a.servicoId);
            return acc + (s ? s.preco : 0);
        }, 0);
        const lucroMes = doMes.reduce((acc, a) => {
            const s = getServico(a.servicoId);
            return acc + (s ? s.preco : 0);
        }, 0);

        // Dia mais movimentado
        const contagem = {};
        meus.forEach(a => { contagem[a.data] = (contagem[a.data] || 0) + 1; });
        const diaMaisMovimentado = Object.entries(contagem)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

        // Clientes únicos
        const clientesUnicos = new Set(meus.map(a => a.clienteId)).size;

        // Dados para gráfico (últimas 4 semanas, por semana)
        const grafico = [0, 1, 2, 3].map(i => {
            const fim   = new Date(hoje); fim.setDate(hoje.getDate() - i * 7);
            const inicio = new Date(fim);  inicio.setDate(fim.getDate() - 7);
            const count = meus.filter(a => {
                const d = new Date(a.data);
                return d >= inicio && d < fim;
            }).length;
            return { semana: `S${4 - i}`, atendimentos: count };
        }).reverse();

        return {
            totalMes:       doMes.length,
            totalSemana:    daSemana.length,
            lucroSemana,
            lucroMes,
            clientesUnicos,
            diaMaisMovimentado,
            grafico,
        };
    };

    return (
        <AppContext.Provider value={{
            usuario,
            login, cadastrar, logout,
            agendamentos,
            horariosDisponiveis,
            criarAgendamento,
            cancelarAgendamento,
            concluirAgendamento,
            agendamentosCliente,
            agendamentosBarbeiro,
            dashboardBarbeiro,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}