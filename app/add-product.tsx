"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Image,
} from "react-native"
import { ArrowLeft, Camera, Search, Save, Package, Scan, Calendar } from "lucide-react-native"
import { useThemeColors, useColorScheme } from "@/hooks/useColorScheme"
import { Spacing, Typography, BorderRadius, Shadows } from "@/constants/Colors"
import { useRouter } from "expo-router"

const categories = [
  { id: "medicine", name: "Medicine", icon: "💊", color: "#FF6B6B" },
  { id: "cosmetics", name: "Cosmetics", icon: "🧴", color: "#4ECDC4" },
  { id: "cleaning", name: "Cleaning", icon: "🧽", color: "#45B7D1" },
  { id: "food", name: "Food", icon: "🥫", color: "#96CEB4" },
  { id: "batteries", name: "Batteries", icon: "🔋", color: "#FFEAA7" },
  { id: "other", name: "Other", icon: "📦", color: "#DDA0DD" },
]

export default function AddProduct() {
  const [productName, setProductName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [openDate, setOpenDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [notes, setNotes] = useState("")
  const [scannedItem, setScannedItem] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  const colors = useThemeColors()
  const colorScheme = useColorScheme()
  const router = useRouter()

  const handleScan = () => {
    setIsScanning(true)
    // Simulate barcode scanning
    setTimeout(() => {
      const mockScannedItem = {
        name: "Vitamin D3 Tablets",
        category: "medicine",
        image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=200",
        expiryDate: "2024-12-15",
      }
      setScannedItem(mockScannedItem)
      setProductName(mockScannedItem.name)
      setSelectedCategory(mockScannedItem.category)
      setExpiryDate(mockScannedItem.expiryDate)
      setIsScanning(false)
      Alert.alert("Product Scanned", "Product details loaded from barcode")
    }, 2000)
  }

  const handleSearch = () => {
    Alert.alert("Search Products", "Product database search would open here")
  }

  const handleSave = () => {
    if (!productName || !selectedCategory) {
      Alert.alert("Error", "Please fill in required fields")
      return
    }

    Alert.alert("Product Added", `${productName} has been added to your inventory`, [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ])
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Add Product</Text>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Save size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.scanSection,
            { backgroundColor: colors.surface },
            colorScheme === "light" ? Shadows.light : Shadows.dark,
          ]}
        >
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: colors.primary }, isScanning && { opacity: 0.7 }]}
            onPress={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Scan size={24} color={colors.surface} />
                <Text style={[styles.scanButtonText, { color: colors.surface }]}>Scanning...</Text>
              </>
            ) : (
              <>
                <Camera size={24} color={colors.surface} />
                <Text style={[styles.scanButtonText, { color: colors.surface }]}>Scan Barcode</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.background, borderColor: colors.primary }]}
            onPress={handleSearch}
          >
            <Search size={20} color={colors.primary} />
            <Text style={[styles.searchButtonText, { color: colors.primary }]}>Search Product Database</Text>
          </TouchableOpacity>
        </View>

        {scannedItem && (
          <View
            style={[
              styles.scannedItemCard,
              { backgroundColor: colors.surface },
              colorScheme === "light" ? Shadows.light : Shadows.dark,
            ]}
          >
            <Text style={[styles.scannedTitle, { color: colors.text }]}>Scanned Product</Text>
            <View style={styles.scannedContent}>
              <Image source={{ uri: scannedItem.image }} style={styles.scannedImage} />
              <View style={styles.scannedInfo}>
                <Text style={[styles.scannedName, { color: colors.text }]}>{scannedItem.name}</Text>
                <Text style={[styles.scannedCategory, { color: colors.textMuted }]}>
                  {categories.find((c) => c.id === scannedItem.category)?.name}
                </Text>
                <Text style={[styles.scannedExpiry, { color: colors.warning }]}>Expires: {scannedItem.expiryDate}</Text>
              </View>
            </View>
          </View>
        )}

        <View
          style={[
            styles.formSection,
            { backgroundColor: colors.surface },
            colorScheme === "light" ? Shadows.light : Shadows.dark,
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Product Details</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Product Name *</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Enter product name"
              placeholderTextColor={colors.textMuted}
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: colors.background },
                    selectedCategory === category.id && [
                      styles.selectedCategory,
                      { backgroundColor: category.color + "20", borderColor: category.color },
                    ],
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      { color: colors.text },
                      selectedCategory === category.id && { color: category.color, fontFamily: "Inter-SemiBold" },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: colors.text }]}>Open Date</Text>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateButtonText, { color: colors.textMuted }]}>{openDate || "Select date"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: colors.text }]}>Expiry Date *</Text>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateButtonText, { color: expiryDate ? colors.text : colors.textMuted }]}>
                  {expiryDate || "Select date"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Add any notes about this product..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveMainButton,
            { backgroundColor: colors.primary },
            colorScheme === "light" ? Shadows.light : {},
          ]}
          onPress={handleSave}
        >
          <Package size={20} color={colors.surface} />
          <Text style={[styles.saveMainButtonText, { color: colors.surface }]}>Add to Inventory</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...Typography.title,
    fontSize: 24,
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.lg,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scanSection: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    minHeight: 56,
  },
  scanButtonText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...Typography.body,
    marginHorizontal: Spacing.lg,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    minHeight: 56,
  },
  searchButtonText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
  scannedItemCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  scannedTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
  },
  scannedContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  scannedImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  scannedInfo: {
    flex: 1,
  },
  scannedName: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs,
  },
  scannedCategory: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  scannedExpiry: {
    ...Typography.caption,
    fontFamily: "Inter-SemiBold",
  },
  formSection: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subtitle,
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    fontFamily: "Inter-SemiBold",
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...Typography.body,
    borderWidth: 1,
    minHeight: 56,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categoryScroll: {
    marginTop: Spacing.sm,
  },
  categoryButton: {
    alignItems: "center",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.md,
    minWidth: 80,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCategory: {
    borderWidth: 2,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    ...Typography.body,
    fontSize: 12,
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    minHeight: 56,
  },
  dateButtonText: {
    ...Typography.body,
    marginLeft: Spacing.sm,
  },
  saveMainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xxl,
    minHeight: 56,
  },
  saveMainButtonText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
})
