import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { Navbar } from '../src/components/landing/Navbar';
import { Hero } from '../src/components/landing/Hero';
import { Benefits } from '../src/components/landing/Benefits';
import { Services } from '../src/components/landing/Services';
import { Clinic } from '../src/components/landing/Clinic';
import { Specialists } from '../src/components/landing/Specialists';
import { AppointmentBanner } from '../src/components/landing/AppointmentBanner';
import { Footer } from '../src/components/landing/Footer';
import { QuickBookingModal } from '../src/components/landing/QuickBookingModal';

import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RootRedirect() {
  const router = useRouter();
  // Immediately redirect to login page
  useEffect(() => {
    router.replace('/(auth)/login');
  }, []);
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

