import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Camera, Search, Calendar, Tag, Package, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/Colors';

const categories = [
  { id: 'medicine', name: 'Medicine', icon: '💊', color: '#FF6B6B' },
  { id: 'cosmetics', name: 'Cosmetics', icon: '🧴', color: '#4ECDC4' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧽', color: '#45B7D1' },
  { id: 'food', name: 'Food', icon: '🥫', color: '#96CEB4' },
  { id: 'batteries', name: 'Batteries', icon: '🔋', color: '#FFEAA7' },
  { id: 'other', name: 'Other', icon: '📦', color: '#DDA0DD' },
];

const quickTags = [
  'Store in fridge',
  'Light-sensitive', 
  'Keep dry',
  'Shake before use',
  'Take with food',
  'Fragile'
];

export default function Add() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

  const handleScanBarcode = () => {
    Alert.alert('Camera', 'Barcode scanning would open camera here');
  };

  const handleSearchProduct = () => {
    Alert.alert('Search', 'Product search would open here');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSaveProduct = () => {
    if (!productName || !selectedCategory) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setProductName('');
      setSelectedCategory('');
      setOpenDate('');
      setExpiryDate('');
      setNotes('');
      setSelectedTags([]);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
            <CheckCircle size={64} color={colors.success} />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Product Added!</Text>
          <Text style={[styles.successMessage, { color: colors.textMuted }]}>
            {productName} has been successfully added to your inventory
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Add Product</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Track a new household item</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[
          styles.scanSection, 
          { backgroundColor: colors.surface },
          colorScheme === 'light' ? Shadows.light : Shadows.dark
        ]}>
          <TouchableOpacity 
            style={[styles.scanButton, { backgroundColor: colors.primary }]} 
            onPress={handleScanBarcode}
          >
            <Camera size={24} color={colorScheme === 'light' ? colors.surface : colors.background} />
            <Text style={[styles.scanButtonText, { color: colorScheme === 'light' ? colors.surface : colors.background }]}>
              Scan Barcode
            </Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: colors.background, borderColor: colors.primary }]} 
            onPress={handleSearchProduct}
          >
            <Search size={20} color={colors.primary} />
            <Text style={[styles.searchButtonText, { color: colors.primary }]}>Search Product Database</Text>
          </TouchableOpacity>
        </View>

        <View style={[
          styles.formSection, 
          { backgroundColor: colors.surface },
          colorScheme === 'light' ? Shadows.light : Shadows.dark
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Product Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Product Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
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
                      { backgroundColor: category.color + '20', borderColor: category.color }
                    ]
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    { color: colors.text },
                    selectedCategory === category.id && { color: category.color, fontFamily: 'Inter-SemiBold' }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: colors.text }]}>Open Date</Text>
              <TouchableOpacity style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateButtonText, { color: colors.textMuted }]}>
                  {openDate || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: colors.text }]}>Expiry Date</Text>
              <TouchableOpacity style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateButtonText, { color: colors.textMuted }]}>
                  {expiryDate || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Add storage instructions, usage notes..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <View style={styles.tagsSection}>
            <Text style={[styles.label, { color: colors.text }]}>Quick Tags</Text>
            <View style={styles.tagsContainer}>
              {quickTags.map((tag) => (
                <TouchableOpacity 
                  key={tag} 
                  style={[
                    styles.tag,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    selectedTags.includes(tag) && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Tag size={14} color={selectedTags.includes(tag) ? colors.primary : colors.textMuted} />
                  <Text style={[
                    styles.tagText, 
                    { color: selectedTags.includes(tag) ? colors.primary : colors.textMuted }
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { backgroundColor: colors.primary },
            colorScheme === 'light' ? Shadows.light : {}
          ]} 
          onPress={handleSaveProduct}
        >
          <Package size={20} color={colorScheme === 'light' ? colors.surface : colors.background} />
          <Text style={[styles.saveButtonText, { color: colorScheme === 'light' ? colors.surface : colors.background }]}>
            Add Product
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    ...Typography.title,
    fontSize: 28,
  },
  subtitle: {
    ...Typography.body,
    marginTop: Spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    minHeight: 56,
  },
  searchButtonText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
  formSection: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.title,
    fontSize: 20,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
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
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginTop: Spacing.sm,
  },
  categoryButton: {
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.md,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'transparent',
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
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  tagsSection: {
    marginTop: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  tagText: {
    ...Typography.body,
    fontSize: 12,
    marginLeft: Spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xxl,
    minHeight: 56,
  },
  saveButtonText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successTitle: {
    ...Typography.title,
    fontSize: 24,
    marginBottom: Spacing.md,
  },
  successMessage: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 20,
  },
});