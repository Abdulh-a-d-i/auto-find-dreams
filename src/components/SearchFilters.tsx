import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SearchFilters = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const makes = ["Toyota", "Honda", "BMW", "Mercedes", "Audi", "Lexus", "Nissan", "Ford"];
  const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Truck", "Van"];
  const transmissions = ["Automatic", "Manual", "CVT"];

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="bg-white shadow-card rounded-xl border border-border">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Search Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex flex-wrap gap-2 mb-2">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Form */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Make */}
            <div>
              <label className="block text-sm font-medium mb-2">Make</label>
              <Select onValueChange={(value) => addFilter(`Make: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((make) => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Body Type</label>
              <Select onValueChange={(value) => addFilter(`Body: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <div className="flex gap-2">
                <Input placeholder="From" type="number" min="1990" max="2024" />
                <Input placeholder="To" type="number" min="1990" max="2024" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price (CAD)</label>
              <div className="flex gap-2">
                <Input placeholder="Min" type="number" />
                <Input placeholder="Max" type="number" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium mb-2">Transmission</label>
              <Select onValueChange={(value) => addFilter(`Trans: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissions.map((trans) => (
                    <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium mb-2">Max Mileage (km)</label>
              <Input placeholder="e.g. 100000" type="number" />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button variant="premium" className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;