import { Ionicons } from '@expo/vector-icons';
import { View,  StyleSheet } from "react-native";
import NavButton from "./navButton";

export default function Navbar(){


    return (
        <View style = {styles.navbar}>
            <NavButton icon = {<Ionicons name="home" size={28} color="white" />} title = "Home"/>
            <NavButton icon = {<Ionicons name="cut" size={28} color="white" />} title = "Serviços"/>
            <NavButton icon = {<Ionicons name="calendar" size={28} color="white" />} title = "Agendamento"/>
            <NavButton icon = {<Ionicons name="person" size={28} color="white" />} title = "Perfil"/>
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