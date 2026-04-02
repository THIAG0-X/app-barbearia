import { Ionicons } from '@expo/vector-icons';
import { View,  StyleSheet } from "react-native";
import { useState } from "react";
import NavButton from "./navButton";

export default function Navbar(){

    const [activeTab, setActiveTab] = useState("Home");

    return (
        <View style = {styles.navbar}>
            <NavButton 
                icon = {<Ionicons name="home" size={28} color="white" />} title = "Home"
                isActive={activeTab === "Home"}
                onPress={() => setActiveTab("Home")}
            />
            <NavButton
                icon = {<Ionicons name="cut" size={28} color="white" />} 
                title = "Serviços"
                isActive={activeTab === "Serviços"}
                onPress={() => setActiveTab("Serviços")}
            />
            <NavButton 
                icon = {<Ionicons name="calendar" size={28} color="white" />} title = "Agendamento"
                isActive={activeTab === "Agendamento"}
                onPress={() => setActiveTab("Agendamento")}
                />
            <NavButton 
                icon = {<Ionicons name="person" size={28} color="white" />} title = "Perfil"
                isActive={activeTab === "Perfil"}
                onPress={() => setActiveTab("Perfil")}
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