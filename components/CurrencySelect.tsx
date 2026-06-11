import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CurrencySelectProps {
  currencies: string[];
  value: string;
  onValueChange: (value: string) => void;
}

export function CurrencySelect({
  currencies,
  value,
  onValueChange,
}: CurrencySelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          <img
            src={`https://flagcdn.com/w40/${value
              .toLowerCase()
              .slice(0, 2)}.png`}
            alt={`${value} flag`}
            className="w-6 h-4 mr-2"
          />
          {value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            {currencies.length > 0 ? (
              currencies.map((currency) => (
                <CommandItem
                  key={currency}
                  onSelect={() => {
                    onValueChange(currency);
                    setOpen(false);
                  }}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === currency ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <img
                    src={`https://flagcdn.com/w40/${currency
                      .toLowerCase()
                      .slice(0, 2)}.png`}
                    alt={`${currency} flag`}
                    className="w-6 h-4 mr-2"
                  />
                  {currency}
                </CommandItem>
              ))
            ) : (
              <CommandItem>No currencies available</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
