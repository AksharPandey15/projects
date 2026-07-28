"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import InvoiceItem from "./Invoice-item";
import { useInvoice } from "@/context/invoice-context";

export default function ItemList() {
    const {invoice,addItem} = useInvoice(); 
  return (
    <Card>
        <CardHeader className="flex flex-row item-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2"/>
                Add Item
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            {invoice.items.map((item,index) => (
                <InvoiceItem key={item.id} item={item} index={index} canRemove={invoice.items.length > 1}/>
            ))}
        </CardContent>
    </Card>
  );
}