// Estrutura base do app — Header e Navbar ficam aqui para não animarem
// junto com as telas durante a navegação
// Para adicionar uma nova tela: crie o arquivo em src/app/ com o nome da rota
// ex: src/app/historico.jsx → acessível em "/historico"

import { Stack } from "expo-router";
import { useColorScheme, View, StyleSheet } from "react-native";
import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function Layout() {

    // Detecta o tema do celular para evitar flash branco na transição
    const colorScheme = useColorScheme();
    const bg = colorScheme === "dark" ? "#111827" : "#F0F0F0";

    return (
        <View style={[styles.wrapper, { backgroundColor: bg }]}>
            <Header />

            {/* Stack gerencia a navegação entre telas */}
            <Stack screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: bg }
            }} />
            <Navbar />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
})