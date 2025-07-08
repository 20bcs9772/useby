import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Search, Filter, Plus, CreditCard as Edit, RotateCcw, Check, X, Calendar, Tag } from 'lucide-react-native';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/Colors';

const mockProducts = [
  {
    id: 1,
    name: 'Vitamin D3 Tablets',
    category: 'Medicine',
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400',
    daysLeft: 5,
    status: 'expiring',
    openDate: '2024-01-15',
    expiryDate: '2024-02-15',
    progress: 0.8,
  },
  {
    id: 2,
    name: 'Face Moisturizer',
    category: 'Cosmetics',
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    daysLeft: 45,
    status: 'fresh',
    openDate: '2024-01-10',
    expiryDate: '2024-03-10',
    progress: 0.3,
  },
  {
    id: 3,
    name: 'All-Purpose Cleaner',
    category: 'Cleaning',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400',
    daysLeft: -2,
    status: 'expired',
    openDate: '2023-12-20',
    expiryDate: '2024-01-20',
    progress: 1,
  },
  {
    id: 4,
    name: 'Sunscreen SPF 50',
    category: 'Cosmetics',
    image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=400',
    daysLeft: 120,
    status: 'fresh',
    openDate: '2024-01-05',
    expiryDate: '2024-05-05',
    progress: 0.1,
  },
];

