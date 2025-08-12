import { Mood } from "@/types/movie";
import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  moods: Mood[];
  selectedMood: string | null;
  onMoodSelect: (moodId: string) => void;
}

export const MoodSelector = ({ moods, selectedMood, onMoodSelect }: MoodSelectorProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">How are you feeling?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            variant={selectedMood === mood.id ? "default" : "secondary"}
            onClick={() => onMoodSelect(mood.id)}
            className="flex flex-col items-center gap-2 h-auto py-4 px-3 transition-all duration-300 hover:scale-105 hover:shadow-glow group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
              {mood.emoji}
            </span>
            <span className="text-sm font-medium">{mood.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};