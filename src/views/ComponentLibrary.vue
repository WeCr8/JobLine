<template>
  <div class="component-library">
    <header class="component-library-header">
      <h1 class="component-library-title">Component Library</h1>
      <p class="component-library-description">
        A collection of reusable UI components for web, iOS, and Android
      </p>
    </header>
    
    <main class="component-library-content">
      <!-- Button Component -->
      <section class="component-library-section" id="buttons">
        <h2 class="component-library-section-title">Buttons</h2>
        
        <ComponentPreview
          title="Button Variants"
          :code="buttonVariantsCode"
          :props="buttonProps"
          :states="buttonStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-grid">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
            </div>
          </template>
        </ComponentPreview>
        
        <ComponentPreview
          title="Button Sizes"
          :code="buttonSizesCode"
          :states="buttonSizeStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-flex">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </template>
        </ComponentPreview>
        
        <ComponentPreview
          title="Button with Icons"
          :code="buttonIconsCode"
          :states="buttonIconStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-flex">
              <Button :icon-left="SearchIcon">Search</Button>
              <Button :icon-right="ArrowRightIcon">Next</Button>
              <Button variant="secondary" :icon-left="DownloadIcon">Download</Button>
              <Button variant="ghost" :icon-left="TrashIcon">Delete</Button>
            </div>
          </template>
        </ComponentPreview>
        
        <ComponentPreview
          title="Button States"
          :code="buttonStatesCode"
          :states="buttonStateStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-grid">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button loading loading-text="Processing...">Submit</Button>
            </div>
          </template>
        </ComponentPreview>
      </section>
      
      <!-- Slider Component -->
      <section class="component-library-section" id="sliders">
        <h2 class="component-library-section-title">Sliders</h2>
        
        <ComponentPreview
          title="Basic Slider"
          :code="sliderBasicCode"
          :props="sliderProps"
          :states="sliderStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-container">
              <Slider v-model="sliderValue" :min="0" :max="100" :step="1" />
              <div class="component-demo-value">Value: {{ sliderValue }}</div>
            </div>
          </template>
        </ComponentPreview>
        
        <ComponentPreview
          title="Range Slider"
          :code="sliderRangeCode"
          :states="sliderRangeStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-container">
              <Slider 
                v-model="sliderRangeValue" 
                :min="0" 
                :max="100" 
                :step="1" 
                range 
                show-value
              />
              <div class="component-demo-value">
                Range: {{ sliderRangeValue[0] }} - {{ sliderRangeValue[1] }}
              </div>
            </div>
          </template>
        </ComponentPreview>
        
        <ComponentPreview
          title="Slider with Ticks"
          :code="sliderTicksCode"
          :states="sliderTickStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-container">
              <Slider 
                v-model="sliderTickValue" 
                :min="0" 
                :max="100" 
                :step="20" 
                show-ticks
                :ticks="[
                  { value: 0, label: '0%' },
                  { value: 20, label: '20%' },
                  { value: 40, label: '40%' },
                  { value: 60, label: '60%' },
                  { value: 80, label: '80%' },
                  { value: 100, label: '100%' }
                ]"
              />
              <div class="component-demo-value">Value: {{ sliderTickValue }}</div>
            </div>
          </template>
        </ComponentPreview>
        
        <ComponentPreview
          title="Vertical Slider"
          :code="sliderVerticalCode"
          :states="sliderVerticalStates"
          initial-state="default"
        >
          <template #default>
            <div class="component-demo-container" style="height: 200px;">
              <Slider 
                v-model="sliderVerticalValue" 
                :min="0" 
                :max="100" 
                :step="1" 
                vertical
                show-value
              />
              <div class="component-demo-value">Value: {{ sliderVerticalValue }}</div>
            </div>
          </template>
        </ComponentPreview>
      </section>
      
      <!-- Preview Component -->
      <section class="component-library-section" id="preview">
        <h2 class="component-library-section-title">Preview System</h2>
        
        <ComponentPreview
          title="Device Preview"
          :code="previewDeviceCode"
          :props="previewProps"
          :states="previewDeviceStates"
          initial-state="default"
        >
          <template #default>
            <Preview
              :states="[
                { id: 'default', name: 'Default View' },
                { id: 'loading', name: 'Loading State' },
                { id: 'error', name: 'Error State' }
              ]"
              :loading="false"
              :error="false"
              error-message="Failed to load content"
            >
              <div class="preview-demo-content">
                <h3>Preview Content</h3>
                <p>This is a responsive preview that adapts to different device sizes.</p>
                <Button>Click Me</Button>
              </div>
            </Preview>
          </template>
        </ComponentPreview>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, Slider, Preview, ComponentPreview } from '../components/ui';

