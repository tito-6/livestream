import React, { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollWidgetProps {
  streamId: string;
  lang: 'ar' | 'en';
}

const PollWidget: React.FC<PollWidgetProps> = ({ streamId, lang }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const translations = {
    ar: {
      poll: 'التصويت',
      question: 'من سيفوز في المباراة النهائية؟',
      vote: 'صوّت',
      votes: 'صوت',
      totalVotes: 'إجمالي الأصوات',
    },
    en: {
      poll: 'Poll',
      question: 'Who will win the final match?',
      vote: 'Vote',
      votes: 'votes',
      totalVotes: 'Total Votes',
    }
  };

  const t = translations[lang];

  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: 'Team Alpha', votes: 4521 },
    { id: '2', text: 'Team Beta', votes: 3892 },
    { id: '3', text: 'Team Gamma', votes: 2156 },
  ]);

  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (!selectedOption) return;

    setPollOptions(prev =>
      prev.map(option =>
        option.id === selectedOption
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    );
    setHasVoted(true);
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0';
  };

  return (
    <div className="glass-panel p-6 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-4">{t.poll}</h3>
      
      <p className="text-white/80 mb-4">{t.question}</p>

      <div className="space-y-3 mb-4">
        {pollOptions.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              onClick={() => !hasVoted && setSelectedOption(option.id)}
              disabled={hasVoted}
              className={`w-full text-left relative overflow-hidden rounded-lg border-2 transition-all
                        ${isSelected && !hasVoted
                          ? 'border-emerald-energy bg-emerald-energy/10'
                          : 'border-white/10 hover:border-emerald-energy/50'
                        }
                        ${hasVoted ? 'cursor-default' : 'cursor-pointer'}
                      `}
            >
              {/* Progress Bar */}
              {hasVoted && (
                <div
                  className="absolute inset-0 bg-gradient-oasis opacity-20 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Content */}
              <div className="relative px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSelected && !hasVoted && (
                    <FiCheckCircle className="text-emerald-energy" />
                  )}
                  <span className="font-semibold text-white">{option.text}</span>
                </div>

                {hasVoted && (
                  <div className="text-sm">
                    <span className="font-bold text-emerald-energy">{percentage}%</span>
                    <span className="text-white/60 ml-2">({option.votes.toLocaleString()})</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!hasVoted ? (
        <button
          onClick={handleVote}
          disabled={!selectedOption}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.vote}
        </button>
      ) : (
        <div className="text-center text-sm text-white/60">
          {t.totalVotes}: {totalVotes.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default PollWidget;

