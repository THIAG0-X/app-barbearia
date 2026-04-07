import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ActivityIndicator, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./_layout";

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        if (!email || !senha) {
            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }
        setLoading(true);
        // Simulação — substitua pelo seu serviço real (Firebase, API, etc.)
        setTimeout(() => {
            setLoading(false);
            login(); // ← marca como logado e navega para Home
        }, 1200);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.header}>
                <Text style={styles.logo}>BarberPro</Text>
                <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
            </View>

            <View style={styles.form}>
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
                    placeholder="••••••••"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} disabled={loading}>
                    {loading
                        ? <ActivityIndicator color="#1a1a2e" />
                        : <Text style={styles.btnLoginText}>Entrar</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/cadastro")}>
                    <Text style={styles.linkText}>
                        Não tem conta?{" "}
                        <Text style={styles.linkDestaque}>Cadastre-se</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        paddingHorizontal: 24,
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
    btnLogin: {
        backgroundColor: "#F5C518",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 24,
        elevation: 5,
    },
    btnLoginText: { color: "#1a1a2e", fontWeight: "bold", fontSize: 16 },
    linkText: { color: "#aaa", textAlign: "center", marginTop: 20, fontSize: 14 },
    linkDestaque: { color: "#F5C518", fontWeight: "bold" },
});