import LabelPreference from '@/components/settings/companySetup/labels';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function label() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <LabelPreference />
      </div>
    </SettingsLayout>
  );
}