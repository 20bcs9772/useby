import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { ShoppingCart, Plus, ExternalLink, Check, X, Star, Truck, DollarSign, Package } from 'lucide-react-native';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/Colors';

const suggestedItems = [
  {
    id: 1,
    name: 'All-Purpose Cleaner',
    reason: 'Expired 2 days ago',
    category: 'Cleaning',
    priority: 'high',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=200',
    prices: [
      { platform: 'Blinkit', price: '₹299', delivery: '10 min', inStock: true, recommended: true },
      { platform: 'Zepto', price: '₹320', delivery: '15 min', inStock: true, recommended: false },
      { platform: 'Amazon', price: '₹280', delivery: '1 day', inStock: true, recommended: false },
    ]
  },
  {
    id: 2,
    name: 'Vitamin D3 Tablets',
    reason: 'Expires in 5 days',
    category: 'Medicine',
    priority: 'medium',
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=200',
    prices: [
      { platform: '1mg', price: '₹450', delivery: '2 hours', inStock: true, recommended: true },
      { platform: 'Pharmeasy', price: '₹480', delivery: '3 hours', inStock: true, recommended: false },
      { platform: 'Amazon', price: '₹420', delivery: '1 day', inStock: true, recommended: false },
    ]
  },
  {
    id: 3,
    name: 'Face Moisturizer',
    reason: 'Running low',
    category: 'Cosmetics',
    priority: 'low',
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=200',
    prices: [
      { platform: 'Nykaa', price: '₹650', delivery: '1 day', inStock: false, recommended: false },
      { platform: 'Amazon', price: '₹620', delivery: '2 days', inStock: true, recommended: true },
      { platform: 'Flipkart', price: '₹680', delivery: '3 days', inStock: true, recommended: false },
    ]
  },
];

