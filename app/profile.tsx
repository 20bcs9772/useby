"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Image } from "react-native"
import { Mail, Users, LogOut, ChevronRight, CreditCard as Edit, Settings, Shield, Bell } from "lucide-react-native"
import { useThemeColors, useColorScheme } from "@/hooks/useColorScheme"
import { Spacing, Typography, BorderRadius, Shadows } from "@/constants/Colors"
import { useRouter } from "expo-router"

export default function Profile() {
  const [userInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
    householdMembers: 3,
  })

  const colors = useThemeColors()
  const colorScheme = useColorScheme()
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/auth"),
      },
    ])
  }

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing would open here")
  }

  const handleHouseholdSharing = () => {
    Alert.alert("Household Sharing", "How would you like to add members?", [
      { text: "Cancel", style: "cancel" },
      { text: "Email Invite", onPress: () => Alert.alert("Email", "Email invite would be sent") },
      { text: "QR Code", onPress: () => Alert.alert("QR Code", "QR code sharing would open") },
    ])
  }

  const handleNotifications = () => {
    router.push("/notifications")
  }

  const handleSettings = () => {
    router.push("/(tabs)/settings")
  }

  const ProfileItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    iconColor = colors.primary,
    iconBgColor = colors.primary + "20",
  }: {
    icon: any
    title: string
    subtitle?: string
    onPress?: () => void
    showChevron?: boolean
    iconColor?: string
    iconBgColor?: string
  }) => (
    <TouchableOpacity
      style={[
        styles.profileItem,
        { backgroundColor: colors.surface },
        colorScheme === "light" ? Shadows.light : Shadows.dark,
      ]}
      onPress={onPress}
    >
      <View style={styles.profileItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.profileItemText}>
          <Text style={[styles.profileItemTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.profileItemSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight size={20} color={colors.textMuted} />}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.surface },
            colorScheme === "light" ? Shadows.light : Shadows.dark,
          ]}
        >
          <View style={styles.profileHeader}>
            <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>{userInfo.name}</Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{userInfo.email}</Text>
            </View>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary + "20" }]}
              onPress={handleEditProfile}
            >
              <Edit size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

          <ProfileItem
            icon={Mail}
            title="Email"
            subtitle={userInfo.email}
            onPress={() => Alert.alert("Email", "Email settings would open here")}
          />

          <ProfileItem
            icon={Users}
            title="Household Sharing"
            subtitle={`${userInfo.householdMembers} members`}
            onPress={handleHouseholdSharing}
            iconColor={colors.success}
            iconBgColor={colors.success + "20"}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App</Text>

          <ProfileItem
            icon={Bell}
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={handleNotifications}
            iconColor={colors.warning}
            iconBgColor={colors.warning + "20"}
          />

          <ProfileItem
            icon={Settings}
            title="Settings"
            subtitle="App preferences and configuration"
            onPress={handleSettings}
          />

          <ProfileItem
            icon={Shield}
            title="Privacy & Security"
            subtitle="Data protection and privacy settings"
            onPress={() => Alert.alert("Privacy", "Privacy settings would open here")}
            iconColor={colors.primary}
            iconBgColor={colors.primary + "20"}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: colors.surface, borderColor: colors.error },
              colorScheme === "light" ? Shadows.light : Shadows.dark,
            ]}
            onPress={handleLogout}
          >
            <View style={[styles.logoutIconContainer, { backgroundColor: colors.error + "20" }]}>
              <LogOut size={20} color={colors.error} />
            </View>
            <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
            <ChevronRight size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>UseBy v1.0.0</Text>
          <Text style={[styles.footerSubtext, { color: colors.textMuted }]}>
            Smart expiry tracking for your household
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  profileCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.title,
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.lg,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    minHeight: 72,
  },
  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    ...Typography.subtitle,
  },
  profileItemSubtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    minHeight: 72,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  logoutText: {
    ...Typography.subtitle,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  footerText: {
    ...Typography.body,
    fontFamily: "Inter-SemiBold",
  },
  footerSubtext: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
})
