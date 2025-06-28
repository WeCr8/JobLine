<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Integration Settings</h1>
        <p class="text-gray-600">Connect JobLine.ai to your data sources and systems</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="refreshConnections"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon class="w-4 h-4 inline mr-1" />
          Refresh
        </button>
        <button
          @click="showAddConnectionModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Add Connection
        </button>
      </div>
    </div>

    <!-- Connection Type Tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8 overflow-x-auto">
        <button
          @click="activeTab = 'all'"
          :class="activeTab === 'all' 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          class="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200"
        >
          All Connections
        </button>
        <button
          v-for="type in connectionTypes"
          :key="type.value"
          @click="activeTab = type.value"
          :class="activeTab === type.value 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          class="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200"
        >
          {{ type.label }}
        </button>
      </nav>
    </div>

    <!-- Connections Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-2 bg-gray-200 rounded w-full mb-4"></div>
      </div>
    </div>

    <div v-else-if="filteredConnections.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <LinkIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
      <p class="text-gray-600 mb-6">Get started by adding your first data connection</p>
      <button
        @click="showAddConnectionModal = true"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
      >
        Add Connection
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="connection in filteredConnections"
        :key="connection.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
      >
        <!-- Connection Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="getConnectionTypeColor(connection.type)"
            >
              <component :is="getConnectionIcon(connection.type)" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ connection.name }}</h3>
              <p class="text-sm text-gray-600">{{ getConnectionTypeLabel(connection.type) }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(connection.status)"
            >
              {{ connection.status.toUpperCase() }}
            </span>
            <span 
              v-if="connection.complianceLevel"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getComplianceClass(connection.complianceLevel)"
            >
              {{ connection.complianceLevel.toUpperCase() }}
            </span>
          </div>
        </div>

        <!-- Status Indicator -->
        <div class="mb-4">
          <div class="flex items-center space-x-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="getStatusDot(connection.status)"
            ></div>
            <span class="text-sm text-gray-600">
              {{ getStatusText(connection.status) }}
            </span>
          </div>
        </div>

        <!-- Connection Details -->
        <div class="space-y-3 mb-4">
          <div v-if="connection.lastSync">
            <span class="text-sm text-gray-500">Last Sync:</span>
            <p class="text-sm font-medium text-gray-900">{{ formatTime(connection.lastSync) }}</p>
          </div>
          <div v-if="connection.config.pollInterval">
            <span class="text-sm text-gray-500">Poll Interval:</span>
            <p class="text-sm font-medium text-gray-900">{{ formatInterval(connection.config.pollInterval) }}</p>
          </div>
          <div v-if="connection.errorCount > 0">
            <span class="text-sm text-gray-500">Error Count:</span>
            <p class="text-sm font-medium text-red-600">{{ connection.errorCount }}</p>
          </div>
        </div>

        <!-- Configuration Preview -->
        <div class="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Configuration</h4>
          <div class="space-y-1">
            <div v-if="connection.config.baseUrl">
              <span class="text-xs text-gray-500">API URL:</span>
              <p class="text-xs font-mono text-gray-700">{{ connection.config.baseUrl }}</p>
            </div>
            <div v-if="connection.config.spreadsheetId">
              <span class="text-xs text-gray-500">Spreadsheet:</span>
              <p class="text-xs font-mono text-gray-700">{{ connection.config.sheetName }}</p>
            </div>
            <div v-if="connection.config.sapHost">
              <span class="text-xs text-gray-500">SAP Host:</span>
              <p class="text-xs font-mono text-gray-700">{{ connection.config.sapHost }}</p>
            </div>
            <div v-if="connection.config.host">
              <span class="text-xs text-gray-500">SFTP Host:</span>
              <p class="text-xs font-mono text-gray-700">{{ connection.config.host }}</p>
            </div>
            <div v-if="connection.config.databaseName">
              <span class="text-xs text-gray-500">Database:</span>
              <p class="text-xs font-mono text-gray-700">{{ connection.config.databaseName }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2">
          <button
            @click="testConnection(connection.id)"
            :disabled="testing === connection.id"
            class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
          >
            {{ testing === connection.id ? 'Testing...' : 'Test Connection' }}
          </button>
          <button
            @click="runImport(connection.id)"
            :disabled="connection.status !== 'active'"
            class="flex-1 bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
          >
            Run Import
          </button>
          <button
            @click="editConnection(connection)"
            class="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <CogIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Import Jobs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Recent Import Jobs</h2>
      </div>
      
      <div v-if="importJobs.length === 0" class="p-6 text-center">
        <ArrowDownTrayIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500">No import jobs yet</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="job in importJobs"
          :key="job.id"
          class="p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getImportStatusClass(job.status)"
              >
                {{ job.status.toUpperCase() }}
              </span>
              <h3 class="text-sm font-medium text-gray-900">{{ getImportTypeLabel(job.type) }}</h3>
            </div>
            <span class="text-xs text-gray-500">{{ formatTime(job.startedAt || '') }}</span>
          </div>
          
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Processed:</span>
              <p class="font-medium text-gray-900">{{ job.recordsProcessed }}</p>
            </div>
            <div>
              <span class="text-gray-500">Success:</span>
              <p class="font-medium text-green-600">{{ job.recordsSuccess }}</p>
            </div>
            <div>
              <span class="text-gray-500">Errors:</span>
              <p class="font-medium text-red-600">{{ job.recordsError }}</p>
            </div>
          </div>

          <div v-if="job.errors.length > 0" class="mt-3">
            <details class="text-sm">
              <summary class="cursor-pointer text-red-600 hover:text-red-700">
                View {{ job.errors.length }} error(s)
              </summary>
              <div class="mt-2 space-y-1">
                <div v-for="error in job.errors.slice(0, 3)" :key="error.row" class="text-xs text-red-600">
                  Row {{ error.row }}: {{ error.error }}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Connection Modal -->
    <div v-if="showAddConnectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">{{ editingConnection.id ? 'Edit' : 'Add' }} Connection</h3>
          <button
            @click="showAddConnectionModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveConnection" class="space-y-6">
          <!-- Basic Information -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Connection Name</label>
                <input
                  v-model="editingConnection.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="ERP Connection"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Connection Type</label>
                <select 
                  v-model="editingConnection.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option v-for="type in connectionTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Compliance Level</label>
                <select
                  v-model="editingConnection.complianceLevel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="basic">Basic</option>
                  <option value="itar">ITAR</option>
                  <option value="ear">EAR</option>
                  <option value="cmmc-2">CMMC Level 2</option>
                  <option value="cmmc-3">CMMC Level 3</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="editingConnection.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Connection-specific Configuration -->
          <div v-if="editingConnection.type === 'rest-api'">
            <h4 class="text-md font-medium text-gray-900 mb-4">REST API Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">API Base URL</label>
                <input
                  v-model="editingConnection.config.baseUrl"
                  type="url"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://api.example.com/v1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  v-model="editingConnection.config.apiKey"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your API key"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Authentication Type</label>
                <select
                  v-model="editingConnection.config.authType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                  <option value="oauth">OAuth 2.0</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="editingConnection.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
                <input
                  v-model.number="editingConnection.config.batchSize"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div v-if="editingConnection.type === 'google-sheets'">
            <h4 class="text-md font-medium text-gray-900 mb-4">Google Sheets Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Spreadsheet ID</label>
                <input
                  v-model="editingConnection.config.spreadsheetId"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
                <p class="text-xs text-gray-500 mt-1">Found in the URL of your Google Sheet</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sheet Name</label>
                <input
                  v-model="editingConnection.config.sheetName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Sheet1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Range</label>
                <input
                  v-model="editingConnection.config.range"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="A1:Z1000"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="editingConnection.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div v-if="editingConnection.type === 'sql-odbc'">
            <h4 class="text-md font-medium text-gray-900 mb-4">SQL/ODBC Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Connection String</label>
                <input
                  v-model="editingConnection.config.connectionString"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Driver={SQL Server};Server=myServerAddress;Database=myDataBase;Uid=myUsername;Pwd=myPassword;"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
                <input
                  v-model="editingConnection.config.databaseName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="myDatabase"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Table</label>
                <input
                  v-model="editingConnection.config.table"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="jobs"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Query</label>
                <textarea
                  v-model="editingConnection.config.query"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="SELECT * FROM jobs WHERE status = 'active'"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="editingConnection.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div v-if="editingConnection.type === 'sap-bapi'">
            <h4 class="text-md font-medium text-gray-900 mb-4">SAP BAPI Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Host</label>
                <input
                  v-model="editingConnection.config.sapHost"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sap-prod.company.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Client</label>
                <input
                  v-model="editingConnection.config.sapClient"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP System</label>
                <input
                  v-model="editingConnection.config.sapSystem"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="PRD"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Username</label>
                <input
                  v-model="editingConnection.config.sapUser"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SAP Password</label>
                <input
                  v-model="editingConnection.config.sapPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="editingConnection.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div v-if="editingConnection.type === 'sftp'">
            <h4 class="text-md font-medium text-gray-900 mb-4">SFTP Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Host</label>
                <input
                  v-model="editingConnection.config.host"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="sftp.example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Port</label>
                <input
                  v-model.number="editingConnection.config.port"
                  type="number"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="22"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  v-model="editingConnection.config.username"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  v-model="editingConnection.config.password"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Remote Path</label>
                <input
                  v-model="editingConnection.config.remotePath"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="/uploads/jobs"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poll Interval (minutes)</label>
                <input
                  v-model.number="editingConnection.config.pollIntervalMinutes"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div v-if="editingConnection.type === 'csv-upload'">
            <h4 class="text-md font-medium text-gray-900 mb-4">CSV Upload Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">File Format</label>
                <select
                  v-model="editingConnection.config.fileFormat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="csv">CSV</option>
                  <option value="tsv">TSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delimiter</label>
                <select
                  v-model="editingConnection.config.delimiter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Has Header Row</label>
                <div class="flex items-center mt-2">
                  <input
                    v-model="editingConnection.config.hasHeaderRow"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">First row contains headers</label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="editingConnection.type === 'webhook'">
            <h4 class="text-md font-medium text-gray-900 mb-4">Webhook Configuration</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                <div class="flex">
                  <input
                    type="text"
                    readonly
                    :value="webhookUrl"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500"
                  />
                  <button
                    type="button"
                    @click="copyWebhookUrl"
                    class="px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ClipboardIcon class="w-4 h-4" />
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Use this URL to receive data from external systems</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                <input
                  v-model="editingConnection.config.secret"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Webhook secret for verification"
                />
              </div>
            </div>
          </div>

          <!-- Data Mapping -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Data Mapping</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source Field</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Field</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Flag</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(mapping, index) in editingConnection.mapping" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.sourceField"
                        type="text"
                        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.targetField"
                        type="text"
                        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.required"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="mapping.complianceFlag"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        @click="removeMapping(index)"
                        class="text-red-600 hover:text-red-900"
                      >
                        <XMarkIcon class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-2">
              <button
                type="button"
                @click="addMapping"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Field Mapping
              </button>
            </div>
          </div>

          <!-- Advanced Settings -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Advanced Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
                <input
                  v-model.number="editingConnection.config.retryAttempts"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                <input
                  v-model.number="editingConnection.config.timeout"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ saving ? 'Saving...' : (editingConnection.id ? 'Update Connection' : 'Add Connection') }}
            </button>
            <button
              type="button"
              @click="showAddConnectionModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Run Import</h3>
          <button
            @click="showImportModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="confirmImport" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Import Type</label>
            <select
              v-model="importSettings.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="job-data">Job Data</option>
              <option value="operator-workcenter">Operator/Workcenter Mapping</option>
              <option value="routing-operations">Routing & Operations</option>
              <option value="cost-tracking">Cost Tracking</option>
              <option value="customer-association">Customer Association</option>
            </select>
          </div>

          <div v-if="importSettings.type === 'job-data'">
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div class="flex">
                <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
                <div class="ml-3">
                  <p class="text-sm text-yellow-700">
                    This will import job data from the selected connection. Make sure your data mapping is correctly configured.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="importing"
              class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ importing ? 'Importing...' : 'Start Import' }}
            </button>
            <button
              type="button"
              @click="showImportModal = false"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { format } from 'date-fns';
