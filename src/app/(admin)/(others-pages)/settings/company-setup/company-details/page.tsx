import CompanyDetails from '@/components/settings/companySetup/companyDetails';
// import SettingsHeader from '@/components/settings/settingsHeader';
import SettingsLayout from '@/components/settings/settingsLayout';


export default function CompanyDetailsPage() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <CompanyDetails />
      </div>
    </SettingsLayout>
  );
}