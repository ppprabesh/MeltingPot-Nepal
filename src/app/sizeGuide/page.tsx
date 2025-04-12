'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Baby, Terminal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Reusable SizeChart component
const SizeChart = ({ title, sizes, measurements }: { title: string, sizes: string[], measurements: { label: string, values: number[] }[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-green-800'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              {sizes.map((size: string) => (
                <TableHead key={size}>{size}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {measurements.map((measurement: { label: string, values: number[] }) => (
              <TableRow key={measurement.label}>
                <TableCell className="font-medium">{measurement.label}</TableCell>
                {measurement.values.map((value: number, index: number) => (
                  <TableCell key={index}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Reusable FormField component
const FormField = ({ label, value, onChange, options, placeholder }: { label: string, value: string, onChange: (value: string) => void, options: { value: string, label: string }[], placeholder: string }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <Select onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const SizeGuidePage = () => {
  const [weight, setWeight] = useState('');
  const [style, setStyle] = useState('');
  const [gender, setGender] = useState('');
  const [recommendedSize, setRecommendedSize] = useState('');

  // Weight ranges for sizes (example data - replace with actual ranges)
  const weightRanges = {
    men: {
      S: { min: 40, max: 50 },
      M: { min: 50, max: 60 },
      L: { min: 60, max: 70 },
      XL: { min: 70, max: 80 },
      '2XL': { min: 80, max: 90 },
      '3XL': { min: 90, max: 100 },
      '4Xl': { min: 100, max: 105 },
      '5XL': { min: 105, max: 110 },
    },
    women: {
      S: { min: 40, max: 50 },
      M: { min: 50, max: 55 },
      L: { min: 55, max: 60 },
      XL: { min: 60, max: 65 },
      '2XL': { min: 65, max: 70 },
      '3XL': { min: 70, max: 80 }
    }
  };

  const calculateSize = () => {
    if (!weight || !style || !gender) {
      alert('Please fill in all fields');
      return;
    }

    const weightNum = parseInt(weight);
    const ranges = weightRanges[gender as keyof typeof weightRanges];
    
    // Find the base size based on weight
    let baseSize = 'M';
    for (const [size, range] of Object.entries(ranges)) {
      if (weightNum >= range.min && weightNum <= range.max) {
        baseSize = size;
        break;
      }
    }

    // Adjust for fit preference
    if (style === 'loose') {
      // Go one size up if not already at maximum
      const sizes = Object.keys(ranges);
      const currentIndex = sizes.indexOf(baseSize);
      if (currentIndex < sizes.length - 1) {
        baseSize = sizes[currentIndex + 1];
      }
    }

    setRecommendedSize(baseSize);
  };

  // Data for size charts
  const menSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const womenSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  const menMeasurements = [
    { label: 'Length (cm)', values: [64, 67, 69, 72, 74, 76, 77] },
    { label: 'Chest (cm)', values: [43, 45, 49, 51, 54, 57, 59] },
    { label: 'Shoulder (cm)', values: [39, 41, 43, 45, 47, 50, 52] },
  ];

  const womenMeasurements = [
    { label: 'Length (cm)', values: [56, 59, 62, 65, 66, 68, 68] },
    { label: 'Chest (cm)', values: [38, 40, 42, 44, 46, 49, 50] },
    { label: 'Shoulder (cm)', values: [31, 33, 35, 37, 39, 41, 43] },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      {/* Notice Board Banner */}
         {/* Notice Board Banner */}
<div className="max-w-7xl mx-auto px-4">
  <Alert className='bg-green-700'>
    <AlertTitle className='text-2xl font-bold'>Size Alert</AlertTitle>
    <AlertDescription className='text-xl'>
      Our sizes are Nepali sizes, so they are smaller than foreign sizes. But remember, "Size is just a number" 😊
    </AlertDescription>

    <AlertTitle className='text-2xl mt-4 font-bold'>Kids Size Alert</AlertTitle>
    <AlertDescription className='text-xl'>
      The kids' sizes go from 2-4-6-8-10-12, each size representing their age.
    </AlertDescription>
  </Alert>
</div>




      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Size Guide</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Size Charts */}
          <div className="space-y-8">
            <SizeChart 
            
              title="Men's Size Chart (Style MJJ 35)"
              sizes={menSizes}
              measurements={menMeasurements}
            />
            <SizeChart
              title="Women's Size Chart (Style LJJ 33)"
              sizes={womenSizes}
              measurements={womenMeasurements}
            />
          </div>

          {/* Size Calculator */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className='text-green-800'>Size Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  label="Gender"
                  value={gender}
                  onChange={setGender}
                  options={[
                    { value: 'men', label: 'Men' },
                    { value: 'women', label: 'Women' },
                  ]}
                  placeholder="Select gender"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <FormField
                  label="Preferred Fit"
                  value={style}
                  onChange={setStyle}
                  options={[
                    { value: 'regular', label: 'Regular Fit' },
                    { value: 'loose', label: 'Loose Fit' },
                  ]}
                  placeholder="Select fit style"
                />

                <Button 
                  onClick={calculateSize}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Calculate Size
                </Button>

                {recommendedSize && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-center text-lg font-medium">
                      Recommended Size: <span className="text-green-600">{recommendedSize}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;