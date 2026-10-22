import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { colors } from "../constants/colors";
import { products } from "../constants/products";

export default function Order() {
  const { id } = useLocalSearchParams();
  const product = products.find((item) => item.id === id);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const isFormValid = name.trim().length >= 3 && phone.length === 8;

  if (!product) {
    return <Text>Producto no encontrado.</Text>;
  }

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    if (text.length > 0 && text.length < 8) {
      setPhoneError("Faltan " + (8 - text.length) + " números");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = () => {
    let isValid = true;

    if (name.trim().length < 3) {
      setNameError("Escribe al menos 3 letras");
      isValid = false;
    } else {
      setNameError("");
    }

    // Se mantiene tu lógica original con ===
    if (phone.length !== 8) {
      setPhoneError("El celular debe tener 8 números");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // El enrutamiento ahora solo ocurre si TODO el formulario es correcto
    if (isValid) {
      router.push({
        pathname: "/order-confirmed",
        params: { name: name.trim(), product: product.name },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <Image source={product.image} style={styles.summaryImage} />
        <View>
          <Text style={styles.summaryName}>{product.name}</Text>
          <Text style={styles.summaryPrice}>Bs {product.price}</Text>
        </View>
      </View>

      <Text style={styles.label}>Tu nombre</Text>
      <TextInput
        style={[styles.input, nameError !== "" && styles.inputError]}
        value={name}
        onChangeText={setName}
        placeholder="Ej. Ana"
      />
      {nameError !== "" && <Text style={styles.error}>{nameError}</Text>}

      <Text style={styles.label}>Celular</Text>
      <TextInput
        style={[styles.input, phoneError !== "" && styles.inputError]}
        value={phone}
        onChangeText={handlePhoneChange}
        placeholder="Ej. 71234567"
        keyboardType="number-pad"
        maxLength={8}
      />
      {phoneError !== "" && <Text style={styles.error}>{phoneError}</Text>}

      <Text style={styles.label}>Nota para el pedido (opcional)</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Ej. menos hielo"
      />

      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Confirmar pedido</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 8 },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 14,
    marginBottom: 16,
    borderRadius: 28,
    backgroundColor: colors.card,
    shadowColor: colors.text,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  summaryImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
    resizeMode: "contain",
    backgroundColor: colors.primarySoft,
  },
  summaryName: { fontSize: 18, fontWeight: "700", color: colors.text },
  summaryPrice: { fontSize: 20, fontWeight: "800", color: colors.primary },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 12,
    marginLeft: 4,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    borderWidth: 1.5,
    borderRadius: 18,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  button: {
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: colors.onPrimary,
  },
  inputError: { borderColor: colors.error },
  error: { fontSize: 13, color: colors.error, marginLeft: 4 },
  buttonDisabled: { opacity: 0.4, elevation: 0, shadowOpacity: 0 },
});
