'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ruler, Scale, User, Shirt, ArrowLeftRight } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from 'react-hot-toast';

// Reusable SizeChart component
const SizeChart = ({ title, sizes, measurements }: { title: string, sizes: string[], measurements: { label: string, values: number[] }[] }) => {
  return (
    <Card className="border-2 border-green-100 shadow-lg">
      <CardHeader className="bg-green-50 rounded-t-lg">
        <CardTitle className='text-green-800 text-xl font-bold'>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50">
              <TableHead className="font-bold text-green-800">Measurement</TableHead>
              {sizes.map((size: string) => (
                <TableHead key={size} className="font-bold text-green-800">{size}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {measurements.map((measurement: { label: string, values: number[] }) => (
              <TableRow key={measurement.label} className="hover:bg-green-50">
                <TableCell className="font-medium text-gray-700">{measurement.label}</TableCell>
                {measurement.values.map((value: number, index: number) => (
                  <TableCell key={index} className="text-gray-600">{value}</TableCell>
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
const FormField = ({ label, value, onChange, options, placeholder, icon: Icon }: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void, 
  options: { value: string, label: string }[], 
  placeholder: string,
  icon?: React.ElementType 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger className={`${Icon ? 'pl-10' : ''} w-full`}>
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
    </div>
  );
};

const SizeGuidePage = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [style, setStyle] = useState('');
  const [gender, setGender] = useState('');
  const [recommendedSize, setRecommendedSize] = useState('');
  const [useMetric, setUseMetric] = useState(true);

  // Size calculation data
  const sizeRanges = {
    men: {
      S: { minWeight: 40, maxWeight: 50, minHeight: 150, maxHeight: 165 },
      M: { minWeight: 50, maxWeight: 60, minHeight: 165, maxHeight: 175 },
      L: { minWeight: 60, maxWeight: 70, minHeight: 175, maxHeight: 185 },
      XL: { minWeight: 70, maxWeight: 80, minHeight: 180, maxHeight: 190 },
      '2XL': { minWeight: 80, maxWeight: 90, minHeight: 185, maxHeight: 195 },
      '3XL': { minWeight: 90, maxWeight: 100, minHeight: 190, maxHeight: 200 },
    },
    women: {
      S: { minWeight: 40, maxWeight: 50, minHeight: 150, maxHeight: 160 },
      M: { minWeight: 50, maxWeight: 55, minHeight: 160, maxHeight: 170 },
      L: { minWeight: 55, maxWeight: 60, minHeight: 165, maxHeight: 175 },
      XL: { minWeight: 60, maxWeight: 65, minHeight: 170, maxHeight: 180 },
      '2XL': { minWeight: 65, maxWeight: 70, minHeight: 175, maxHeight: 185 },
      '3XL': { minWeight: 70, maxWeight: 80, minHeight: 180, maxHeight: 190 },
    }
  };

  // Function to convert feet and inches to centimeters
  const convertToCm = (feet: string, inches: string) => {
    const feetNum = parseFloat(feet) || 0;
    const inchesNum = parseFloat(inches) || 0;
    return Math.round((feetNum * 30.48) + (inchesNum * 2.54));
  };

  // Function to convert centimeters to feet and inches
  const convertToFeetInches = (cm: string) => {
    const cmNum = parseFloat(cm) || 0;
    const totalInches = cmNum / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const validateInputs = () => {
    if (!weight) {
      toast.error('Please enter your weight', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return false;
    }

    if (!gender) {
      toast.error('Please select your gender', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return false;
    }

    if (!style) {
      toast.error('Please select your preferred fit', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return false;
    }

    if (useMetric && !height) {
      toast.error('Please enter your height in centimeters', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return false;
    }

    if (!useMetric && (!heightFeet || !heightInches)) {
      toast.error('Please enter your height in feet and inches', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return false;
    }

    if (!useMetric && (parseFloat(heightInches) >= 12)) {
      toast.error('Inches must be less than 12', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return false;
    }

    return true;
  };

  const calculateSize = () => {
    if (!validateInputs()) {
      return;
    }

    let heightInCm;
    if (useMetric) {
      heightInCm = parseInt(height);
    } else {
      heightInCm = convertToCm(heightFeet, heightInches);
    }

    const weightNum = parseInt(weight);
    const ranges = sizeRanges[gender as keyof typeof sizeRanges];
    
    let baseSize = 'M';
    let minDiff = Infinity;

    for (const [size, range] of Object.entries(ranges)) {
      const weightDiff = Math.abs(weightNum - (range.minWeight + range.maxWeight) / 2);
      const heightDiff = Math.abs(heightInCm - (range.minHeight + range.maxHeight) / 2);
      const totalDiff = weightDiff + heightDiff;

      if (totalDiff < minDiff) {
        minDiff = totalDiff;
        baseSize = size;
      }
    }

    if (style === 'loose') {
      const sizes = Object.keys(ranges);
      const currentIndex = sizes.indexOf(baseSize);
      if (currentIndex < sizes.length - 1) {
        baseSize = sizes[currentIndex + 1];
      }
    }

    setRecommendedSize(baseSize);
    toast.success(`Recommended size: ${baseSize}`, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#f0fdf4',
        color: '#16a34a',
        border: '1px solid #bbf7d0',
      },
    });
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Size Guide</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide. Our sizing follows Nepali standards, ensuring the best fit for our customers.
          </p>
        </div>

        {/* Information Alerts */}
        <div className="space-y-6 mb-12">
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-xl font-semibold text-green-800 flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Size Information
            </AlertTitle>
            <AlertDescription className="text-gray-700 mt-2">
              Our sizing follows Nepali standards, which may differ from international sizing. For the most accurate fit, please use our size calculator below.
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-xl font-semibold text-blue-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              Children's Sizing
            </AlertTitle>
            <AlertDescription className="text-gray-700 mt-2">
              Children's sizes correspond to age ranges: 2-4-6-8-10-12 years. Each size is designed to accommodate the average measurements for that age group.
            </AlertDescription>
          </Alert>
        </div>

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
            <Card className="border-2 border-green-100 shadow-lg">
              <CardHeader className="bg-green-50 rounded-t-lg">
                <CardTitle className='text-green-800 text-xl font-bold flex items-center gap-2'>
                  <Shirt className="h-5 w-5" />
                  Size Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="Gender"
                  value={gender}
                  onChange={setGender}
                  options={[
                    { value: 'men', label: 'Men' },
                    { value: 'women', label: 'Women' },
                  ]}
                  placeholder="Select gender"
                  icon={User}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Scale className="h-5 w-5" />
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter your weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Height</label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="unit-switch" className="text-sm text-gray-600">
                        {useMetric ? 'cm' : 'ft/in'}
                      </Label>
                      <Switch
                        id="unit-switch"
                        checked={useMetric}
                        onCheckedChange={setUseMetric}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>

                  {useMetric ? (
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Ruler className="h-5 w-5" />
                      </div>
                      <Input
                        type="number"
                        placeholder="Enter your height in cm"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Ruler className="h-5 w-5" />
                        </div>
                        <Input
                          type="number"
                          placeholder="Feet"
                          value={heightFeet}
                          onChange={(e) => setHeightFeet(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Ruler className="h-5 w-5" />
                        </div>
                        <Input
                          type="number"
                          placeholder="Inches"
                          value={heightInches}
                          onChange={(e) => setHeightInches(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
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
                  icon={Shirt}
                />

                <Button 
                  onClick={calculateSize}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
                >
                  Calculate Size
                </Button>

                {recommendedSize && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-center text-lg font-medium text-green-800">
                      Recommended Size: <span className="text-green-600 font-bold">{recommendedSize}</span>
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