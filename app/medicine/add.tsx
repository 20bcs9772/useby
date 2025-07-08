import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { ArrowLeft, Clock, Calendar, Pill, Save, Plus, X } from 'lucide-react-native';
import { useThemeColors, useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, Typography, BorderRadius, Shadows } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AddMedicine() {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [reminderTimes, setReminderTimes] = useState(['09:00']);
  const [takenWith, setTakenWith] = useState('with_food'); // 'with_food' or 'empty_stomach'
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]); // All days selected by default
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDaily, setIsDaily] = useState(true);
  
  const colors = useThemeColors();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '12:00']);
  };

  const removeReminderTime = (index: number) => {
    if (reminderTimes.length > 1) {
      setReminderTimes(reminderTimes.filter((_, i) => i !== index));
    }
  };

  const updateReminderTime = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
  };

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  const handleSave = () => {
    if (!medicineName || !dosage || reminderTimes.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isDaily && selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    Alert.alert(
      'Medicine Added',
      `${medicineName} has been added to your medicine schedule`,
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Add Medicine</Text>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Save size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[
          styles.formSection, 
          { backgroundColor: colors.surface },
          colorScheme === 'light' ? Shadows.light : Shadows.dark
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Medicine Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Medicine Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter medicine name"
              placeholderTextColor={colors.textMuted}
              value={medicineName}
              onChangeText={setMedicineName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Dosage *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., 500mg, 1 tablet"
              placeholderTextColor={colors.textMuted}
              value={dosage}
              onChangeText={setDosage}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Taken with</Text>
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  takenWith === 'with_food' && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                ]}
                onPress={() => setTakenWith('with_food')}
              >
                <Text style={[
                  styles.optionText,
                  { color: takenWith === 'with_food' ? colors.primary : colors.text }
                ]}>
                  🍽️ With Food
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.option,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  takenWith === 'empty_stomach' && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                ]}
                onPress={() => setTakenWith('empty_stomach')}
              >
                <Text style={[
                  styles.optionText,
                  { color: takenWith === 'empty_stomach' ? colors.primary : colors.text }
                ]}>
                  ⏰ Empty Stomach
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[
          styles.formSection, 
          { backgroundColor: colors.surface },
          colorScheme === 'light' ? Shadows.light : Shadows.dark
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Reminder Schedule</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.text }]}>Reminder Times *</Text>
              <TouchableOpacity 
                style={[styles.addTimeButton, { backgroundColor: colors.primary + '20' }]}
                onPress={addReminderTime}
              >
                <Plus size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {reminderTimes.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <TouchableOpacity style={[styles.timeButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={[styles.timeButtonText, { color: colors.text }]}>{time}</Text>
                </TouchableOpacity>
                
                {reminderTimes.length > 1 && (
                  <TouchableOpacity 
                    style={[styles.removeTimeButton, { backgroundColor: colors.error + '20' }]}
                    onPress={() => removeReminderTime(index)}
                  >
                    <X size={16} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.toggleRow}>
              <Text style={[styles.label, { color: colors.text }]}>Daily Medication</Text>
              <Switch
                value={isDaily}
                onValueChange={setIsDaily}
                trackColor={{ false: colors.border, true: colors.primary + '40' }}
                thumbColor={isDaily ? colors.primary : colors.textMuted}
              />
            </View>
            
            {!isDaily && (
              <View style={styles.daysContainer}>
                <Text style={[styles.sublabel, { color: colors.textMuted }]}>Select days</Text>
                <View style={styles.daysRow}>
                  {daysOfWeek.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        { backgroundColor: colors.background, borderColor: colors.border },
                        selectedDays.includes(index) && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      ]}
                      onPress={() => toggleDay(index)}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        { color: selectedDays.includes(index) ? colors.primary : colors.text }
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={[
          styles.formSection, 
          { backgroundColor: colors.surface },
          colorScheme === 'light' ? Shadows.light : Shadows.dark
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Duration</Text>
          
          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: colors.text }]}>Start Date</Text>
              <TouchableOpacity style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateButtonText, { color: colors.textMuted }]}>
                  {startDate || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInput}>
              <Text style={[styles.label, { color: colors.text }]}>End Date (Optional)</Text>
              <TouchableOpacity style={[styles.dateButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateButtonText, { color: colors.textMuted }]}>
                  {endDate || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.saveMainButton, 
            { backgroundColor: colors.primary },
            colorScheme === 'light' ? Shadows.light : {}
          ]} 
          onPress={handleSave}
        >
          <Pill size={20} color={colors.surface} />
          <Text style={[styles.saveMainButtonText, { color: colors.surface }]}>
            Add Medicine
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.title,
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.lg,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
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
    fontFamily: 'Inter-SemiBold',
    marginBottom: Spacing.sm,
  },
  sublabel: {
    ...Typography.caption,
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
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  optionText: {
    ...Typography.body,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addTimeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    minHeight: 56,
  },
  timeButtonText: {
    ...Typography.body,
    marginLeft: Spacing.sm,
  },
  removeTimeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  daysContainer: {
    marginTop: Spacing.sm,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dayButtonText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  saveMainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xxl,
    minHeight: 56,
  },
  saveMainButtonText: {
    ...Typography.subtitle,
    marginLeft: Spacing.sm,
  },
});