import { useIntegrationStore } from '../stores/integration';
import type { ConnectionConfig, ImportType, ImportMapping } from '../types/integration';
import {
  LinkIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CogIcon,
  XMarkIcon,
  ClipboardIcon,
  ExclamationTriangleIcon,
  CloudIcon,
  DocumentArrowUpIcon,
  GlobeAltIcon,
  CircleStackIcon,
  BuildingOfficeIcon,
  BoltIcon,
  ServerIcon
} from '@heroicons/vue/24/outline';

const integrationStore = useIntegrationStore();
const activeTab = ref('all');
const showAddConnectionModal = ref(false);
const showImportModal = ref(false);
const loading = ref(false);
const testing = ref<string | null>(null);
const saving = ref(false);
const importing = ref(false);
const selectedConnectionId = ref<string | null>(null);

const webhookUrl = computed(() => {
  return `${window.location.origin}/api/webhook/${editingConnection.id || 'your-connection-id'}`;
});

const connectionTypes = [
  { value: 'rest-api', label: 'REST API' },
  { value: 'google-sheets', label: 'Google Sheets' },
  { value: 'csv-upload', label: 'CSV Upload' },
  { value: 'sql-odbc', label: 'SQL/ODBC' },
  { value: 'sap-bapi', label: 'SAP BAPI' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'sftp', label: 'SFTP' }
];

