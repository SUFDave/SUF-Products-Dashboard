import React, { useState, useEffect } from 'react';
import GroupCard from './GroupCard';

const OrganizerDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    // TODO: Fetch groups from Firebase
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    // TODO: Implement Firebase fetch logic
    console.log('Fetching groups...');
  };

  const handleScoreUpdate = async (groupId, playerId, score) => {
    // TODO: Implement score update logic
    console.log('Updating score:', groupId, playerId, score);
  };

  return (
    <div className="organizer-dashboard">
      <h2>Organizer Dashboard</h2>

      <div className="groups-container">
        {groups.length === 0 ? (
          <p>No groups available. Please contact an administrator.</p>
        ) : (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onScoreUpdate={handleScoreUpdate}
              isEditable={true}
            />
          ))
        )}
      </div>

      <div className="leaderboard-section">
        <h3>Overall Leaderboard</h3>
        <div className="leaderboard">
          {/* TODO: Display overall leaderboard */}
          <p>Leaderboard will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
