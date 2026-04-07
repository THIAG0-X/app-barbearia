import React, { useState } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Mesma lista de serviços — idealmente viria de um contexto/API compartilhado
const SERVICOS = {
    "1": { title: "Combo Corte + Barba", price: "R$ 50", time: "20 min" },
    "2": { title: "Corte Simples",        price: "R$ 25", time: "20 min" },
    "3": { title: "Corte",               price: "R$ 35", time: "20 min" },
    "4": { title: "Barba",               price: "R$ 25", time: "20 min" },
    "5": { title: "Sombrancelha",        price: "R$ 10", time: "20 min" },
};

const HORARIOS = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"];

const BARBEIROS = [
    { id: "1", name: "Roberto" },
    { id: "2", name: "Carlos" },
    { id: "3", name: "João" },
    { id: "4", name: "Paulo" },
];

export default function Agendamento() {
    const router = useRouter();
    const { servicoId } = useLocalSearchParams();

    const servico = SERVICOS[servicoId] || null;

    const [barbeiro, setBarbeiro] = useState(null);
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(false);

    const confirmar = () => {
        if (!barbeiro || !horario) {
            Alert.alert("Atenção", "Selecione um barbeiro e um horário.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                "✅ Agendado!",
                `${servico?.title}\nBarbeiro: ${barbeiro}\nHorário: ${horario}`,
                [{ text: "Voltar ao início", onPress: () => router.replace("/") }]
            );
        }, 1200);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>

            <Text style={styles.pageTitle}>Agendamento</Text>

            {/* Serviço selecionado */}
            {servico ? (
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>Serviço escolhido:</Text>
                    <Text style={styles.servicoTitle}>{servico.title}</Text>
                    <Text style={styles.servicoInfo}>💵 {servico.price}  ⏱️ {servico.time}</Text>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.servicoInfo}>Nenhum serviço selecionado.</Text>
                </View>
            )}

            {/* Escolha do barbeiro */}
            <Text style={styles.sectionLabel}>Escolha o barbeiro:</Text>
            <View style={styles.optionsRow}>
                {BARBEIROS.map((b) => (
                    <TouchableOpacity
                        key={b.id}
                        style={[styles.optionBtn, barbeiro === b.name && styles.optionBtnActive]}
                        onPress={() => setBarbeiro(b.name)}
                    >
                        <Text style={[styles.optionText, barbeiro === b.name && styles.optionTextActive]}>
                            {b.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Escolha do horário */}
            <Text style={styles.sectionLabel}>Escolha o horário:</Text>
            <View style={styles.optionsRow}>
                {HORARIOS.map((h) => (
                    <TouchableOpacity
                        key={h}
                        style={[styles.optionBtn, horario === h && styles.optionBtnActive]}
                        onPress={() => setHorario(h)}
                    >
                        <Text style={[styles.optionText, horario === h && styles.optionTextActive]}>
                            {h}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Botão confirmar */}
            <TouchableOpacity style={styles.btnConfirmar} onPress={confirmar} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#1a1a2e" />
                    : <Text style={styles.btnConfirmarText}>Confirmar Agendamento</Text>
                }
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111827",
    },
    scroll: {
        padding: 20,
        paddingBottom: 100,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#F5C518",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#1e293b",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    sectionLabel: {
        color: "#aaa",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 10,
        marginTop: 8,
    },
    servicoTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    servicoInfo: {
        color: "#ccc",
        fontSize: 14,
        marginTop: 4,
    },
    optionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },
    optionBtn: {
        borderWidth: 1,
        borderColor: "#374151",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#1e293b",
    },
    optionBtnActive: {
        backgroundColor: "#F5C518",
        borderColor: "#F5C518",
    },
    optionText: {
        color: "#ccc",
        fontSize: 14,
    },
    optionTextActive: {
        color: "#1a1a2e",
        fontWeight: "bold",
    },
    btnConfirmar: {
        backgroundColor: "#F5C518",
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#F5C518",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    btnConfirmarText: {
        color: "#1a1a2e",
        fontWeight: "bold",
        fontSize: 16,
    },
});