const editingConnection = reactive<any>({
  id: '',
  name: '',
  type: 'rest-api',
  status: 'inactive',
  config: {},
  complianceLevel: 'basic',
  mapping: [],
  errorCount: 0
});

const importSettings = reactive({
  type: 'job-data' as ImportType
});

const connections = computed(() => integrationStore.connections);
const importJobs = computed(() => integrationStore.recentImports);

const filteredConnections = computed(() => {
  if (activeTab.value === 'all') {
    return connections.value;
  }
  return connections.value.filter(conn => conn.type === activeTab.value);
});

const refreshConnections = async () => {
  loading.value = true;
  try {
    await integrationStore.fetchConnections();
    await integrationStore.fetchImportJobs();
  } catch (error) {
    console.error('Error refreshing connections:', error);
  } finally {
    loading.value = false;
  }
};

const getConnectionIcon = (type: string) => {
  const icons = {
    'google-sheets': CloudIcon,
    'csv-upload': DocumentArrowUpIcon,
    'rest-api': GlobeAltIcon,
    'sql-odbc': CircleStackIcon,
    'sap-bapi': BuildingOfficeIcon,
    'webhook': BoltIcon,
    'sftp': ServerIcon
  };
  return icons[type as keyof typeof icons] || GlobeAltIcon;
};

