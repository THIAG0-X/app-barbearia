import { Stack, usePathname, useRouter } from "expo-router";
import { useColorScheme, View, StyleSheet } from "react-native";
import { useEffect, createContext, useContext, useState } from "react";
import Header from "@/components/header";
import Navbar from "@/components/navbar";

// ─── Contexto de autenticação ────────────────────────────────────────────────
// Permite que qualquer tela saiba se o usuário está logado
// e possa chamar login() ou logout()
export const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}
// ─────────────────────────────────────────────────────────────────────────────

// Telas que NÃO mostram Header e Navbar
const TELAS_SEM_LAYOUT = ["/login", "/cadastro"];

export default function Layout() {
    const colorScheme = useColorScheme();
    const bg = colorScheme === "dark" ? "#111827" : "#F0F0F0";

    const pathname = usePathname();
    const router = useRouter();
    const esconderLayout = TELAS_SEM_LAYOUT.includes(pathname);

    // false = não logado, true = logado
    const [logado, setLogado] = useState(false);

    // Redireciona para login se não estiver logado
    useEffect(() => {
        if (!logado && !TELAS_SEM_LAYOUT.includes(pathname)) {
            router.replace("/login");
        }
    }, [logado]);

    const login = () => {
        setLogado(true);
        router.replace("/");
    };

    const logout = () => {
        setLogado(false);
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ logado, login, logout }}>
            <View style={[styles.wrapper, { backgroundColor: bg }]}>

                {!esconderLayout && <Header />}

                <Stack screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    contentStyle: { backgroundColor: bg }
                }} />

                {!esconderLayout && <Navbar />}

            </View>
        </AuthContext.Provider>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});