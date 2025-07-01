<template>
  <SettingsSection title="Privacy Settings">
    <div class="space-y-4">
      <SettingsToggle
        label="Usage Analytics"
        description="Allow us to collect anonymous usage data"
        :model-value="analyticsEnabled"
        @update:model-value="$emit('update:analyticsEnabled', $event)"
      />
      
      <SettingsToggle
        label="Error Reporting"
        description="Send error reports to help improve the app"
        :model-value="errorReportingEnabled"
        @update:model-value="$emit('update:errorReportingEnabled', $event)"
      />
      
      <SettingsToggle
        label="Marketing Communications"
        description="Receive updates about new features and offers"
        :model-value="marketingEnabled"
        @update:model-value="$emit('update:marketingEnabled', $event)"
      />
    </div>
  </SettingsSection>
</template>

<script setup lang="ts">
import SettingsSection from './SettingsSection.vue';
import SettingsToggle from './SettingsToggle.vue';

defineProps<{
  analyticsEnabled: boolean;
  errorReportingEnabled: boolean;
  marketingEnabled: boolean;
}>();

defineEmits<{
  'update:analyticsEnabled': [value: boolean];
  'update:errorReportingEnabled': [value: boolean];
  'update:marketingEnabled': [value: boolean];
}>();
</script>