
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
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  
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
    const fetchAsset = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedAsset = await assetService.getAssetById(id);
        
        if (!fetchedAsset) {
          toast({
            variant: "destructive",
            title: "Asset not found",
            description: "The requested asset could not be found.",
          });
          navigate("/assets");
          return;
        }
        
        setAsset(fetchedAsset);
        
        // Populate form fields
        setName(fetchedAsset.name);
        setType(fetchedAsset.type);
        setStatus(fetchedAsset.status);
        setPurchaseDate(fetchedAsset.purchaseDate);
        setPurchaseCost(fetchedAsset.purchaseCost.toString());
        setLocation(fetchedAsset.location);
        setDescription(fetchedAsset.description || "");
        setSerialNumber(fetchedAsset.serialNumber || "");
        setWarrantyExpiryDate(fetchedAsset.warrantyExpiryDate || "");
        setLastMaintenanceDate(fetchedAsset.lastMaintenanceDate || "");
        setNextMaintenanceDate(fetchedAsset.nextMaintenanceDate || "");
        
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
    
    fetchAsset();
  }, [id, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!id || !asset) return;
    
    if (!name || !type || !purchaseDate || !purchaseCost || !location) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const updatedAsset: Partial<Asset> = {
        name,
        type,
        status,
        purchaseDate,
        purchaseCost: parseFloat(purchaseCost),
        location,
        description: description || undefined,
        serialNumber: serialNumber || undefined,
        warrantyExpiryDate: warrantyExpiryDate || undefined,
        lastMaintenanceDate: lastMaintenanceDate || undefined,
        nextMaintenanceDate: nextMaintenanceDate || undefined,
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
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/assets/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading asset details...</p>
        </div>
      </div>
    );
  }
  
  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Asset Not Found</h2>
        <p className="text-muted-foreground">The asset you're trying to edit doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/assets">Back to Assets</a>
        </Button>
      </div>
    );
  }

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
          <CardDescription>Update the details of this asset</CardDescription>
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
                    {!assetTypes.includes(type) && (
                      <SelectItem value={type}>{type}</SelectItem>
                    )}
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
              
              <div className="space-y-2">
                <Label htmlFor="lastMaintenanceDate">
                  Last Maintenance Date
                </Label>
                <Input
                  id="lastMaintenanceDate"
                  type="date"
                  value={lastMaintenanceDate}
                  onChange={(e) => setLastMaintenanceDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextMaintenanceDate">
                  Next Maintenance Date
                </Label>
                <Input
                  id="nextMaintenanceDate"
                  type="date"
                  value={nextMaintenanceDate}
                  onChange={(e) => setNextMaintenanceDate(e.target.value)}
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
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAsset;
