// import SettingsHeader from '@/components/settings/settingsHeader';
import BillingAddress from '@/components/settings/companySetup/billingInvoice';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function DomesticKYCPage() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <BillingAddress />
      </div>
    </SettingsLayout>
  );
}