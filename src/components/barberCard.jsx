// Card do barbeiro exibido na lista horizontal da Home

import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BarberCard({name}){
    return(
        <View style = {styles.barberCard}>
            <View style = {styles.avatar}>
                <Ionicons name="person-outline" size={30} color="#fff"/>
            </View>
            <Text style = {styles.baberName}>{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create ({
    barberCard: {
        backgroundColor: "#6B7280",
        padding: 10,
        borderRadius: 10,
        width: 200,
        marginRight: 10,
        height: 135,
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },

    baberName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginTop: 5,
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2
    },
    avatar:{
        width: 70,
        height: 70,
        borderRadius: 70,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center"
    }

})