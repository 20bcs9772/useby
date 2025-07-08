import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Bell, Clock, Pill, ShoppingBag, TriangleAlert as AlertTriangle, X, SunSnow as Snooze } from 'lucide-react-native';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/Colors';

const mockNotifications = [
  {
    id: 1,
    type: 'expiry',
    title: 'Sunscreen expires soon',
    message: 'Your SPF 50 Sunscreen expires in 3 days',
    timestamp: '2 hours ago',
    icon: AlertTriangle,
    color: '#FF9800',
    priority: 'high',
  },
  {
    id: 2,
    type: 'medicine',
    title: 'Medicine reminder',
    message: 'Time to take your Vitamin D3 (1000 IU)',
    timestamp: '30 minutes ago',
    icon: Pill,
    color: '#4CAF50',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'expired',
    title: 'Product expired',
    message: 'All-Purpose Cleaner expired 2 days ago',
    timestamp: '1 day ago',
    icon: AlertTriangle,
    color: '#F44336',
    priority: 'high',
  },
  {
    id: 4,
    type: 'restock',
    title: 'Restock suggestion',
    message: 'Consider buying Face Moisturizer - running low',
    timestamp: '3 hours ago',
    icon: ShoppingBag,
    color: '#2196F3',
    priority: 'low',
  },
  {
    id: 5,
    type: 'medicine',
    title: 'Missed dose',
    message: 'You missed your 2PM Omega-3 dose',
    timestamp: '5 hours ago',
    icon: Clock,
    color: '#FF5722',
    priority: 'medium',
  },
  {
    id: 6,
    type: 'expiry',
    title: 'Multiple items expiring',
    message: '3 cosmetic products expire this week',
    timestamp: '1 day ago',
    icon: AlertTriangle,
    color: '#FF9800',
    priority: 'medium',
  },
];

const tabs = ['All', 'Expiry', 'Medicine', 'Shopping'];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState(mockNotifications);
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 0: // All
        return notifications;
      case 1: // Expiry
        return notifications.filter(n => n.type === 'expiry' || n.type === 'expired');
      case 2: // Medicine
        return notifications.filter(n => n.type === 'medicine');
      case 3: // Shopping
        return notifications.filter(n => n.type === 'restock');
      default:
        return notifications;
    }
  };

  const handleDismiss = (notificationId: number) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleSnooze = (notificationId: number) => {
    Alert.alert('Snoozed', 'Notification snoozed for 1 hour');
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleNotificationPress = (notification: any) => {
    switch (notification.type) {
      case 'expiry':
      case 'expired':
        Alert.alert('Product Details', 'Would navigate to product details');
        break;
      case 'medicine':
        Alert.alert('Medicine Tracker', 'Would navigate to medicine tracker');
        break;
      case 'restock':
        Alert.alert('Shopping List', 'Would navigate to shopping list');
        break;
    }
  };

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

  const NotificationCard = ({ notification }: { notification: any }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        { backgroundColor: colors.surface },
        colorScheme === 'light' ? Shadows.light : Shadows.dark
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: notification.color + '20' }]}>
          <notification.icon size={24} color={notification.color} />
        </View>
        
        <View style={styles.notificationText}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, { color: colors.text }]} numberOfLines={1}>
              {notification.title}
            </Text>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(notification.priority) }]} />
          </View>
          
          <Text style={[styles.notificationMessage, { color: colors.textMuted }]} numberOfLines={2}>
            {notification.message}
          </Text>
          
          <Text style={[styles.notificationTimestamp, { color: colors.textMuted }]}>
            {notification.timestamp}
          </Text>
        </View>
      </View>

      <View style={styles.notificationActions}>
        {notification.type === 'medicine' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.warning + '20' }]}
            onPress={() => handleSnooze(notification.id)}
          >
            <Snooze size={16} color={colors.warning} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
          onPress={() => handleDismiss(notification.id)}
        >
          <X size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('Mark All Read', 'All notifications marked as read')}
          >
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
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

      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {getFilteredNotifications().length > 0 ? (
          getFilteredNotifications().map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Bell size={64} color={colors.primary} strokeWidth={1} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No notifications</Text>
            <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
              {activeTab === 0 && "You're all caught up! No new notifications."}
              {activeTab === 1 && "No expiry notifications at the moment."}
              {activeTab === 2 && "No medicine reminders right now."}
              {activeTab === 3 && "No shopping suggestions available."}
            </Text>
          </View>
        )}
      </ScrollView>

      {getFilteredNotifications().length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.clearAllButton, { backgroundColor: colors.error + '20' }]}
            onPress={() => {
              Alert.alert(
                'Clear All',
                'Are you sure you want to clear all notifications?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Clear All', 
                    style: 'destructive',
                    onPress: () => setNotifications([])
                  },
                ]
              );
            }}
          >
            <X size={20} color={colors.error} />
            <Text style={[styles.clearAllText, { color: colors.error }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  headerButtonText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
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
  notificationsList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  notificationCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    ...Typography.subtitle,
    flex: 1,
    marginRight: Spacing.sm,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    ...Typography.body,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  notificationTimestamp: {
    ...Typography.label,
    fontSize: 11,
  },
  notificationActions: {
    flexDirection: 'row',
    marginLeft: Spacing.md,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: Spacing.xl,
  },
  emptyStateTitle: {
    ...Typography.subtitle,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  clearAllText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
});