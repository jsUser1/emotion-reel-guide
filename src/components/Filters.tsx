import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type FiltersState = {
  genre: string | null;
  yearGte?: number | null;
  yearLte?: number | null;
  language: string | null;
  runtimeRange: [number, number];
  minRating: number;
  platforms: string[];
};

interface FiltersProps {
  allGenres: string[];
  allLanguages: string[];
  allPlatforms: string[];
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  onReset?: () => void;
  className?: string;
}

export function Filters({ allGenres, allLanguages, allPlatforms, value, onChange, onReset, className }: FiltersProps) {
  const yearMin = 1900;
  const yearMax = new Date().getFullYear();
  const runtimeMin = 0;
  const runtimeMax = 240;

  const platformSet = useMemo(() => new Set(value.platforms), [value.platforms]);

  return (
    <section className={cn("mt-8 rounded-xl border border-border/30 bg-card-gradient p-4", className)} aria-label="Advanced filters">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filter movies</h3>
        <Button variant="ghost" size="sm" onClick={() => onReset?.()}>Clear all</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Genre */}
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={value.genre ?? undefined}
            onValueChange={(v) => onChange({ ...value, genre: v || null })}
          >
            <SelectTrigger id="genre" aria-label="Select genre">
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {allGenres.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div>
          <Label htmlFor="language">Language</Label>
          <Select
            value={value.language ?? undefined}
            onValueChange={(v) => onChange({ ...value, language: v || null })}
          >
            <SelectTrigger id="language" aria-label="Select language">
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {allLanguages.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="year-from">Year from</Label>
            <Input
              id="year-from"
              type="number"
              min={yearMin}
              max={yearMax}
              value={value.yearGte ?? ""}
              placeholder="Min"
              onChange={(e) => onChange({ ...value, yearGte: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
          <div>
            <Label htmlFor="year-to">Year to</Label>
            <Input
              id="year-to"
              type="number"
              min={yearMin}
              max={yearMax}
              value={value.yearLte ?? ""}
              placeholder="Max"
              onChange={(e) => onChange({ ...value, yearLte: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
        </div>

        {/* Runtime */}
        <div>
          <Label>Runtime (min)</Label>
          <div className="pt-3">
            <Slider
              value={[value.runtimeRange[0], value.runtimeRange[1]]}
              min={runtimeMin}
              max={runtimeMax}
              step={5}
              onValueChange={(vals) => onChange({ ...value, runtimeRange: [vals[0], vals[1]] as [number, number] })}
            />
            <div className="mt-2 text-sm text-muted-foreground">{value.runtimeRange[0]} — {value.runtimeRange[1]} min</div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label>IMDb rating</Label>
          <div className="pt-3">
            <Slider
              value={[value.minRating]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={(vals) => onChange({ ...value, minRating: Number(vals[0].toFixed(1)) })}
            />
            <div className="mt-2 text-sm text-muted-foreground">{value.minRating.toFixed(1)}+</div>
          </div>
        </div>

        {/* Platforms */}
        <div>
          <Label>Streaming platforms</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {allPlatforms.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={platformSet.has(p)}
                  onCheckedChange={(checked) => {
                    const next = new Set(value.platforms);
                    if (checked) next.add(p); else next.delete(p);
                    onChange({ ...value, platforms: Array.from(next) });
                  }}
                />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
