import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { assetService } from "@/services/assetService";
import { Asset, MaintenanceRecord, AssetCheckout, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Wrench,
  AlertCircle,
  CheckCircle,
  UserCheck,
  UserX
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [checkoutHistory, setCheckoutHistory] = useState<AssetCheckout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isCheckinDialogOpen, setIsCheckinDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  
  const [maintenanceType, setMaintenanceType] = useState<"preventive" | "corrective" | "predictive">("preventive");
  const [maintenanceDate, setMaintenanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [maintenanceBy, setMaintenanceBy] = useState("");
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [maintenanceDescription, setMaintenanceDescription] = useState("");
  const [maintenanceNotes, setMaintenanceNotes] = useState("");
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [checkoutDate, setCheckoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [checkoutNotes, setCheckoutNotes] = useState("");

  useEffect(() => {
    const fetchAssetData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const [assetData, maintenance, checkouts, usersList] = await Promise.all([
          assetService.getAssetById(id),
          assetService.getMaintenanceRecords(id),
          assetService.getAssetCheckouts(id),
          assetService.getUsers()
        ]);
        
        if (!assetData) {
          toast({
            variant: "destructive",
            title: "Asset not found",
            description: "The requested asset could not be found.",
          });
          navigate("/assets");
          return;
        }
        
        setAsset(assetData);
        setMaintenanceRecords(maintenance);
        setCheckoutHistory(checkouts);
        setUsers(usersList);
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
  
  const handleDeleteAsset = async () => {
    if (!id) return;
    
    try {
      await assetService.deleteAsset(id);
      
      toast({
        title: "Asset deleted",
        description: "Asset has been successfully removed.",
      });
      
      navigate("/assets");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting asset",
        description: "Failed to delete the asset. Please try again.",
      });
    }
  };
  
  const handleAddMaintenance = async () => {
    if (!id || !asset) return;
    
    try {
      const newRecord = await assetService.addMaintenanceRecord({
        assetId: id,
        maintenanceType,
        maintenanceDate,
        performedBy: maintenanceBy,
        cost: parseFloat(maintenanceCost),
        description: maintenanceDescription,
        notes: maintenanceNotes,
      });
      
      setMaintenanceRecords([newRecord, ...maintenanceRecords]);
      
      const updatedAsset = await assetService.getAssetById(id);
      if (updatedAsset) {
        setAsset(updatedAsset);
      }
      
      toast({
        title: "Maintenance record added",
        description: "The maintenance record has been successfully added.",
      });
      
      setIsMaintenanceDialogOpen(false);
      resetMaintenanceForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding maintenance record",
        description: "Failed to add maintenance record. Please try again.",
      });
    }
  };
  
  const handleCheckout = async () => {
    if (!id || !asset) return;
    
    try {
      const checkoutData = await assetService.checkoutAsset({
        assetId: id,
        userId: selectedUserId,
        checkoutDate,
        expectedReturnDate: expectedReturnDate || undefined,
        notes: checkoutNotes,
      });
      
      setCheckoutHistory([checkoutData, ...checkoutHistory]);
      
      const updatedAsset = await assetService.getAssetById(id);
      if (updatedAsset) {
        setAsset(updatedAsset);
      }
      
      toast({
        title: "Asset checked out",
        description: "The asset has been successfully assigned.",
      });
      
      setIsCheckoutDialogOpen(false);
      resetCheckoutForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking out asset",
        description: "Failed to check out the asset. Please try again.",
      });
    }
  };
  
  const handleCheckin = async () => {
    if (!id || !asset) return;
    
    try {
      await assetService.checkinAsset(id);
      
      const [updatedAsset, updatedCheckouts] = await Promise.all([
        assetService.getAssetById(id),
        assetService.getAssetCheckouts(id)
      ]);
      
      if (updatedAsset) {
        setAsset(updatedAsset);
      }
      
      setCheckoutHistory(updatedCheckouts);
      
      toast({
        title: "Asset checked in",
        description: "The asset has been successfully returned.",
      });
      
      setIsCheckinDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking in asset",
        description: "Failed to check in the asset. Please try again.",
      });
    }
  };
  
  const resetMaintenanceForm = () => {
    setMaintenanceType("preventive");
    setMaintenanceDate(new Date().toISOString().split('T')[0]);
    setMaintenanceBy("");
    setMaintenanceCost("");
    setMaintenanceDescription("");
    setMaintenanceNotes("");
  };
  
  const resetCheckoutForm = () => {
    setSelectedUserId("");
    setCheckoutDate(new Date().toISOString().split('T')[0]);
    setExpectedReturnDate("");
    setCheckoutNotes("");
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Asset Not Found</h2>
        <p className="text-muted-foreground">The asset you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/assets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/assets")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{asset.name}</h1>
            <p className="text-muted-foreground">
              {asset.type} • {asset.serialNumber || "No Serial"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/assets/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the asset
                  "{asset.name}" and all associated records.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAsset}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
        asset.status === 'available' 
          ? 'bg-success-light text-success' 
          : asset.status === 'in-use'
          ? 'bg-warning-light text-warning'
          : asset.status === 'maintenance'
          ? 'bg-danger-light text-danger'
          : 'bg-muted text-muted-foreground'
      }`}>
        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
            <CardDescription>Detailed information about this asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Purchase Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(asset.purchaseDate)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Purchase Cost</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(asset.purchaseCost)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Location</p>
                <p className="text-sm text-muted-foreground">{asset.location}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Warranty Expiry</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(asset.warrantyExpiryDate)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Last Maintenance</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(asset.lastMaintenanceDate)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Next Maintenance</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(asset.nextMaintenanceDate)}
                </p>
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm font-medium leading-none">Description</p>
                <p className="text-sm text-muted-foreground">
                  {asset.description || "No description provided."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assignment Status</CardTitle>
            <CardDescription>Current assignment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {asset.status === "in-use" && asset.assignedToName ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="bg-warning-light p-2 rounded-full">
                      <UserCheck className="h-5 w-5 text-warning" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Currently Assigned</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.assignedToName}
                      </p>
                    </div>
                  </div>
                  
                  <Dialog open={isCheckinDialogOpen} onOpenChange={setIsCheckinDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <UserX className="mr-2 h-4 w-4" />
                        Check In Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Check In Asset</DialogTitle>
                        <DialogDescription>
                          This will mark the asset as returned and available for reassignment.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-1">
                          <p className="font-medium">Currently assigned to:</p>
                          <p>{asset.assignedToName}</p>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCheckinDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCheckin}>
                          Check In
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="bg-success-light p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Available</p>
                      <p className="text-sm text-muted-foreground">
                        This asset is not currently assigned.
                      </p>
                    </div>
                  </div>
                  
                  <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Assign Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Asset</DialogTitle>
                        <DialogDescription>
                          Assign this asset to a user.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="user">Assign to</Label>
                          <Select
                            value={selectedUserId}
                            onValueChange={setSelectedUserId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.firstName} {user.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="checkoutDate">Checkout Date</Label>
                          <Input
                            id="checkoutDate"
                            type="date"
                            value={checkoutDate}
                            onChange={(e) => setCheckoutDate(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expectedReturnDate">
                            Expected Return Date (Optional)
                          </Label>
                          <Input
                            id="expectedReturnDate"
                            type="date"
                            value={expectedReturnDate}
                            onChange={(e) => setExpectedReturnDate(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Add any notes about this assignment"
                            value={checkoutNotes}
                            onChange={(e) => setCheckoutNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsCheckoutDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCheckout}
                          disabled={!selectedUserId || !checkoutDate}
                        >
                          Assign Asset
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              
              <div className="pt-4 space-y-2">
                <h3 className="font-medium">Maintenance</h3>
                <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Wrench className="mr-2 h-4 w-4" />
                      Record Maintenance
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Maintenance</DialogTitle>
                      <DialogDescription>
                        Enter details about the maintenance performed on this asset.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceType">Maintenance Type</Label>
                        <Select
                          value={maintenanceType}
                          onValueChange={(value: "preventive" | "corrective" | "predictive") => 
                            setMaintenanceType(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="preventive">Preventive</SelectItem>
                            <SelectItem value="corrective">Corrective</SelectItem>
                            <SelectItem value="predictive">Predictive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceDate">Maintenance Date</Label>
                        <Input
                          id="maintenanceDate"
                          type="date"
                          value={maintenanceDate}
                          onChange={(e) => setMaintenanceDate(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceBy">Performed By</Label>
                        <Input
                          id="maintenanceBy"
                          placeholder="Name or department"
                          value={maintenanceBy}
                          onChange={(e) => setMaintenanceBy(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceCost">Cost</Label>
                        <Input
                          id="maintenanceCost"
                          type="number"
                          placeholder="0.00"
                          value={maintenanceCost}
                          onChange={(e) => setMaintenanceCost(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceDescription">Description</Label>
                        <Textarea
                          id="maintenanceDescription"
                          placeholder="Describe the maintenance performed"
                          value={maintenanceDescription}
                          onChange={(e) => setMaintenanceDescription(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceNotes">Notes (Optional)</Label>
                        <Textarea
                          id="maintenanceNotes"
                          placeholder="Any additional notes"
                          value={maintenanceNotes}
                          onChange={(e) => setMaintenanceNotes(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsMaintenanceDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMaintenance}
                        disabled={
                          !maintenanceDate ||
                          !maintenanceBy ||
                          !maintenanceCost ||
                          !maintenanceDescription
                        }
                      >
                        Save Record
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="maintenance">
        <TabsList className="mb-4">
          <TabsTrigger value="maintenance">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance History
          </TabsTrigger>
          <TabsTrigger value="checkout">
            <Calendar className="mr-2 h-4 w-4" />
            Checkout History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance">
          <Card>
            <CardContent className="p-6">
              {maintenanceRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.maintenanceDate)}</TableCell>
                        <TableCell className="capitalize">{record.maintenanceType}</TableCell>
                        <TableCell>{record.performedBy}</TableCell>
                        <TableCell>{formatCurrency(record.cost)}</TableCell>
                        <TableCell>
                          <div>
                            <p>{record.description}</p>
                            {record.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Notes: {record.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No maintenance records</h3>
                  <p className="text-muted-foreground mt-1">
                    There are no maintenance records for this asset yet.
                  </p>
                  <Button
                    onClick={() => setIsMaintenanceDialogOpen(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Record Maintenance
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="checkout">
          <Card>
            <CardContent className="p-6">
              {checkoutHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Checkout Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkoutHistory.map((checkout) => {
                      const assignedUser = users.find(u => u.id === checkout.userId);
                      
                      return (
                        <TableRow key={checkout.id}>
                          <TableCell>{formatDate(checkout.checkoutDate)}</TableCell>
                          <TableCell>
                            {assignedUser 
                              ? `${assignedUser.firstName} ${assignedUser.lastName}`
                              : "Unknown User"}
                          </TableCell>
                          <TableCell>
                            {formatDate(checkout.expectedReturnDate)}
                          </TableCell>
                          <TableCell>
                            {checkout.returnDate 
                              ? formatDate(checkout.returnDate)
                              : "Not returned"}
                          </TableCell>
                          <TableCell>{checkout.notes || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No checkout history</h3>
                  <p className="text-muted-foreground mt-1">
                    This asset has never been checked out.
                  </p>
                  <Button
                    onClick={() => setIsCheckoutDialogOpen(true)}
                    className="mt-4"
                    variant="outline"
                    disabled={asset.status === "in-use"}
                  >
                    Assign Asset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetail;
