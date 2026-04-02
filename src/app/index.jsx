import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header  from "@/components/header";
import Navbar from "@/components/navbar";
import HorizontalList from "@/components/horizontalList"
import ServiceCard from "@/components/serviceCard"
import BarberCard from "@/components/barberCard"

export default function Index() {

    const servicos = [
        {id: "1", title: "Combo Corte + Barba", price: "R$ 50", time: "20 min"},
        {id: "2", title: "Corte Simples", price: "R$ 25", time: "20 min"},
        {id: "3", title: "Corte", price: "R$ 35", time: "20 min"},
        {id: "4", title: "Barba", price: "R$ 25", time: "20 min"},
        {id: "5", title: "Sombrancelha", price: "R$ 10", time: "20 min"},
    ]

    const barbeiros = [
        {id: "1", name: "Roberto"},
        {id: "2", name: "Carlos"},
        {id: "3", name: "João"},
        {id: "4", name: "Paulo"},
    ]

    return (
        <View style={{flex: 1, backgroundColor: "#f0f0f0"}}>
            <Header />
            <ScrollView>
                <View style={styles.container}>
                    
                    <View style = {styles.promoCard}>
                        <Text style={styles.titlePromo}>Promoção da Semana!</Text>
                        <Text style = {styles.subtitlePromo}>✂️ Corte + Barba ✂️</Text>
                        <Text style = {styles.subtitlePromo}>Por apenas R$ 50,00!</Text>
                    </View>

                    <Text style={styles.title}>Serviços Populares:</Text>
                    <HorizontalList
                        data={servicos}
                        renderCard={(item) => (
                            <ServiceCard {...item}/>
                        )}
                    />

                    <Text style={styles.title}>Nossos Cabelereiros:</Text>
                    <HorizontalList
                        data={barbeiros}
                         renderCard={(item) => (
                            <BarberCard {...item}/>
                        )} 
                    />

                </View>
            </ScrollView>
            <Navbar />
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
        padding: 12
    },

    text: {
        color: "#0f072e",
        fontSize: 14
    }, 
    title: {
        color: "#000000",
        fontSize: 24,
        fontWeight: "bold",
    },
    promoCard: {
        backgroundColor: "#000000",
        width: "100%",
        padding: 10,
        borderRadius: 10,
        width: "100%",
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
    }
})