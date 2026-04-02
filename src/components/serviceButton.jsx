import {TouchableOpacity, Text, StyleSheet} from "react-native"

export default function ServiceButton({isActive, onPress}) {
    return (
        <TouchableOpacity 
            style = {styles.btnToSchedule}  onPress={onPress}>
            <Text style = {styles.textButton}>Agende agora!</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create ({
    btnToSchedule: {
        backgroundColor: "#FACC15",
        padding: 5,
        width: "100%",
        minHeight: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginVertical: 5
    },

    textButton: {
        color: "#000000",
        textShadowColor: "rgba(0, 0, 0, 0.16)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
        textAlign: "center"
    }
})