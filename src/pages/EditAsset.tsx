import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditAsset = () => {
  const { id } = useParams<{ id: string }>();
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
  
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchAssetData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const assetData = await assetService.getAssetById(id);
        
        if (!assetData) {
          toast({
            variant: "destructive",
            title: "Asset not found",
            description: "The requested asset could not be found.",
          });
          navigate("/assets");
          return;
        }
        
        setName(assetData.name);
        setType(assetData.type);
        setStatus(assetData.status);
        setPurchaseDate(assetData.purchaseDate);
        setPurchaseCost(assetData.purchaseCost.toString());
        setLocation(assetData.location);
        setDescription(assetData.description || "");
        setSerialNumber(assetData.serialNumber || "");
        setWarrantyExpiryDate(assetData.warrantyExpiryDate || "");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading asset",
          description: "Failed to load asset details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssetData();
  }, [id, navigate, toast]);

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
      
      const updatedAsset: Omit<Asset, 'id' | 'createdAt'> = {
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
      
      await assetService.updateAsset(id, updatedAsset);
      
      toast({
        title: "Asset updated",
        description: "The asset has been successfully updated.",
      });
      
      navigate(`/assets/${id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating asset",
        description: "Failed to update the asset. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/assets/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate(`/assets/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Asset</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Asset Information</CardTitle>
          <CardDescription>Edit the details of the asset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Asset Name <span className="text-red-500">*</span>
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
                <Label htmlFor="type">
                  Asset Type <span className="text-red-500">*</span>
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
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
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
                <Label htmlFor="purchaseDate">
                  Purchase Date <span className="text-red-500">*</span>
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
                <Label htmlFor="purchaseCost">
                  Purchase Cost <span className="text-red-500">*</span>
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
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
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
                {isLoading ? "Updating..." : "Update Asset"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAsset;
