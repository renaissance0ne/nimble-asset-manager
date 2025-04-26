
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Asset } from "@/types";
import { assetService } from "@/services/assetService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const AddAsset = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<Asset["status"]>("available");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // Common asset types for selection
  const assetTypes = [
    "Laptop",
    "Desktop Computer",
    "Monitor",
    "Mobile Device",
    "Printer",
    "Server",
    "Networking Equipment",
    "Software License",
    "Furniture",
    "Office Equipment",
    "Peripherals",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name || !type || !purchaseDate || !purchaseCost || !location) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const newAsset: Omit<Asset, 'id' | 'createdAt'> = {
        name,
        type,
        status,
        purchaseDate,
        purchaseCost: parseFloat(purchaseCost),
        location,
        description: description || undefined,
        serialNumber: serialNumber || undefined,
        warrantyExpiryDate: warrantyExpiryDate || undefined,
      };
      
      const createdAsset = await assetService.addAsset(newAsset);
      
      toast({
        title: "Asset created",
        description: "The asset has been successfully added.",
      });
      
      navigate(`/assets/${createdAsset.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating asset",
        description: "Failed to create the asset. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate("/assets");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/assets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Asset</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Asset Information</CardTitle>
          <CardDescription>Enter the details of the new asset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" required>
                  Asset Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter asset name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" required>
                  Asset Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((assetType) => (
                      <SelectItem key={assetType} value={assetType}>
                        {assetType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" required>
                  Status
                </Label>
                <Select 
                  value={status} 
                  onValueChange={(value: Asset["status"]) => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in-use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serialNumber">
                  Serial Number
                </Label>
                <Input
                  id="serialNumber"
                  placeholder="Enter serial number"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseDate" required>
                  Purchase Date
                </Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseCost" required>
                  Purchase Cost
                </Label>
                <Input
                  id="purchaseCost"
                  type="number"
                  placeholder="Enter cost"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" required>
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Where is this asset located?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warrantyExpiryDate">
                  Warranty Expiry Date
                </Label>
                <Input
                  id="warrantyExpiryDate"
                  type="date"
                  value={warrantyExpiryDate}
                  onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description of the asset"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Asset"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAsset;
