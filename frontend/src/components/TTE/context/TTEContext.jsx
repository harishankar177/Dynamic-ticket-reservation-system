import React, { createContext, useContext, useState } from 'react';

const TTEContext = createContext();

export const useTTE = () => {
  const context = useContext(TTEContext);
  if (!context) {
    throw new Error('useTTE must be used within TTEProvider');
  }
  return context;
};

export const TTEProvider = ({ children }) => {
  const [currentDuty, setCurrentDuty] = useState({
    id: '1',
    tteId: 'tte-001',
    trainId: 'train-001',
    coachNumbers: ['S1', 'S2', 'S3'],
    dutyDate: new Date().toISOString().split('T')[0],
    status: 'active',
    train: {
      id: 'train-001',
      trainNumber: '12345',
      trainName: 'Rajdhani Express',
      totalCoaches: 12,
      route: 'New Delhi - Mumbai Central',
    },
  });

  const [ticketChecks, setTicketChecks] = useState([]);
  const [fines, setFines] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [assistances, setAssistances] = useState([]);
  const [seatAvailability, setSeatAvailability] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [journeyReport, setJourneyReport] = useState(null);

  const addTicketCheck = (check) => {
    const newCheck = {
      ...check,
      id: `tc-${Date.now()}`,
      checkedAt: new Date().toISOString(),
    };
    setTicketChecks((prev) => [...prev, newCheck]);
  };

  const addFine = (fine) => {
    const newFine = {
      ...fine,
      id: `f-${Date.now()}`,
      collectedAt: new Date().toISOString(),
    };
    setFines((prev) => [...prev, newFine]);
  };

  const updateFine = (id, updates) => {
    setFines((prev) =>
      prev.map((fine) => (fine.id === id ? { ...fine, ...updates } : fine))
    );
  };

  const addInspection = (inspection) => {
    const newInspection = {
      ...inspection,
      id: `ci-${Date.now()}`,
      inspectedAt: new Date().toISOString(),
    };
    setInspections((prev) => [...prev, newInspection]);
  };

  const addAssistance = (assistance) => {
    const newAssistance = {
      ...assistance,
      id: `pa-${Date.now()}`,
      assistedAt: new Date().toISOString(),
    };
    setAssistances((prev) => [...prev, newAssistance]);
  };

  const addSeatAvailability = (seat) => {
    const newSeat = {
      ...seat,
      id: `sa-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setSeatAvailability((prev) => [...prev, newSeat]);
  };

  const updateSeatAvailability = (id, updates) => {
    setSeatAvailability((prev) =>
      prev.map((seat) =>
        seat.id === id ? { ...seat, ...updates, updatedAt: new Date().toISOString() } : seat
      )
    );
  };

  const addIncident = (incident) => {
    const newIncident = {
      ...incident,
      id: `i-${Date.now()}`,
      occurredAt: new Date().toISOString(),
    };
    setIncidents((prev) => [...prev, newIncident]);
  };

  const updateIncident = (id, updates) => {
    setIncidents((prev) =>
      prev.map((incident) => (incident.id === id ? { ...incident, ...updates } : incident))
    );
  };

  return (
    <TTEContext.Provider
      value={{
        currentDuty,
        setCurrentDuty,
        ticketChecks,
        addTicketCheck,
        fines,
        addFine,
        updateFine,
        inspections,
        addInspection,
        assistances,
        addAssistance,
        seatAvailability,
        addSeatAvailability,
        updateSeatAvailability,
        incidents,
        addIncident,
        updateIncident,
        journeyReport,
        setJourneyReport,
      }}
    >
      {children}
    </TTEContext.Provider>
  );
};
