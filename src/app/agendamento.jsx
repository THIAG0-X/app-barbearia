import { View, Text, StyleSheet, useColorScheme } from "react-native";

const themes = {
    light: { background: "#F0F0F0", text: "#000000" },
    dark: { background: "#111827", text: "#ffffff" }
}

export default function Agendamento() {
    const colorScheme = useColorScheme()
    const theme = colorScheme === "dark" ? themes.dark : themes.light

    return (
        <View style={[styles.wrapper, {backgroundColor: theme.background}]}>
            <View style={styles.container}>
                <Text style={[styles.title, {color: theme.text}]}>Agendamento</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold" }
})