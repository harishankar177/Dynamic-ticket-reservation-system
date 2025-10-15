import React, { useState } from 'react';
import TrainList from './TrainList';
import LiveTrainStatus from './LiveTrainStatus';
import SeatSelection from './SeatSelection';

const BookingContainer = ({ searchData, onSelectTrain }) => {
  const [showLiveStatus, setShowLiveStatus] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  const handleShowLiveStatus = (train) => {
    setSelectedTrain(train);
    setShowLiveStatus(true);
  };

  const handleCloseLiveStatus = () => setShowLiveStatus(false);

  const handleSelectCoach = (coach) => {
    setSelectedCoach(coach);
    setShowLiveStatus(false);
    setShowSeatSelection(true);
  };

  const handleCloseSeatSelection = () => setShowSeatSelection(false);

  // This is the important part!
  const handleTrainSelect = (train, className) => {
    if (onSelectTrain) {
      onSelectTrain({ ...train, selectedClass: className });
    }
  };

  return (
    <div>
      <TrainList
        searchData={searchData}
        onShowLiveStatus={handleShowLiveStatus}    
        onSelectTrain={handleTrainSelect}
      />
 

      {showLiveStatus && selectedTrain && (
        <LiveTrainStatus
          train={selectedTrain}
          onClose={handleCloseLiveStatus}
          onSelectCoach={handleSelectCoach}
        />
      )}

      {showSeatSelection && selectedCoach && selectedTrain && (  
        <SeatSelection
          coach={selectedCoach}
          train={selectedTrain}
          requiredSeats={searchData.passengers}
          onClose={handleCloseSeatSelection}
          onConfirm={() => setShowSeatSelection(false)}
        />
      )}
    </div>
  );
};

export default BookingContainer;