// src/app/barbeiro/agenda.jsx  —  Agenda do Barbeiro
import React, { useState } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { getCliente, getServico } from "../../context/mockData";

const DIAS_SEMANA = (() => {
    const hoje = new Date();
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() + i);
        const iso = d.toISOString().split("T")[0];
        const dia = d.toLocaleDateString("pt-BR", { weekday: "short" });
        const num = d.getDate();
        return { iso, dia, num };
    });
})();

const STATUS_CONFIG = {
    pendente:  { cor: "#F5C518", label: "Pendente",  icone: "time-outline" },
    concluido: { cor: "#10B981", label: "Concluído", icone: "checkmark-circle" },
    cancelado: { cor: "#EF4444", label: "Cancelado", icone: "close-circle" },
};

export default function Agenda() {
    const { usuario, agendamentosBarbeiro, concluirAgendamento, cancelarAgendamento } = useApp();
    if (!usuario) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#fff' }}>Carregando perfil...</Text>
            </View>
        );
    }
    const [dataSelecionada, setDataSelecionada] = useState(DIAS_SEMANA[0].iso);

    const todos     = agendamentosBarbeiro(usuario.id);
    const do_dia    = todos
        .filter(a => a.data === dataSelecionada)
        .sort((a, b) => a.horario.localeCompare(b.horario));

    const handleConcluir = (id) => {
        Alert.alert("Concluir atendimento", "Marcar como concluído?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Confirmar", onPress: () => concluirAgendamento(id) },
        ]);
    };

    const handleCancelar = (id) => {
        Alert.alert("Cancelar atendimento", "Tem certeza?", [
            { text: "Não", style: "cancel" },
            { text: "Sim", style: "destructive", onPress: () => cancelarAgendamento(id) },
        ]);
    };

    return (
        <View style={styles.container}>

            {/* Seletor de dia */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diasScroll}>
                <View style={styles.diasRow}>
                    {DIAS_SEMANA.map(d => {
                        const temAg = todos.some(a => a.data === d.iso && a.status === "pendente");
                        return (
                            <TouchableOpacity
                                key={d.iso}
                                style={[styles.diaBtn, dataSelecionada === d.iso && styles.diaBtnActive]}
                                onPress={() => setDataSelecionada(d.iso)}
                            >
                                <Text style={[styles.diaDia, dataSelecionada === d.iso && styles.diaDiaActive]}>
                                    {d.dia}
                                </Text>
                                <Text style={[styles.diaNum, dataSelecionada === d.iso && styles.diaNumActive]}>
                                    {d.num}
                                </Text>
                                {temAg && <View style={styles.dotIndicador} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Resumo do dia */}
            <View style={styles.resumoDia}>
                <Text style={styles.resumoData}>
                    {new Date(dataSelecionada + "T12:00:00").toLocaleDateString("pt-BR", {
                        weekday: "long", day: "2-digit", month: "long"
                    })}
                </Text>
                <View style={styles.resumoBadge}>
                    <Text style={styles.resumoBadgeText}>
                        {do_dia.filter(a => a.status !== "cancelado").length} atendimentos
                    </Text>
                </View>
            </View>

            {/* Lista */}
            <ScrollView contentContainerStyle={styles.lista}>
                {do_dia.length === 0 && (
                    <View style={styles.vazio}>
                        <Ionicons name="calendar-outline" size={48} color="#374151" />
                        <Text style={styles.vazioText}>Nenhum agendamento neste dia</Text>
                    </View>
                )}

                {do_dia.map(ag => {
                    const cliente = getCliente(ag.clienteId);
                    const servico = getServico(ag.servicoId);
                    const cfg     = STATUS_CONFIG[ag.status];

                    return (
                        <View key={ag.id} style={styles.card}>
                            {/* Linha de tempo */}
                            <View style={styles.timeline}>
                                <Text style={styles.timelineHora}>{ag.horario}</Text>
                                <View style={[styles.timelineDot, { backgroundColor: cfg.cor }]} />
                                <View style={styles.timelineLine} />
                            </View>

                            {/* Conteúdo */}
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.clienteNome}>{cliente?.nome}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: cfg.cor + "20" }]}>
                                        <Ionicons name={cfg.icone} size={12} color={cfg.cor} />
                                        <Text style={[styles.statusText, { color: cfg.cor }]}>{cfg.label}</Text>
                                    </View>
                                </View>
                                <Text style={styles.servicoNome}>{servico?.nome}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.duracao}>⏱ {servico?.duracao} min</Text>
                                    <Text style={styles.preco}>R$ {servico?.preco}</Text>
                                </View>

                                {ag.status === "pendente" && (
                                    <View style={styles.acoes}>
                                        <TouchableOpacity
                                            style={[styles.acaoBtn, styles.acaoConcluir]}
                                            onPress={() => handleConcluir(ag.id)}
                                        >
                                            <Ionicons name="checkmark" size={14} color="#fff" />
                                            <Text style={styles.acaoBtnText}>Concluir</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.acaoBtn, styles.acaoCancelar]}
                                            onPress={() => handleCancelar(ag.id)}
                                        >
                                            <Ionicons name="close" size={14} color="#fff" />
                                            <Text style={styles.acaoBtnText}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#111827" },

    diasScroll: { maxHeight: 80, paddingTop: 10 },
    diasRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
    diaBtn: {
        alignItems: "center", paddingVertical: 8, paddingHorizontal: 14,
        borderRadius: 14, backgroundColor: "#1F2937",
        borderWidth: 1.5, borderColor: "#374151", minWidth: 52,
    },
    diaBtnActive: { backgroundColor: "#F5C518", borderColor: "#F5C518" },
    diaDia:       { color: "#6B7280", fontSize: 11, textTransform: "capitalize" },
    diaDiaActive: { color: "#111827" },
    diaNum:       { color: "#fff", fontWeight: "bold", fontSize: 18 },
    diaNumActive: { color: "#111827" },
    dotIndicador: {
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: "#F5C518", marginTop: 3,
    },

    resumoDia: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 10,
    },
    resumoData:  { color: "#fff", fontWeight: "600", fontSize: 14, textTransform: "capitalize" },
    resumoBadge: {
        backgroundColor: "#F5C51820", borderRadius: 20,
        paddingVertical: 4, paddingHorizontal: 10,
    },
    resumoBadgeText: { color: "#F5C518", fontSize: 12, fontWeight: "600" },

    lista: { padding: 16, paddingBottom: 100, gap: 4 },

    vazio: { alignItems: "center", marginTop: 60, gap: 12 },
    vazioText: { color: "#6B7280", fontSize: 15 },

    card: { flexDirection: "row", gap: 12, marginBottom: 16 },

    timeline: { alignItems: "center", width: 44 },
    timelineHora: { color: "#F5C518", fontSize: 12, fontWeight: "bold", marginBottom: 4 },
    timelineDot:  { width: 12, height: 12, borderRadius: 6 },
    timelineLine: { flex: 1, width: 2, backgroundColor: "#1F2937", marginTop: 4 },

    cardContent: {
        flex: 1, backgroundColor: "#1F2937", borderRadius: 14, padding: 14,
        borderWidth: 1, borderColor: "#374151",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    clienteNome: { color: "#fff", fontWeight: "bold", fontSize: 15 },
    statusBadge: {
        flexDirection: "row", alignItems: "center", gap: 3,
        paddingVertical: 3, paddingHorizontal: 8, borderRadius: 20,
    },
    statusText: { fontSize: 11, fontWeight: "600" },

    servicoNome: { color: "#9CA3AF", fontSize: 13, marginBottom: 8 },
    cardFooter:  { flexDirection: "row", justifyContent: "space-between" },
    duracao: { color: "#6B7280", fontSize: 12 },
    preco:   { color: "#10B981", fontWeight: "bold", fontSize: 14 },

    acoes: { flexDirection: "row", gap: 8, marginTop: 10 },
    acaoBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 4, paddingVertical: 8, borderRadius: 8,
    },
    acaoConcluir: { backgroundColor: "#10B981" },
    acaoCancelar: { backgroundColor: "#EF444460" },
    acaoBtnText:  { color: "#fff", fontWeight: "600", fontSize: 13 },
});