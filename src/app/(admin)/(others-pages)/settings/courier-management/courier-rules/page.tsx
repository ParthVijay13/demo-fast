
import CourierRules from '@/components/settings/courierManagement/courierRules';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function courierPriority() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <CourierRules/>
      </div>
    </SettingsLayout>
  );
}