import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./_layout";

export default function Cadastro() {
    const router = useRouter();
    const { login } = useAuth();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCadastro = () => {
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }
        if (senha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        // Simulação — substitua pelo seu serviço real (Firebase, API, etc.)
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Sucesso!", "Conta criada com sucesso!", [
                {
                    text: "Entrar agora",
                    onPress: () => login(), // ← já loga direto após cadastro
                },
            ]);
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>BarberPro</Text>
                    <Text style={styles.subtitle}>Crie sua conta gratuitamente</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu nome"
                        placeholderTextColor="#666"
                        autoCapitalize="words"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seuemail@exemplo.com"
                        placeholderTextColor="#666"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#666"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />

                    <Text style={styles.label}>Confirmar senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Repita sua senha"
                        placeholderTextColor="#666"
                        secureTextEntry
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                    />

                    <TouchableOpacity style={styles.btnCadastro} onPress={handleCadastro} disabled={loading}>
                        {loading
                            ? <ActivityIndicator color="#1a1a2e" />
                            : <Text style={styles.btnCadastroText}>Criar conta</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/login")}>
                        <Text style={styles.linkText}>
                            Já tem conta?{" "}
                            <Text style={styles.linkDestaque}>Faça login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1a2e" },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: { alignItems: "center", marginBottom: 40 },
    logo: { fontSize: 36, fontWeight: "bold", color: "#F5C518", letterSpacing: 2 },
    subtitle: { color: "#aaa", fontSize: 15, marginTop: 6 },
    form: {
        backgroundColor: "#16213e",
        borderRadius: 16,
        padding: 24,
        elevation: 8,
    },
    label: { color: "#ccc", fontSize: 13, marginBottom: 6, marginTop: 12, fontWeight: "600" },
    input: {
        backgroundColor: "#0f3460",
        color: "#fff",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#1e4d8c",
    },
    btnCadastro: {
        backgroundColor: "#F5C518",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 24,
        elevation: 5,
    },
    btnCadastroText: { color: "#1a1a2e", fontWeight: "bold", fontSize: 16 },
    linkText: { color: "#aaa", textAlign: "center", marginTop: 20, fontSize: 14 },
    linkDestaque: { color: "#F5C518", fontWeight: "bold" },
});