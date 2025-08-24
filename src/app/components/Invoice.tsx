"use client";

import React, { useRef } from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

import { IOrder, Trip } from "@/types/order";

interface InvoiceProps {
  order: IOrder;
}
const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => format(new Date(date), "MMMM dd, yyyy");
  const formatDateTime = (date: Date) => format(new Date(date), "MMMM dd, yyyy 'at' hh:mm a");
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getPaymentMethodDisplay = (method: string) => {
    const methods = {
      "credit-card": "Credit Card",
      "upi": "UPI",
      "paypal": "PayPal",
      "cash": "Cash"
    };
    return methods[method as keyof typeof methods] || method;
  };

  const calculateSubtotal = () => {
    return order.trips.reduce((total, trip) => total + (trip.price * trip.quantity), 0);
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${order._id.slice(-8).toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end print:hidden">
        <Button
          onClick={downloadPDF}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button
          onClick={printInvoice}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <div
        ref={invoiceRef}
        className="bg-white p-6 rounded-lg border shadow-sm invoice-print"
      >
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b-2 border-gray-200 pb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">Cloudship Holidays</h1>
            <p className="text-gray-600">Adventure Awaits You</p>
            <p className="text-sm text-gray-500 mt-1">
             Second Floor, A-245, Devli Rd, opp. Honda Showroom, near Vishal Mega Mart, Khanpur Village, Khanpur, New Delhi, Delhi 110062
            </p>
            <p className="text-sm text-gray-500">Phone :- +91-9310682414</p>
            <p className="text-sm text-gray-500">Email: info@cloudshipholidays.com</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">INVOICE</h2>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Invoice #:</span> {order._id.toString().slice(-8).toUpperCase()}
              </p>
              <p>
                <span className="font-medium">Issued:</span> {formatDateTime(order.createdAt)}
              </p>
              <p>
                <span className="font-medium">Booking Date:</span> {formatDate(order.bookingDate)}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-start sm:items-center">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Order Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "confirmed"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Payment Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "refunded"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Payment Method:</span>
              <span className="text-sm text-gray-700">
                {getPaymentMethodDisplay(order.paymentMethod)}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Bill To
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="font-medium">{order.contactInfo.name}</p>
              <p>{order.contactInfo.email}</p>
              <p>{order.contactInfo.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Booking Summary
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Total Trips:</span>
                <span className="font-medium">{order.trips.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Travelers:</span>
                <span className="font-medium">
                  {order.trips.reduce((total, trip) => total + trip.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Booking Reference:</span>
                <span className="font-medium">TRVL-{order._id.toString().slice(-6).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
            Trip Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Trip Name
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Location
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Date
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Travelers
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Unit Price
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.trips.map((trip, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {trip.name}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {trip.location}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {formatDate(trip.selectedDate)}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {trip.quantity}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                      {formatCurrency(trip.price)}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-semibold text-gray-700">
                      {formatCurrency(trip.price * trip.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-80">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-700">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
              
              {order.paymentStatus === "paid" && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Amount Paid:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="border-t-2 border-gray-200 pt-6">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Terms & Conditions</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Payment is due upon receipt of this invoice</li>
              <li>• Trips are subject to availability and weather conditions</li>
              <li>• Cancellation policy: 48 hours notice required for full refund</li>
              <li>• All prices include applicable taxes and fees</li>
            </ul>
          </div>
          
          <div className="text-center text-gray-600">
            <p className="mb-2">Thank you for choosing TravelEase for your adventure!</p>
            <p className="text-sm">
              For any inquiries, please contact info@cloudshipholidays.com or call +91-931068241467
            </p>
            <p className="text-xs mt-4 text-gray-400">
              This is an automated invoice. No signature required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;