import BankDetailsForm from '@/components/settings/sellerRemittance/bankDetails';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function bankDetails() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <BankDetailsForm />
      </div>
    </SettingsLayout>
  );
}