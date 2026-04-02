
import { View, Text, StyleSheet } from "react-native";
import ServiceButton from "./serviceButton";

export default function ServiceCard({title, price, time, onSelect}) {

    return (
        <View style = {styles.serviceCard}>
            <Text style = {[styles.text, styles.titleService]}>{title}</Text>
            <Text style = {[styles.text, styles.textInfo]}>💵Preço: {price}</Text>
            <Text style = {[styles.text, styles.textInfo]}>⏱️Tempo Aprox: {time}</Text>
            <ServiceButton onPress={() => onSelect(title)}/>
        </View>
    )
}

const styles = StyleSheet.create ({
    serviceCard: {
        backgroundColor: "#6B7280",
        padding: 10,
        borderRadius: 10,
        width: 200,
        marginRight: 10,
        minHeight: 135,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%"
    },

    text: {
        color: "#FFFFFF",
    },

    titleService: {
        fontSize: 20,
        fontWeight: "bold",
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2
    },

    textInfo: {
        fontSize: 14,
    }

})