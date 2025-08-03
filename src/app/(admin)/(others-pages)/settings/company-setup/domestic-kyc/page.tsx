import DomesticKYC from '@/components/settings/companySetup/domesticKYC';
import SettingsLayout from '@/components/settings/settingsLayout';

export default function DomesticKYCPage() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <DomesticKYC />
      </div>
    </SettingsLayout>
  );
}