// Button demo data
const buttonProps = [
  { name: 'variant', type: 'string', default: 'primary', description: 'Button style variant' },
  { name: 'size', type: 'string', default: 'md', description: 'Button size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading state' },
  { name: 'loadingText', type: 'string', default: '""', description: 'Text to show while loading' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Makes button full width' },
  { name: 'iconLeft', type: 'Component', default: 'undefined', description: 'Icon to show on the left' },
  { name: 'iconRight', type: 'Component', default: 'undefined', description: 'Icon to show on the right' },
  { name: 'ripple', type: 'boolean', default: 'true', description: 'Enable ripple effect on click' }
];

const buttonStates = [
  { id: 'default', name: 'Default' },
  { id: 'hover', name: 'Hover' },
  { id: 'active', name: 'Active' },
  { id: 'focus', name: 'Focus' }
];

const buttonSizeStates = [
  { id: 'default', name: 'Default' }
];

const buttonIconStates = [
  { id: 'default', name: 'Default' }
];

const buttonStateStates = [
  { id: 'default', name: 'Default' }
];

// Slider demo data
const sliderValue = ref(50);
const sliderRangeValue = ref([20, 80]);
const sliderTickValue = ref(40);
const sliderVerticalValue = ref(60);

const sliderProps = [
  { name: 'modelValue', type: 'number | number[]', default: '0', description: 'Current value(s)' },
  { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  { name: 'step', type: 'number', default: '1', description: 'Step increment' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the slider' },
  { name: 'vertical', type: 'boolean', default: 'false', description: 'Vertical orientation' },
  { name: 'range', type: 'boolean', default: 'false', description: 'Range selection mode' },
  { name: 'showValue', type: 'boolean', default: 'false', description: 'Show value label' },
  { name: 'showTicks', type: 'boolean', default: 'false', description: 'Show tick marks' },
  { name: 'ticks', type: 'array', default: '[]', description: 'Custom tick marks' }
];

const sliderStates = [
  { id: 'default', name: 'Default' }
];

const sliderRangeStates = [
  { id: 'default', name: 'Default' }
];

const sliderTickStates = [
  { id: 'default', name: 'Default' }
];

const sliderVerticalStates = [
  { id: 'default', name: 'Default' }
];

// Preview demo data
const previewProps = [
  { name: 'title', type: 'string', default: '""', description: 'Preview title' },
  { name: 'states', type: 'array', default: '[]', description: 'Available view states' },
  { name: 'initialState', type: 'string', default: '""', description: 'Initial state ID' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
  { name: 'errorMessage', type: 'string', default: '""', description: 'Error message to display' },
  { name: 'devices', type: 'array', default: '[...]', description: 'Available device options' },
  { name: 'initialDevice', type: 'string', default: '"desktop"', description: 'Initial device' }
];

const previewDeviceStates = [
  { id: 'default', name: 'Default View' },
  { id: 'loading', name: 'Loading State' },
  { id: 'error', name: 'Error State' }
];

// Code examples
const buttonVariantsCode = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>`;

const buttonSizesCode = `<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`;

const buttonIconsCode = `<Button :icon-left="SearchIcon">Search</Button>
<Button :icon-right="ArrowRightIcon">Next</Button>
<Button variant="secondary" :icon-left="DownloadIcon">Download</Button>
<Button variant="ghost" :icon-left="TrashIcon">Delete</Button>`;

const buttonStatesCode = `<Button>Normal</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button loading loading-text="Processing...">Submit</Button>`;

const sliderBasicCode = `<Slider v-model="value" :min="0" :max="100" :step="1" />`;

const sliderRangeCode = `<Slider 
  v-model="rangeValue" 
  :min="0" 
  :max="100" 
  :step="1" 
  range 
  show-value
/>`;

const sliderTicksCode = `<Slider 
  v-model="value" 
  :min="0" 
  :max="100" 
  :step="20" 
  show-ticks
  :ticks="[
    { value: 0, label: '0%' },
    { value: 20, label: '20%' },
    { value: 40, label: '40%' },
    { value: 60, label: '60%' },
    { value: 80, label: '80%' },
    { value: 100, label: '100%' }
  ]"
/>`;

const sliderVerticalCode = `<Slider 
  v-model="value" 
  :min="0" 
  :max="100" 
  :step="1" 
  vertical
  show-value
/>`;

const previewDeviceCode = `<Preview
  :states="[
    { id: 'default', name: 'Default View' },
    { id: 'loading', name: 'Loading State' },
    { id: 'error', name: 'Error State' }
  ]"
  :loading="false"
  :error="false"
  error-message="Failed to load content"
>
  <div>
    <h3>Preview Content</h3>
    <p>This is a responsive preview that adapts to different device sizes.</p>
    <Button>Click Me</Button>
  </div>
</Preview>`;

// Icon components for demo
function SearchIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
    })
  ]);
}

function ArrowRightIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
    })
  ]);
}

function DownloadIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
    })
  ]);
}

function TrashIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
    })
  ]);
}

import { h } from 'vue';
</script>

<style scoped>
.component-library {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.component-library-header {
  margin-bottom: 3rem;
  text-align: center;
}

.component-library-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.component-library-description {
  font-size: 1.125rem;
  color: #6b7280;
}

.component-library-section {
  margin-bottom: 4rem;
}

.component-library-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.component-demo-container {
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
}

.component-demo-value {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.component-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
}

.component-demo-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
}

.preview-demo-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.preview-demo-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.preview-demo-content p {
  margin: 0;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .component-library-title {
    font-size: 1.75rem;
  }
  
  .component-library-description {
    font-size: 1rem;
  }
  
  .component-demo-grid,
  .component-demo-flex {
    padding: 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .component-library-title {
    color: #f9fafb;
  }
  
  .component-library-description {
    color: #9ca3af;
  }
  
  .component-library-section-title {
    color: #f9fafb;
    border-bottom-color: #374151;
  }
  
  .component-demo-container,
  .component-demo-grid,
  .component-demo-flex {
    background-color: #1f2937;
  }
  
  .component-demo-value {
    color: #9ca3af;
  }
}
</style>