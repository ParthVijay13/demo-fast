
import ManageUsers from '@/components/settings/additionalSettings/manageUsers';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function bankDetails() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8 overflow-hidden">
        <ManageUsers />
      </div>
    </SettingsLayout>
  );
}