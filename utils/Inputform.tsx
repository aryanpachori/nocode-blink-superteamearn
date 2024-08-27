
"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Inputform() {
  const [weeks, setWeeks] = useState("3");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg">
        <div className="p-8">
          <form className="space-y-6">
            <div>
              <Label htmlFor="projectTitle" className="text-lg font-medium">Project Title</Label>
              <Input id="projectTitle" placeholder="Enter project title" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="description" className="text-lg font-medium">Scope/Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the project objectives and key tasks"
                className="mt-1 min-h-[150px]"
              />
            </div>

            <div>
              <Label htmlFor="timeline" className="text-lg font-medium">Timeline (in weeks)</Label>
              <Select value={weeks} onValueChange={setWeeks}>
                <SelectTrigger id="timeline" className="mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 week</SelectItem>
                  <SelectItem value="2">2 weeks</SelectItem>
                  <SelectItem value="3">3 weeks</SelectItem>
                  <SelectItem value="4">4 weeks</SelectItem>
                  <SelectItem value="5">5 weeks</SelectItem>
                  <SelectItem value="6">6 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment" className="text-lg font-medium">Payment/Compensation</Label>
              <Input id="payment" placeholder="Enter payment amount and currency" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="skills" className="text-lg font-medium">Skills/Requirements</Label>
              <Textarea
                id="skills"
                placeholder="List specific skills or qualifications needed"
                className="mt-1 min-h-[150px]"
              />
            </div>

            <div className="pt-4">
              <Button className="w-full text-lg py-3">Create Project Posting</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
