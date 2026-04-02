
import {View, Text, StyleSheet} from "react-native"

export default function Header(){
    return (
        <View style= {styles.container}>
            <Text style= {[styles.text, styles.textTitle]}>BarberPro</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    /*TEMA E DESIGN: O app deve seguir um design moderno e minimalista utilizando as cores:

Branco (#FFFFFF)

Azul (#1E3A8A)

Cinza (#6B7280)

Amarelo (#FACC15)*/

    container: {
        backgroundColor: "#1E3A8A",
        width: "100%",
        paddingTop: 40,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: "50%"
    },

    textTitle: {
        fontSize: 26,

    },
    text: {
        color: "#FFFFFF",
        fontSize: 14,
        
    }

})