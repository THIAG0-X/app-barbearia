import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import React from "react";


export default function NavButton({icon, title, isActive, onPress}) {

     const iconWithColor = React.cloneElement(icon, {
        color: isActive ? "#000000" : "#ffffff"  
    })

    return (
        <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
            <View style = {[styles.button, isActive && styles.buttonActive]}>  {iconWithColor}</View>
            
            <Text style = {[styles.btnText, isActive && styles.btnTextActive]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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

    buttonActive: {
        backgroundColor: "#FACC15",
        marginBottom: 8


    },

    btnText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2
    },

    btnTextActive: {
        fontSize: 16,            
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3
    }
})