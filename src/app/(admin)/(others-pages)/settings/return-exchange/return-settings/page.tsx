
import ReturnPolicySettings from '@/components/settings/returnAndExchange/returnSettings';
import SettingsLayout from '@/components/settings/settingsLayout';
export default function courierPriority() {
  return (
    <SettingsLayout>
      <div className="max-w-10xl mx-auto px-8 py-8">
        <ReturnPolicySettings />
      </div>
    </SettingsLayout>
  );
}