const getConnectionTypeColor = (type: string) => {
  const colors = {
    'google-sheets': 'bg-green-100 text-green-600',
    'csv-upload': 'bg-blue-100 text-blue-600',
    'rest-api': 'bg-purple-100 text-purple-600',
    'sql-odbc': 'bg-orange-100 text-orange-600',
    'sap-bapi': 'bg-indigo-100 text-indigo-600',
    'webhook': 'bg-yellow-100 text-yellow-600',
    'sftp': 'bg-gray-100 text-gray-600'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
};

const getConnectionTypeLabel = (type: string) => {
  const labels = {
    'google-sheets': 'Google Sheets API',
    'csv-upload': 'CSV File Upload',
    'rest-api': 'REST API',
    'sql-odbc': 'SQL/ODBC Connection',
    'sap-bapi': 'SAP BAPI Connector',
    'webhook': 'Webhook Listener',
    'sftp': 'SFTP File Drop'
  };
  return labels[type as keyof typeof labels] || type;
};

const getStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'error': 'bg-red-100 text-red-800',
    'testing': 'bg-yellow-100 text-yellow-800'
  };
  return classes[status as keyof typeof classes] || classes.inactive;
};

const getComplianceClass = (level: string) => {
  const classes = {
    'basic': 'bg-gray-100 text-gray-800',
    'itar': 'bg-red-100 text-red-800',
    'ear': 'bg-orange-100 text-orange-800',
    'cmmc-2': 'bg-blue-100 text-blue-800',
    'cmmc-3': 'bg-purple-100 text-purple-800'
  };
  return classes[level as keyof typeof classes] || classes.basic;
};

