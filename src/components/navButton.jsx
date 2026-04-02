import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function NavButton({icon, title}) {


    return (
        <TouchableOpacity style = {styles.btnContainer}>
            <View style = {styles.button}>{icon}</View>
            <Text style = {styles.btnText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        marginTop: -30,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5

    },

    button: {
        backgroundColor: "#1E3A8A",
        height: 50,
        borderRadius: 25,
        padding: 10
    },

    btnText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2
    }
})