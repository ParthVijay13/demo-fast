import CourierPriority from '@/components/settings/courierManagement/courierPriority';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function courierPriority() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <CourierPriority />
      </div>
    </SettingsLayout>
  );
}