import PasswordSecurity from '@/components/settings/companySetup/passwordSequrity';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function passwordAndSequrity() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <PasswordSecurity />
      </div>
    </SettingsLayout>
  );
}