const shoppingList = [
  {
    id: 1,
    name: 'All-Purpose Cleaner',
    quantity: 1,
    bestPrice: '₹280',
    platform: 'Amazon',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 2,
    name: 'Vitamin D3 Tablets',
    quantity: 2,
    bestPrice: '₹420',
    platform: '1mg',
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const tabs = ['Suggestions', 'My List'];

export default function Shopping() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [currentShoppingList, setCurrentShoppingList] = useState(shoppingList);
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleItemExpansion = (itemId: number) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const addToShoppingList = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No items selected', 'Please select items to add to your shopping list');
      return;
    }
    
    const newItems = suggestedItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => ({
        id: Date.now() + item.id,
        name: item.name,
        quantity: 1,
        bestPrice: item.prices.find(p => p.recommended)?.price || item.prices[0].price,
        platform: item.prices.find(p => p.recommended)?.platform || item.prices[0].platform,
        image: item.image,
      }));
    
    setCurrentShoppingList(prev => [...prev, ...newItems]);
    setSelectedItems([]);
    Alert.alert('Success', `${newItems.length} items added to shopping list`);
  };

  const removeFromShoppingList = (itemId: number) => {
    setCurrentShoppingList(prev => prev.filter(item => item.id !== itemId));
    Alert.alert('Removed', 'Item removed from shopping list');
  };

  const openPlatform = (platform: string, productName: string) => {
    Alert.alert('Opening ' + platform, `This would open ${platform} app/website with ${productName}`);
  };

  const renderSuggestionsView = () => (
    <View style={styles.suggestionsContainer}>
      <View style={styles.headerSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Smart Suggestions</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          Based on your expiry tracking and usage patterns
        </Text>
      </View>

      {suggestedItems.map((item) => (
        <View key={item.id}>
          <TouchableOpacity
            style={[
              styles.suggestionCard,
              { backgroundColor: colors.surface, borderColor: selectedItems.includes(item.id) ? colors.primary : 'transparent' },
              colorScheme === 'light' ? Shadows.light : Shadows.dark,
              selectedItems.includes(item.id) && { borderWidth: 2 }
            ]}
            onPress={() => toggleItemExpansion(item.id)}
          >
            <View style={styles.suggestionContent}>
              <Image source={{ uri: item.image }} style={styles.suggestionImage} />
              
              <View style={styles.suggestionInfo}>
                <View style={styles.suggestionHeader}>
                  <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <TouchableOpacity 
                    style={styles.selectionIndicator}
                    onPress={() => toggleItemSelection(item.id)}
                  >
                    {selectedItems.includes(item.id) ? (
                      <Check size={20} color={colors.primary} />
                    ) : (
                      <View style={[styles.unselectedCircle, { borderColor: colors.primary }]} />
                    )}
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.itemCategory, { color: colors.textMuted }]}>{item.category}</Text>
                <Text style={[styles.suggestionReason, { color: colors.textMuted }]}>{item.reason}</Text>
                
                <View style={styles.priorityContainer}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                      {item.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.bestPricePreview}>
                  <DollarSign size={16} color={colors.success} />
                  <Text style={[styles.bestPriceText, { color: colors.success }]}>
                    Best: {item.prices.find(p => p.recommended)?.price} on {item.prices.find(p => p.recommended)?.platform}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {expandedItem === item.id && (
            <View style={[
              styles.priceComparison, 
              { backgroundColor: colors.surface },
              colorScheme === 'light' ? Shadows.light : Shadows.dark
            ]}>
              <Text style={[styles.priceComparisonTitle, { color: colors.text }]}>Price Comparison</Text>
              {item.prices.map((price, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.priceOption,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    price.recommended && { borderColor: colors.success, borderWidth: 2 }
                  ]}
                  onPress={() => openPlatform(price.platform, item.name)}
                >
                  <View style={styles.priceOptionContent}>
                    <View style={styles.priceOptionHeader}>
                      <Text style={[styles.platformName, { color: colors.text }]}>{price.platform}</Text>
                      {price.recommended && (
                        <View style={[styles.recommendedBadge, { backgroundColor: colors.success + '20' }]}>
                          <Star size={12} color={colors.success} />
                          <Text style={[styles.recommendedText, { color: colors.success }]}>Best</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.priceDetails}>
                      <Text style={[styles.priceAmount, { color: colors.primary }]}>{price.price}</Text>
                      <View style={styles.deliveryInfo}>
                        <Truck size={14} color={colors.textMuted} />
                        <Text style={[styles.deliveryText, { color: colors.textMuted }]}>{price.delivery}</Text>
                      </View>
                      <Text style={[
                        styles.stockStatus, 
                        { color: price.inStock ? colors.success : colors.error }
                      ]}>
                        {price.inStock ? 'In Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                  
                  <ExternalLink size={16} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      {selectedItems.length > 0 && (
        <TouchableOpacity 
          style={[
            styles.addToListButton, 
            { backgroundColor: colors.primary },
            colorScheme === 'light' ? Shadows.light : {}
          ]} 
          onPress={addToShoppingList}
        >
          <Plus size={20} color={colors.surface} />
          <Text style={[styles.addToListText, { color: colors.surface }]}>
            Add {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} to list
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderShoppingListView = () => (
    <View style={styles.listContainer}>
      <View style={styles.headerSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Shopping List</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          {currentShoppingList.length} items ready to order
        </Text>
      </View>

      {currentShoppingList.map((item) => (
        <View 
          key={item.id} 
          style={[
            styles.listItem, 
            { backgroundColor: colors.surface },
            colorScheme === 'light' ? Shadows.light : Shadows.dark
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.listItemImage} />
          
          <View style={styles.listItemInfo}>
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.itemQuantity, { color: colors.textMuted }]}>
              Quantity: {item.quantity}
            </Text>
            <View style={styles.bestPriceInfo}>
              <Text style={[styles.bestPriceLabel, { color: colors.textMuted }]}>Best price: </Text>
              <Text style={[styles.bestPriceAmount, { color: colors.success }]}>{item.bestPrice}</Text>
              <Text style={[styles.bestPricePlatform, { color: colors.textMuted }]}> on {item.platform}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromShoppingList(item.id)}
          >
            <X size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}

      {currentShoppingList.length === 0 && (
        <View style={styles.emptyState}>
          <ShoppingCart size={64} color={colors.primary} strokeWidth={1} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Your list is empty</Text>
          <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
            Add items from suggestions or manually to get started
          </Text>
          <TouchableOpacity 
            style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab(0)}
          >
            <Plus size={20} color={colors.surface} />
            <Text style={[styles.emptyStateButtonText, { color: colors.surface }]}>Browse Suggestions</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentShoppingList.length > 0 && (
        <View style={styles.orderSection}>
          <Text style={[styles.orderTitle, { color: colors.text }]}>Quick Order</Text>
          
          <TouchableOpacity 
            style={[
              styles.orderButton, 
              { backgroundColor: colors.primary },
              colorScheme === 'light' ? Shadows.light : {}
            ]} 
            onPress={() => openPlatform('Blinkit', 'your shopping list')}
          >
            <View style={styles.orderButtonContent}>
              <Package size={20} color={colors.surface} />
              <Text style={[styles.orderButtonText, { color: colors.surface }]}>
                Order on Blinkit
              </Text>
              <ExternalLink size={20} color={colors.surface} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.orderButton, 
              styles.secondaryOrderButton, 
              { backgroundColor: colors.background, borderColor: colors.primary },
              colorScheme === 'light' ? Shadows.light : Shadows.dark
            ]} 
            onPress={() => openPlatform('Amazon', 'your shopping list')}
          >
            <View style={styles.orderButtonContent}>
              <Package size={20} color={colors.primary} />
              <Text style={[styles.orderButtonText, styles.secondaryOrderText, { color: colors.primary }]}>
                Order on Amazon
              </Text>
              <ExternalLink size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Smart Shopping</Text>
        <TouchableOpacity 
          style={[
            styles.addButton, 
            { backgroundColor: colors.surface },
            colorScheme === 'light' ? Shadows.light : Shadows.dark
          ]}
          onPress={() => Alert.alert('Add Item', 'Manual item entry would open here')}
        >
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index && [
                styles.activeTab,
                { backgroundColor: colors.primary },
                colorScheme === 'light' ? Shadows.light : {}
              ]
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 0 && renderSuggestionsView()}
        {activeTab === 1 && renderShoppingListView()}
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  headerSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.subtitle,
  },
  sectionSubtitle: {
    ...Typography.body,
    marginTop: Spacing.xs,
  },
  suggestionsContainer: {
    paddingBottom: Spacing.xxl,
  },
  suggestionCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 0,
  },
  suggestionContent: {
    flexDirection: 'row',
  },
  suggestionImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemName: {
    ...Typography.subtitle,
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemCategory: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  suggestionReason: {
    ...Typography.caption,
    marginBottom: Spacing.md,
  },
  priorityContainer: {
    marginBottom: Spacing.md,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  priorityText: {
    ...Typography.label,
    fontSize: 10,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  bestPricePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestPriceText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
    marginLeft: Spacing.xs,
  },
  priceComparison: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: -Spacing.md,
  },
  priceComparisonTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
  },
  priceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  priceOptionContent: {
    flex: 1,
  },
  priceOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  platformName: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  recommendedText: {
    ...Typography.label,
    fontSize: 10,
    marginLeft: Spacing.xs,
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceAmount: {
    ...Typography.subtitle,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    ...Typography.caption,
    marginLeft: Spacing.xs,
  },
  stockStatus: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
  },
  addToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
    minHeight: 56,
  },
  addToListText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
  listContainer: {
    paddingBottom: Spacing.xxl,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  listItemImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  listItemInfo: {
    flex: 1,
  },
  itemQuantity: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  bestPriceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  bestPriceLabel: {
    ...Typography.caption,
  },
  bestPriceAmount: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
  },
  bestPricePlatform: {
    ...Typography.caption,
  },
  removeButton: {
    padding: Spacing.sm,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    ...Typography.subtitle,
    marginTop: Spacing.xl,
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
  orderSection: {
    marginTop: Spacing.xl,
  },
  orderTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.lg,
  },
  orderButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    minHeight: 56,
  },
  secondaryOrderButton: {
    borderWidth: 2,
  },
  orderButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonText: {
    ...Typography.subtitle,
    marginHorizontal: Spacing.sm,
  },
  secondaryOrderText: {},
});