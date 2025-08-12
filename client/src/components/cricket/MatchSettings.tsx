import React, { useState } from 'react';
import { useCricket } from "../../lib/stores/useCricket.tsx";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

export function MatchSettings() {
  const { setMatchFormat, proceedToToss } = useCricket();
  const [selectedOvers, setSelectedOvers] = useState<2 | 5 | 10 | 20>(5);

  const overOptions = [
    { value: 2, label: '2 Overs', description: 'Quick match' },
    { value: 5, label: '5 Overs', description: 'Short format' },
    { value: 10, label: '10 Overs', description: 'Medium format' },
    { value: 20, label: '20 Overs', description: 'T20 format' }
  ] as const;

  const handleProceed = () => {
    setMatchFormat({
      overs: selectedOvers,
      wickets: 4 // Fixed as per requirement
    });
    proceedToToss();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Match Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-lg font-semibold">Select Overs</Label>
            <p className="text-sm text-gray-600 mt-1">Each team will have 4 wickets</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {overOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedOvers === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOvers(option.value)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {option.value}
                  </div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Match Rules:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Each team has 5 batting players</li>
              <li>• Match ends when 4 wickets fall</li>
              <li>• Page flipping scoring system</li>
              <li>• Only even page numbers count</li>
              <li>• Last digit 0 = wicket, 1-7 = runs</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleProceed} size="lg">
              Proceed to Toss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