const getStatusDot = (status: string) => {
  const classes = {
    'active': 'bg-green-500 animate-pulse',
    'inactive': 'bg-gray-400',
    'error': 'bg-red-500',
    'testing': 'bg-yellow-500 animate-pulse'
  };
  return classes[status as keyof typeof classes] || classes.inactive;
};

const getStatusText = (status: string) => {
  const texts = {
    'active': 'Connected and syncing',
    'inactive': 'Connection disabled',
    'error': 'Connection failed',
    'testing': 'Testing connection'
  };
  return texts[status as keyof typeof texts] || 'Unknown status';
};

const getImportStatusClass = (status: string) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'running': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getImportTypeLabel = (type: ImportType) => {
  const labels = {
    'job-data': 'Job Data Import',
    'operator-workcenter': 'Operator/Workcenter Mapping',
    'routing-operations': 'Routing & Operations',
    'cost-tracking': 'Cost & SLA Tracking',
    'customer-association': 'Customer Association'
  };
  return labels[type] || type;
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};

const formatInterval = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

const testConnection = async (connectionId: string) => {
  testing.value = connectionId;
  try {
    const success = await integrationStore.testConnection(connectionId);
    if (success) {
      alert('Connection test successful!');
    } else {
      alert('Connection test failed. Please check your configuration.');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    alert('Connection test failed: ' + (error as Error).message);
  } finally {
    testing.value = null;
  }
};

const runImport = async (connectionId: string) => {
  selectedConnectionId.value = connectionId;
  showImportModal.value = true;
};

const confirmImport = async () => {
  if (!selectedConnectionId.value) return;
  
  importing.value = true;
  try {
    await integrationStore.runImport(selectedConnectionId.value, importSettings.type);
    showImportModal.value = false;
    await refreshConnections();
  } catch (error) {
    console.error('Error running import:', error);
    alert('Import failed: ' + (error as Error).message);
  } finally {
    importing.value = false;
  }
};

const editConnection = (connection: ConnectionConfig) => {
  // Convert poll interval from ms to minutes for UI
  const config = { ...connection.config };
  if (config.pollInterval) {
    config.pollIntervalMinutes = Math.floor(config.pollInterval / 60000);
  }
  
  Object.assign(editingConnection, {
    ...connection,
    config,
    mapping: connection.mapping || []
  });
  
  showAddConnectionModal.value = true;
};

const saveConnection = async () => {
  saving.value = true;
  
  try {
    // Convert poll interval from minutes to ms
    if (editingConnection.config.pollIntervalMinutes) {
      editingConnection.config.pollInterval = editingConnection.config.pollIntervalMinutes * 60000;
    }
    
    const connection: Partial<ConnectionConfig> = {
      id: editingConnection.id || undefined,
      name: editingConnection.name,
      type: editingConnection.type,
      status: editingConnection.status,
      config: editingConnection.config,
      complianceLevel: editingConnection.complianceLevel,
      mapping: editingConnection.mapping
    };
    
    if (editingConnection.id) {
      await integrationStore.updateConnection(connection as ConnectionConfig);
    } else {
      await integrationStore.createConnection(connection as Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>);
    }
    
    showAddConnectionModal.value = false;
    await refreshConnections();
  } catch (error) {
    console.error('Error saving connection:', error);
    alert('Failed to save connection: ' + (error as Error).message);
  } finally {
    saving.value = false;
  }
};

const addMapping = () => {
  editingConnection.mapping.push({
    sourceField: '',
    targetField: '',
    required: false,
    complianceFlag: false
  });
};

const removeMapping = (index: number) => {
  editingConnection.mapping.splice(index, 1);
};

const copyWebhookUrl = () => {
  navigator.clipboard.writeText(webhookUrl.value);
  alert('Webhook URL copied to clipboard');
};

onMounted(async () => {
  await refreshConnections();
});
</script>