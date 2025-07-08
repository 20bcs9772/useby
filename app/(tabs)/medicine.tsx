import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Plus, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Calendar, Pill, SunSnow as Snooze } from 'lucide-react-native';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/Colors';

const mockMedicines = [
  {
    id: 1,
    name: 'Vitamin D3',
    dosage: '1000 IU',
    frequency: 'Once daily',
    times: ['09:00'],
    taken: [true],
    instructions: 'Take with food',
    nextDose: '09:00',
    condition: 'with_food',
  },
  {
    id: 2,
    name: 'Omega-3',
    dosage: '500mg',
    frequency: 'Twice daily',
    times: ['08:00', '20:00'],
    taken: [true, false],
    instructions: 'Take with meals',
    nextDose: '20:00',
    condition: 'with_food',
  },
  {
    id: 3,
    name: 'Multivitamin',
    dosage: '1 tablet',
    frequency: 'Once daily',
    times: ['08:30'],
    taken: [false],
    instructions: 'Take on empty stomach',
    nextDose: '08:30',
    condition: 'empty_stomach',
  },
];

const todaySchedule = [
  { id: 1, time: '08:00', medicine: 'Omega-3', dosage: '500mg', taken: true, condition: 'with_food' },
  { id: 2, time: '08:30', medicine: 'Multivitamin', dosage: '1 tablet', taken: false, condition: 'empty_stomach' },
  { id: 3, time: '09:00', medicine: 'Vitamin D3', dosage: '1000 IU', taken: true, condition: 'with_food' },
  { id: 4, time: '20:00', medicine: 'Omega-3', dosage: '500mg', taken: false, condition: 'with_food' },
];

const tabs = ['Today', 'My Medicines', 'Calendar'];

