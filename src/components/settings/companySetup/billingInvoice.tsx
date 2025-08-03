"use client";

import React, { useState, ChangeEvent } from "react";
// import axios from "axios";
// import api from "@/app/interceptors/tokenexpire";
import { Upload } from "lucide-react";

import { useDirty } from "@/hooks/useDIrty";
// import ThreeBodyLoader from "@/components/loader/loader";
import toast from "react-hot-toast";
import internalApi from "@/app/interceptors/internalAPI";
interface BillingAddressState {
  contactNumber: string;
  completeAddress: string;
  addressLandmark: string;
  pincode: string;
  city: string;
  state: string;
}

interface InvoicePreferenceState {
  invoicePrefix: string;
  invoiceSeriesStart: string;
  cinNumber: string;
  invoiceType: "classic" | "thermal";
  hideBuyerContact: "hide" | "show";
  signature: File | null;
}

const BillingAddress: React.FC = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") || "" : "";

  const [billingData, setBillingData] = useState<BillingAddressState>({
    contactNumber: "",
    completeAddress: "",
    addressLandmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [invoiceData, setInvoiceData] = useState<InvoicePreferenceState>({
    invoicePrefix: "Retail",
    invoiceSeriesStart: "1",
    cinNumber: "",
    invoiceType: "classic",
    hideBuyerContact: "hide",
    signature: null,
  });
  // at top of component
const [initialBillingData, setInitialBillingData] = useState<BillingAddressState | null>(null);
const [initialInvoiceData, setInitialInvoiceData] = useState<InvoicePreferenceState | null>(null);



// const [loading, setLoading] = useState(false);

const [previewInvoice, setPreviewInvoice] = useState("Retail00001");
 


  // ─── Fetch both billing & invoice on mount ─────────────────────
  // useEffect(() => {
  //   const loadAll = async () => {
  //     try {
  //       const [billRes, invRes] = await Promise.all([
  //         internalApi.get(`/api/billing-address`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //         internalApi.get(`/api/invoice-setting`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //       ]);
        
  //       if (billRes.data.success) {
  //         const d = billRes.data.data;
  //         const mapped:BillingAddressState  = {
  //         contactNumber: d.billing_address_contact_number ?? "",
  //         completeAddress: d.billing_address ?? "",
  //         addressLandmark: d.billing_address_landmark ?? "",
  //         pincode: d.billing_address_pincode ?? "",
  //         city: d.billing_address_city ?? "",
  //         state: d.billing_address_state ?? "",
  //       };
  //       setBillingData(mapped);
  //       setInitialBillingData(mapped);
        
  //         setLoading(false);

  //       }

  //       if (invRes.data.success) {
  //         const d = invRes.data.data;
  //         const mappedInv: InvoicePreferenceState =
  //         {
  //           invoicePrefix: d.invoice_prefix??"",
  //           invoiceSeriesStart: String(d.invoice_series_starting_from)??"",
  //           cinNumber: d.invoice_cin_number??"",
  //           invoiceType: "classic", // backend doesn’t return this
  //           hideBuyerContact: d.invoice_hide_buyer_contact ? "hide" : "show",
  //           signature: null,
  //         };
          
  //         setInvoiceData(mappedInv);
  //         setInitialInvoiceData(mappedInv);
  //         setPreviewInvoice(
  //           `${d.invoice_prefix}${String(d.invoice_series_starting_from).padStart(
  //             5,
  //             "0"
  //           )}`
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Failed to load settings", err);
  //     }
  //   };
  //   loadAll();
  // }, [token]);
const isBillingDirty = useDirty(initialBillingData, billingData);
const isInvoiceDirty = useDirty(initialInvoiceData, invoiceData);

  // ─── Handlers ───────────────────────────────────────────────────
  const handleBillingChange = (
    field: keyof BillingAddressState,
    value: string
  ) => {
    setBillingData({ ...billingData, [field]: value });
  };

  const handleInvoiceChange = (
    field: keyof InvoicePreferenceState,
    value: any
  ) => {
    const updated = { ...invoiceData, [field]: value };
    setInvoiceData(updated);

    if (field === "invoicePrefix" || field === "invoiceSeriesStart") {
      const prefix =
        field === "invoicePrefix" ? value : updated.invoicePrefix;
      const series =
        field === "invoiceSeriesStart"
          ? value
          : updated.invoiceSeriesStart;
      setPreviewInvoice(`${prefix}${String(series).padStart(5, "0")}`);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 3 * 1024 * 1024) {
        setInvoiceData({ ...invoiceData, signature: file });
      } else {
        alert("File size should be less than 3MB");
      }
    }
  };

  const handleBillingSave = async () => {
    try {
      const payload = {
        billing_address: billingData.completeAddress,
        billing_address_landmark: billingData.addressLandmark,
        billing_address_pincode: billingData.pincode,
        billing_address_city: billingData.city,
        billing_address_state: billingData.state,
        billing_address_contact_number: billingData.contactNumber,
      };

      // const { valid, errors } = await validateBillingData(payload);
      //   if (!valid) {
      //     // For example: setFormErrors(errors)
      //     console.log("this is the error in billing save :",errors);
      //     return;
      //   }

      const res = await internalApi.patch(
        `/api/billing-address`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        // alert("saved")
        // showToast("Data updated Successfully","success")
        toast.success("Billing data saved successfully!")
        const d = res.data.data;
        setBillingData({
          contactNumber: d.billing_address_contact_number,
          completeAddress: d.billing_address,
          addressLandmark: d.billing_address_landmark,
          pincode: d.billing_address_pincode,
          city: d.billing_address_city,
          state: d.billing_address_state,
        });
        setInitialBillingData(billingData);
      }
    } catch (err: any) {
      console.error(err);
      // showToast(err.response?.data?.message || "Pickup address added successfully!", "error");
      toast.error(err.response?.data?.message);
      
    }
  };

  const handleInvoiceSave = async () => {
    try {
      const payload = {
        invoice_prefix: invoiceData.invoicePrefix,
        invoice_series_starting_from: invoiceData.invoiceSeriesStart,
        invoice_cin_number: invoiceData.cinNumber,
        invoice_hide_buyer_contact:
          invoiceData.hideBuyerContact === "hide",
        // invoice_signature: invoiceData.signature  (if you later support uploading)
      };
      const res = await internalApi.patch(
        `/api/invoice-setting`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        // showToast("Invoice Data saved successfully","success");
        toast.success("Invoice Data saved successfully! ")
        const d = res.data.data;
        setInvoiceData((prev) => ({
          ...prev,
          invoicePrefix: d.invoice_prefix,
          invoiceSeriesStart: String(d.invoice_series_starting_from),
          cinNumber: d.invoice_cin_number,
          hideBuyerContact: d.invoice_hide_buyer_contact
            ? "hide"
            : "show",
        }));
        setInitialInvoiceData(invoiceData);
        setPreviewInvoice(
          `${d.invoice_prefix}${String(
            d.invoice_series_starting_from
          ).padStart(5, "0")}`
        );
      }
    } catch (err: any) {
      console.error(err);
      // showToast(err.response?.data?.message || "Fallback message", "error");
      toast.error(err.response?.data?.message)
    }
  };
  // if(loading){
  //   return (
  //     <ThreeBodyLoader/>
  //   );
  // }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white space-y-12">
      {/* Billing Address Section */}
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Billing Address</h1>
          <p className="text-gray-600">
            Billing address is the same as your company pick-up address entered
            during onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="text"
              value={billingData.contactNumber}
              onChange={(e) =>
                handleBillingChange("contactNumber", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complete Address
            </label>
            <input
              type="text"
              value={billingData.completeAddress}
              onChange={(e) =>
                handleBillingChange("completeAddress", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Landmark <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={billingData.addressLandmark}
              onChange={(e) =>
                handleBillingChange("addressLandmark", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
            </label>
            <input
              type="text"
              value={billingData.pincode}
              onChange={(e) =>
                handleBillingChange("pincode", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={billingData.city}
              onChange={(e) => handleBillingChange("city", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={billingData.state}
              onChange={(e) => handleBillingChange("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleBillingSave}
            disabled={!isBillingDirty}
            className={`px-6 py-2 rounded-lg font-medium transition-colors
    ${isBillingDirty
      ? "bg-purple-600 text-white hover:bg-purple-700"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Invoice Preference Section */}
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Invoice Preference</h1>
          <p className="text-gray-600">
            Add invoice preferences on the basis of your product packaging
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Prefix
            </label>
            <input
              type="text"
              value={invoiceData.invoicePrefix}
              onChange={(e) =>
                handleInvoiceChange("invoicePrefix", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Series Starting from
            </label>
            <input
              type="text"
              value={invoiceData.invoiceSeriesStart}
              onChange={(e) =>
                handleInvoiceChange("invoiceSeriesStart", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview of Invoice prefix and series
            </label>
            <input
              type="text"
              value={previewInvoice}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CIN Number <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={invoiceData.cinNumber}
              onChange={(e) =>
                handleInvoiceChange("cinNumber", e.target.value)
              }
              placeholder="Enter the CIN Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Type <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="invoiceType"
                  value="classic"
                  checked={invoiceData.invoiceType === "classic"}
                  onChange={(e) =>
                    handleInvoiceChange("invoiceType", e.target.value)
                  }
                  className="text-purple-600"
                />
                <span>Classic A4 size</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="invoiceType"
                  value="thermal"
                  checked={invoiceData.invoiceType === "thermal"}
                  onChange={(e) =>
                    handleInvoiceChange("invoiceType", e.target.value)
                  }
                  className="text-purple-600"
                />
                <span>Thermal 6 X 4 size</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <strong>Note:</strong> The fixed standard size for international
              shipments will be A4 size only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hide Buyer&apos;s Contact Number in Invoice
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hideBuyerContact"
                  value="hide"
                  checked={invoiceData.hideBuyerContact === "hide"}
                  onChange={(e) =>
                    handleInvoiceChange("hideBuyerContact", e.target.value)
                  }
                  className="text-purple-600"
                />
                <span>Hide</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hideBuyerContact"
                  value="show"
                  checked={invoiceData.hideBuyerContact === "show"}
                  onChange={(e) =>
                    handleInvoiceChange("hideBuyerContact", e.target.value)
                  }
                  className="text-purple-600"
                />
                <span>Show</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <strong>Note:</strong> We recommend hiding it to avoid data breach
            </p>
          </div>
        </div>

        {/* Upload Signature Section */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload your signature <span className="text-gray-400">(Optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="signature-upload"
            />
            <label htmlFor="signature-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <p className="text-purple-600 font-medium mb-2">Upload</p>
              {invoiceData.signature && (
                <p className="text-sm text-green-600">
                  File uploaded: {invoiceData.signature.name}
                </p>
              )}
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Note:</strong> Image should be less than 3 MB
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={handleInvoiceSave}
            disabled= {!isInvoiceDirty}
            className={`px-8 py-3 rounded-lg font-medium transition-colors
    ${isInvoiceDirty
      ? "bg-purple-600 text-white hover:bg-purple-700"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          >
            Save
          </button>
        </div>
      </div>
   
    </div>
  );
};

export default BillingAddress;