const tabs = ['Fresh', 'Expiring Soon', 'Expired'];
const categories = ['All', 'Medicine', 'Cosmetics', 'Cleaning', 'Food', 'Batteries'];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState(mockProducts);
  
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

  const getFilteredProducts = () => {
    let filtered = products;

    // Filter by tab
    switch (activeTab) {
      case 0: // Fresh
        filtered = filtered.filter(p => p.daysLeft > 30);
        break;
      case 1: // Expiring Soon
        filtered = filtered.filter(p => p.daysLeft <= 30 && p.daysLeft >= 0);
        break;
      case 2: // Expired
        filtered = filtered.filter(p => p.daysLeft < 0);
        break;
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (!selectedCategories.includes('All')) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh':
        return colors.success;
      case 'expiring':
        return colors.warning;
      case 'expired':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getStatusText = (daysLeft: number) => {
    if (daysLeft < 0) {
      return `Expired ${Math.abs(daysLeft)} days ago`;
    } else if (daysLeft === 0) {
      return 'Expires today';
    } else if (daysLeft === 1) {
      return 'Expires tomorrow';
    } else {
      return `${daysLeft} days left`;
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    Alert.alert('Success', 'Product updated successfully');
  };

  const handleMarkUsed = (productId) => {
    Alert.alert(
      'Mark as Used',
      'This will archive the product. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Used', 
          onPress: () => {
            setProducts(prev => prev.filter(p => p.id !== productId));
            Alert.alert('Success', 'Product marked as used');
          }
        },
      ]
    );
  };

  const handleReplace = (product) => {
    Alert.alert('Replace Product', `Add ${product.name} to shopping list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add to List', onPress: () => Alert.alert('Added', 'Product added to shopping list') },
    ]);
  };

  const toggleCategory = (category) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev.filter(c => c !== 'All'), category];
        return newCategories.length === 0 ? ['All'] : newCategories;
      });
    }
  };

  const ProductCard = ({ product }) => (
    <TouchableOpacity 
      style={[
        styles.productCard, 
        { backgroundColor: colors.surface },
        colorScheme === 'light' ? Shadows.light : Shadows.dark
      ]}
      onPress={() => handleEditProduct(product)}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={[styles.categoryTag, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {product.category}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: getStatusColor(product.status),
                  width: `${product.progress * 100}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: getStatusColor(product.status) }]}>
            {getStatusText(product.daysLeft)}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => handleEditProduct(product)}
          >
            <Edit size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.warning + '20' }]}
            onPress={() => handleReplace(product)}
          >
            <RotateCcw size={16} color={colors.warning} />
            <Text style={[styles.actionButtonText, { color: colors.warning }]}>Replace</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
            onPress={() => handleMarkUsed(product.id)}
          >
            <Check size={16} color={colors.success} />
            <Text style={[styles.actionButtonText, { color: colors.success }]}>Used</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EditProductModal = () => {
    if (!editingProduct) return null;

    const [editedProduct, setEditedProduct] = useState(editingProduct);

    return (
      <Modal visible={!!editingProduct} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditingProduct(null)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Product</Text>
            <TouchableOpacity onPress={() => handleSaveProduct(editedProduct)}>
              <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.editSection}>
              <Text style={[styles.editLabel, { color: colors.text }]}>Product Name</Text>
              <TextInput
                style={[styles.editInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={editedProduct.name}
                onChangeText={(text) => setEditedProduct(prev => ({ ...prev, name: text }))}
              />
            </View>

            <View style={styles.editSection}>
              <Text style={[styles.editLabel, { color: colors.text }]}>Category</Text>
              <View style={styles.categorySelector}>
                {categories.slice(1).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      editedProduct.category === category && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                    ]}
                    onPress={() => setEditedProduct(prev => ({ ...prev, category }))}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      { color: editedProduct.category === category ? colors.primary : colors.text }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.dateSection}>
              <View style={styles.dateInput}>
                <Text style={[styles.editLabel, { color: colors.text }]}>Open Date</Text>
                <TouchableOpacity style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={[styles.dateButtonText, { color: colors.text }]}>
                    {editedProduct.openDate}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateInput}>
                <Text style={[styles.editLabel, { color: colors.text }]}>Expiry Date</Text>
                <TouchableOpacity style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={[styles.dateButtonText, { color: colors.text }]}>
                    {editedProduct.expiryDate}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const FilterModal = () => (
    <Modal visible={showFilters} animationType="slide" transparent>
      <View style={styles.filterModalOverlay}>
        <View style={[styles.filterModal, { backgroundColor: colors.surface }]}>
          <View style={styles.filterHeader}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Categories</Text>
            <View style={styles.filterOptions}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    selectedCategories.includes(category) && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    { color: selectedCategories.includes(category) ? colors.primary : colors.text }
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.applyFiltersButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowFilters(false)}
          >
            <Text style={[styles.applyFiltersText, { color: colors.surface }]}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>UseBy</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert('Add Product', 'Camera would open for barcode scanning')}
        >
          <Plus size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.surface }]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index && [styles.activeTab, { backgroundColor: colors.primary }]
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === index ? colors.surface : colors.textMuted }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
        {getFilteredProducts().map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {getFilteredProducts().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No products found</Text>
            <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
              {activeTab === 0 && "You don't have any fresh items yet."}
              {activeTab === 1 && "No items are expiring soon."}
              {activeTab === 2 && "No expired items found."}
            </Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Add Product', 'Camera would open for barcode scanning')}
            >
              <Plus size={20} color={colors.surface} />
              <Text style={[styles.emptyStateButtonText, { color: colors.surface }]}>Add Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <EditProductModal />
      <FilterModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    ...Typography.title,
    fontSize: 28,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    marginLeft: Spacing.md,
  },
  filterButton: {
    borderRadius: BorderRadius.md,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  activeTab: {},
  tabText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  productList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  productCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  productName: {
    ...Typography.subtitle,
    flex: 1,
    marginRight: Spacing.sm,
  },
  categoryTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    ...Typography.label,
    fontSize: 10,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    flex: 1,
    marginHorizontal: Spacing.xs,
    justifyContent: 'center',
    minHeight: 36,
  },
  actionButtonText: {
    ...Typography.caption,
    marginLeft: Spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  emptyStateButtonText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    ...Typography.subtitle,
  },
  saveButton: {
    ...Typography.subtitle,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  editSection: {
    marginBottom: Spacing.xl,
  },
  editLabel: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Spacing.sm,
  },
  editInput: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...Typography.body,
    borderWidth: 1,
    minHeight: 48,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  categoryOptionText: {
    ...Typography.caption,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
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
    minHeight: 48,
  },
  dateButtonText: {
    ...Typography.body,
    marginLeft: Spacing.sm,
  },
  // Filter modal styles
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.xl,
    maxHeight: '70%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  filterTitle: {
    ...Typography.subtitle,
  },
  filterSection: {
    marginBottom: Spacing.xl,
  },
  filterSectionTitle: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  filterOptionText: {
    ...Typography.caption,
  },
  applyFiltersButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  applyFiltersText: {
    ...Typography.subtitle,
  },
});