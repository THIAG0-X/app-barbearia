// Barra de navegação inferior do app
// Para adicionar uma nova tela: adicione o arquivo em src/app/ e um novo NavButton nesse arquivo

import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import NavButton from "./navButton";

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname() // Rota atual

     // Evita navegar para a mesma página que já está ativa
    const navigateTo = (path) => {
        console.log("pathname atual:", pathname)
        console.log("destino:", path)
        if (pathname === path) return
        router.replace(path)
    }

    return (
        <View style={styles.navbar}>
            <NavButton
                icon={<Ionicons name="home" size={28} color="white" />}
                title="Home"
                isActive={pathname === "/"}
                onPress={() => navigateTo("/")}
            />
            <NavButton
                icon={<Ionicons name="cut" size={28} color="white" />}
                title="Serviços"
                isActive={pathname === "/servicos"}
                onPress={() => navigateTo("/servicos")}
            />
            <NavButton
                icon={<Ionicons name="calendar" size={28} color="white" />}
                title="Agendamento"
                isActive={pathname === "/agendamento"}
                onPress={() => navigateTo("/agendamento")}
            />
            <NavButton
                icon={<Ionicons name="person" size={28} color="white" />}
                title="Perfil"
                isActive={pathname === "/perfil"}
                onPress={() => navigateTo("/perfil")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#6B7280",
        width: "100%",
        padding: 8,
        position: "absolute",
        bottom: 0,
        height: 70
    },
    text: {
        color: "#000000"
    }
})