export default function Medicine() {
  const [activeTab, setActiveTab] = useState(0);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [schedule, setSchedule] = useState(todaySchedule);
  const colors = useThemeColors();
  const colorScheme = useColorScheme();

  const getConditionIcon = (condition: string) => {
    return condition === 'with_food' ? '🍽️' : '⏰';
  };

  const getConditionText = (condition: string) => {
    return condition === 'with_food' ? 'With food' : 'Empty stomach';
  };

  const handleTakeMedicine = (scheduleId: number) => {
    setSchedule(prev => prev.map(item => 
      item.id === scheduleId ? { ...item, taken: true } : item
    ));
    Alert.alert('Medicine Taken', 'Dose recorded successfully');
  };

  const handleSnoozeMedicine = (scheduleId: number) => {
    Alert.alert('Snoozed', 'Reminder snoozed for 15 minutes');
  };

  const handleMissedMedicine = (scheduleId: number) => {
    Alert.alert('Missed Dose', 'Dose marked as missed');
  };

  const renderTodayView = () => (
    <View style={styles.todayContainer}>
      <View style={[
        styles.progressCard, 
        { backgroundColor: colors.surface },
        colorScheme === 'light' ? Shadows.light : Shadows.dark
      ]}>
        <Text style={[styles.progressTitle, { color: colors.text }]}>Today's Progress</Text>
        <View style={styles.progressStats}>
          <View style={styles.progressItem}>
            <Text style={[styles.progressNumber, { color: colors.success }]}>2</Text>
            <Text style={[styles.progressLabel, { color: colors.textMuted }]}>Taken</Text>
          </View>
          <View style={[styles.progressDivider, { backgroundColor: colors.border }]} />
          <View style={styles.progressItem}>
            <Text style={[styles.progressNumber, { color: colors.warning }]}>2</Text>
            <Text style={[styles.progressLabel, { color: colors.textMuted }]}>Remaining</Text>
          </View>
          <View style={[styles.progressDivider, { backgroundColor: colors.border }]} />
          <View style={styles.progressItem}>
            <Text style={[styles.progressNumber, { color: colors.primary }]}>50%</Text>
            <Text style={[styles.progressLabel, { color: colors.textMuted }]}>Compliance</Text>
          </View>
        </View>
      </View>

      <View style={styles.reminderToggle}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Reminders</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
            Get notified for medicine doses
          </Text>
        </View>
        <Switch
          value={reminderEnabled}
          onValueChange={setReminderEnabled}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={reminderEnabled ? colors.primary : colors.textMuted}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Schedule</Text>
      {schedule.map((item) => (
        <View 
          key={item.id} 
          style={[
            styles.scheduleItem, 
            { backgroundColor: colors.surface },
            colorScheme === 'light' ? Shadows.light : Shadows.dark
          ]}
        >
          <View style={styles.scheduleTime}>
            <Text style={[styles.timeText, { color: colors.primary }]}>{item.time}</Text>
            <Text style={styles.conditionIcon}>{getConditionIcon(item.condition)}</Text>
          </View>
          
          <View style={styles.scheduleInfo}>
            <Text style={[styles.medicineName, { color: colors.text }]}>{item.medicine}</Text>
            <Text style={[styles.medicineDosage, { color: colors.textMuted }]}>{item.dosage}</Text>
            <Text style={[styles.conditionText, { color: colors.textMuted }]}>
              {getConditionText(item.condition)}
            </Text>
          </View>

          <View style={styles.scheduleActions}>
            {item.taken ? (
              <View style={styles.takenIndicator}>
                <CheckCircle size={24} color={colors.success} />
                <Text style={[styles.takenText, { color: colors.success }]}>Taken</Text>
              </View>
            ) : (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.warning + '20' }]}
                  onPress={() => handleSnoozeMedicine(item.id)}
                >
                  <Snooze size={16} color={colors.warning} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
                  onPress={() => handleMissedMedicine(item.id)}
                >
                  <AlertCircle size={16} color={colors.error} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.takeButton, { backgroundColor: colors.success }]}
                  onPress={() => handleTakeMedicine(item.id)}
                >
                  <CheckCircle size={16} color={colors.surface} />
                  <Text style={[styles.takeButtonText, { color: colors.surface }]}>Take</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderMedicinesView = () => (
    <View style={styles.medicinesContainer}>
      {mockMedicines.map((medicine) => (
        <TouchableOpacity 
          key={medicine.id} 
          style={[
            styles.medicineCard, 
            { backgroundColor: colors.surface },
            colorScheme === 'light' ? Shadows.light : Shadows.dark
          ]}
        >
          <View style={styles.medicineHeader}>
            <View style={[styles.medicineIcon, { backgroundColor: colors.primary + '20' }]}>
              <Pill size={24} color={colors.primary} />
            </View>
            <View style={styles.medicineInfo}>
              <Text style={[styles.medicineName, { color: colors.text }]}>{medicine.name}</Text>
              <Text style={[styles.medicineDosage, { color: colors.textMuted }]}>{medicine.dosage}</Text>
            </View>
            <View style={styles.medicineStatus}>
              <Text style={[styles.frequencyText, { color: colors.primary }]}>{medicine.frequency}</Text>
            </View>
          </View>

          <View style={styles.medicineDetails}>
            <Text style={[styles.instructionsText, { color: colors.textMuted }]}>{medicine.instructions}</Text>
            <View style={styles.nextDoseContainer}>
              <Clock size={16} color={colors.primary} />
              <Text style={[styles.nextDoseText, { color: colors.primary }]}>Next: {medicine.nextDose}</Text>
            </View>
          </View>

          <View style={styles.doseTimes}>
            {medicine.times.map((time, index) => (
              <View
                key={index}
                style={[
                  styles.doseTime,
                  { backgroundColor: colors.background },
                  medicine.taken[index] && { backgroundColor: colors.success + '20' }
                ]}
              >
                <Text style={[
                  styles.doseTimeText,
                  { color: colors.textMuted },
                  medicine.taken[index] && { color: colors.success, fontFamily: 'Inter-SemiBold' }
                ]}>
                  {time}
                </Text>
                {medicine.taken[index] && (
                  <CheckCircle size={12} color={colors.success} style={{ marginLeft: 4 }} />
                )}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        style={[
          styles.addMedicineButton, 
          { backgroundColor: colors.primary },
          colorScheme === 'light' ? Shadows.light : {}
        ]}
        onPress={() => Alert.alert('Add Medicine', 'Medicine setup form would open here')}
      >
        <Plus size={20} color={colors.surface} />
        <Text style={[styles.addMedicineText, { color: colors.surface }]}>Add New Medicine</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      <View style={[
        styles.weeklyStats, 
        { backgroundColor: colors.surface },
        colorScheme === 'light' ? Shadows.light : Shadows.dark
      ]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>This Week</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>93%</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Compliance</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>26</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Doses Taken</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.error }]}>2</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Missed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>7</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Days</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
      <View style={styles.activityList}>
        {[
          { date: 'Today', compliance: 50, color: colors.warning },
          { date: 'Yesterday', compliance: 100, color: colors.success },
          { date: 'Jan 20', compliance: 75, color: colors.primary },
          { date: 'Jan 19', compliance: 100, color: colors.success },
          { date: 'Jan 18', compliance: 50, color: colors.warning },
        ].map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.activityItem, 
              { backgroundColor: colors.surface },
              colorScheme === 'light' ? Shadows.light : Shadows.dark
            ]}
          >
            <Text style={[styles.activityDate, { color: colors.text }]}>{day.date}</Text>
            <View style={[styles.complianceBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.complianceFill,
                  { width: `${day.compliance}%`, backgroundColor: day.color }
                ]}
              />
            </View>
            <Text style={[styles.complianceText, { color: colors.primary }]}>{day.compliance}%</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Medicine Tracker</Text>
        <TouchableOpacity 
          style={[
            styles.addButton, 
            { backgroundColor: colors.surface },
            colorScheme === 'light' ? Shadows.light : Shadows.dark
          ]}
          onPress={() => Alert.alert('Add Medicine', 'Medicine setup form would open here')}
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
        {activeTab === 0 && renderTodayView()}
        {activeTab === 1 && renderMedicinesView()}
        {activeTab === 2 && renderCalendarView()}
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
  todayContainer: {
    paddingBottom: Spacing.xxl,
  },
  progressCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  progressTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.lg,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressNumber: {
    ...Typography.title,
    fontSize: 24,
  },
  progressLabel: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  progressDivider: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.lg,
  },
  reminderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.lg,
  },
  sectionSubtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  scheduleTime: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    minWidth: 60,
  },
  timeText: {
    ...Typography.subtitle,
  },
  conditionIcon: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  scheduleInfo: {
    flex: 1,
  },
  medicineName: {
    ...Typography.subtitle,
  },
  medicineDosage: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  conditionText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  scheduleActions: {
    marginLeft: Spacing.lg,
  },
  takenIndicator: {
    alignItems: 'center',
  },
  takenText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  takeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    minHeight: 36,
  },
  takeButtonText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
    marginLeft: Spacing.xs,
  },
  medicinesContainer: {
    paddingBottom: Spacing.xxl,
  },
  medicineCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  medicineIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineStatus: {
    alignItems: 'flex-end',
  },
  frequencyText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
  },
  medicineDetails: {
    marginBottom: Spacing.lg,
  },
  instructionsText: {
    ...Typography.body,
    marginBottom: Spacing.sm,
  },
  nextDoseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextDoseText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
    marginLeft: Spacing.sm,
  },
  doseTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  doseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  doseTimeText: {
    ...Typography.caption,
  },
  addMedicineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
    minHeight: 56,
  },
  addMedicineText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
  calendarContainer: {
    paddingBottom: Spacing.xxl,
  },
  weeklyStats: {
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  statsTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statNumber: {
    ...Typography.title,
    fontSize: 24,
  },
  statLabel: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  activityList: {
    marginTop: Spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  activityDate: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    width: 80,
  },
  complianceBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  complianceFill: {
    height: '100%',
    borderRadius: 4,
  },
  complianceText: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    width: 40,
    textAlign: 'right',
  },
});