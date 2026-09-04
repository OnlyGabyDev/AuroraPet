import React, { useState } from 'react';
import { Navbar } from '../src/components/landing/Navbar';
import { Hero } from '../src/components/landing/Hero';
import { Benefits } from '../src/components/landing/Benefits';
import { Services } from '../src/components/landing/Services';
import { Clinic } from '../src/components/landing/Clinic';
import { Specialists } from '../src/components/landing/Specialists';
import { AppointmentBanner } from '../src/components/landing/AppointmentBanner';
import { Footer } from '../src/components/landing/Footer';
import { QuickBookingModal } from '../src/components/landing/QuickBookingModal';

export default function LandingPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* NAVBAR FIXA */}
      <Navbar onOpenBooking={() => setIsBookingModalOpen(true)} />

      {/* CONTEÚDO DA LANDING PAGE */}
      <main>
        <Hero onOpenBooking={() => setIsBookingModalOpen(true)} />
        <Benefits />
        <Services />
        <Clinic />
        <Specialists onOpenBooking={() => setIsBookingModalOpen(true)} />
        <AppointmentBanner onOpenBooking={() => setIsBookingModalOpen(true)} />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* MODAL DE AGENDAMENTO INTERATIVO */}
      <QuickBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
