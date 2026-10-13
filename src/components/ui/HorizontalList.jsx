// Lista horizontal reutilizável. Recebe qualquer card via renderCard.
// Para mudar a altura máxima, ajuste maxHeight.
import { FlatList, StyleSheet } from 'react-native';

export default function HorizontalList({ data, renderCard }) {
  return (
    <FlatList
      style={styles.list}
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => renderCard(item)}
    />
  );
}

const styles = StyleSheet.create({
  list: { width: '100%', maxHeight: 195 },
  content: { paddingHorizontal: 10 },
});
