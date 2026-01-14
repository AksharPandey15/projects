import BasicDetails from "@/components/BasicDetails";
import ContactDetails from "@/components/ContactDetails";
import ItemList from "@/components/ItemList";
import TaxAndTotals from "@/components/TaxAndTotals";

export default function InvoiceForm() { 
  return (
    <div className="space-y-6">
        <BasicDetails />
        <ContactDetails />
        <ItemList />
        <TaxAndTotals />
    </div>
);
}