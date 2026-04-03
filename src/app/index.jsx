import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, useColorScheme  } from "react-native";
import HorizontalList from "@/components/horizontalList"
import ServiceCard from "@/components/serviceCard"
import BarberCard from "@/components/barberCard"

// Definição dos temas claro e escuro
// Para adicionar novas cores, adicione em ambos os objetos (light e dark)
const themes = {
    light: {
        background: "#F0F0F0",
        title: "#000000",
        text: "#000000",
        promoCard: "#000000",
        titlePromo: "#FACC15",
        subtitlePromo: "#FACC15"
    },
    dark: {
        background: "#111827",
        title: "#ffffff",
        text: "#ffffff",
        promoCard: "#FACC15",
        titlePromo: "#000000",
        subtitlePromo: "#000000"
    }
}

export default function Homepage() {

    // Detecta o tema do celular ("light" ou "dark")
    const colorScheme = useColorScheme()
    const [theme, setTheme] = useState(themes.light)
    

    // Atualiza o tema sempre que o celular mudar de claro para escuro ou vice-versa
    useEffect(() => {
        setTheme(colorScheme === "dark" ? themes.dark : themes.light)
    }, [colorScheme])
    
    // Guarda o serviço selecionado pelo usuário
    // Será usado futuramente na tela de agendamento
    const [serviceSelected, setServiceSelected] = useState(null)

    // Log para debug — pode remover quando integrar com a tela de agendamento
    useEffect(() => {
        console.log("Serviço selecionado:", serviceSelected);
    }, [serviceSelected])

    // Lista de serviços
    const servicos = [
        {id: "1", title: "Combo Corte + Barba", price: "R$ 50", time: "20 min"},
        {id: "2", title: "Corte Simples", price: "R$ 25", time: "20 min"},
        {id: "3", title: "Corte", price: "R$ 35", time: "20 min"},
        {id: "4", title: "Barba", price: "R$ 25", time: "20 min"},
        {id: "5", title: "Sombrancelha", price: "R$ 10", time: "20 min"},
    ]

    // Lista de barbeiros
    const barbeiros = [
        {id: "1", name: "Roberto"},
        {id: "2", name: "Carlos"},
        {id: "3", name: "João"},
        {id: "4", name: "Paulo"},
    ]

    return (
        <View style={[styles.wrapper, {backgroundColor: theme.background}]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                    
                    {/* Card de promoção da semana */}
                    <View style = {[styles.promoCard, {backgroundColor: theme.promoCard}]}>

                        <Text style={[styles.titlePromo, {color: theme.titlePromo}]}>Promoção da Semana!</Text>
                        <View style={styles.promoDivider} />
                        <Text style = {[styles.subtitlePromo, {color: theme.subtitlePromo}]}>✂️ Corte + Barba ✂️</Text>
                        <Text style = {[styles.subtitlePromo, {color: theme.subtitlePromotitlePromo}]}>Por apenas R$ 50,00!</Text>

                    </View>

                     {/* Lista horizontal de serviços
                        onSelect salva o serviço escolhido em serviceSelected */}
                    <Text style={[styles.title, {color: theme.title}]}>Serviços Populares:</Text>
                    <HorizontalList
                        data={servicos}
                        renderCard={(item) => (
                            <ServiceCard {...item} onSelect={setServiceSelected}/>
                        )}
                    />

                    {/* Lista horizontal de barbeiros */}
                    <Text style={[styles.title, {color: theme.title}]}>Nossos Cabelereiros:</Text>
                    <HorizontalList
                        data={barbeiros}
                         renderCard={(item) => (
                            <BarberCard {...item}/>
                        )} 
                    />

                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    /* Branco (#FFFFFF)

    Azul (#1E3A8A)

    Cinza (#6B7280)

    Amarelo (#FACC15)*/

     wrapper: {
        flex: 1
    },
    scroll: {
        paddingBottom: 90  // Espaço extra no final para o conteúdo não ficar atrás da Navbar
    },
    container: {
        padding: 16,
        gap: 12
    },

    text: {
        fontSize: 14
    }, 
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    promoCard: {
        width: "100%",
        padding: 10,
        borderRadius: 10,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8
    },

    titlePromo: {
        color: "#FACC15",
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center"
    },
    subtitlePromo: {
        color: "#FACC15",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    promoDivider: {
        width: "100%",
        height: 1,
        backgroundColor: "#000000",
        marginVertical: 9.5
    },
})