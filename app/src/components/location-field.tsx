import { Input } from "@/components/ui/input";
import { describeLocation, findLocation } from "@/components/route-map-data";

export function LocationField({
  id,
  label,
  placeholder,
  value,
  suggestions,
  open,
  onFocus,
  onChange,
  onSelect,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  suggestions: string[];
  open: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  const unknown = !open && value.trim().length > 0 && !findLocation(value);
  return (
    <div data-location-autocomplete className="relative grid content-start gap-2">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        aria-describedby={unknown ? `${id}-hint` : undefined}
      />
      {unknown && (
        <p id={`${id}-hint`} className="text-xs text-brand-deep">
          Not a known location, so it can’t be placed on the route map. Pick a suggestion.
        </p>
      )}
      {open && suggestions.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-popover p-1 text-popover-foreground shadow-menu ring-1 ring-foreground/5">
          <p className="px-3 py-2 text-xs text-muted-foreground">Suggested locations</p>
          {suggestions.map((suggestion) => {
            const description = describeLocation(suggestion);
            return (
              <button
                key={suggestion}
                type="button"
                className="flex w-full flex-col rounded-xl px-3 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(suggestion)}
              >
                <span className="truncate">{suggestion}</span>
                {description && <span className="text-xs text-muted-foreground">{description}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
