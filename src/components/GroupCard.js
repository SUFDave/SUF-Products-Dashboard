import React, { useState } from 'react';

const GroupCard = ({ group, onScoreUpdate, isEditable }) => {
  const [scores, setScores] = useState(group.players || []);

  const handleScoreChange = (playerId, newScore) => {
    const updatedScores = scores.map((player) =>
      player.id === playerId ? { ...player, score: newScore } : player
    );
    setScores(updatedScores);
    if (onScoreUpdate) {
      onScoreUpdate(group.id, playerId, newScore);
    }
  };

  return (
    <div className="group-card">
      <h3>{group.name}</h3>
      <div className="players-list">
        {scores.map((player) => (
          <div key={player.id} className="player-row">
            <span className="player-name">{player.name}</span>
            {isEditable ? (
              <input
                type="number"
                value={player.score || 0}
                onChange={(e) => handleScoreChange(player.id, parseInt(e.target.value))}
                className="score-input"
              />
            ) : (
              <span className="player-score">{player.score || 0}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupCard;
