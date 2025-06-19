<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ job.jobNumber }}</h2>
            <p class="text-primary-100">{{ job.partName }} - {{ job.customer }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="text-sm text-primary-100">Progress</div>
              <div class="text-xl font-bold">{{ progressPercentage }}%</div>
            </div>
            <button
              @click="$emit('close')"
              class="text-white hover:text-primary-200 transition-colors duration-200"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="w-full bg-primary-800 rounded-full h-2">
            <div 
              class="bg-white h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-sm text-primary-100 mt-1">
            <span>{{ job.completedQuantity }}/{{ job.quantity }} parts</span>
            <span>{{ job.actualHours }}/{{ job.estimatedHours }} hours</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="activeTab === tab.id 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
          >
            <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto" style="max-height: calc(95vh - 200px);">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Job Details -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Basic Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-500">Part Number</label>
                    <p class="font-medium text-gray-900">{{ job.partNumber }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Customer</label>
                    <p class="font-medium text-gray-900">{{ job.customer }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Due Date</label>
                    <p class="font-medium text-gray-900">{{ formatDate(job.dueDate) }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Priority</label>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="priorityClasses[job.priority]"
                    >
                      {{ job.priority.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Current Status -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-500">Status</label>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="statusClasses[job.status]"
                    >
                      {{ formatStatus(job.status) }}
                    </span>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Current Operation</label>
                    <p class="font-medium text-gray-900">{{ currentOperation?.name || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Machine</label>
                    <p class="font-medium text-gray-900">{{ job.machine || 'Unassigned' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-500">Operator</label>
                    <p class="font-medium text-gray-900">{{ job.operator || 'Unassigned' }}</p>
                  </div>
                </div>
              </div>

              <!-- Materials -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Materials</h3>
                <div class="space-y-3">
                  <div
                    v-for="material in job.materials"
                    :key="material.id"
                    class="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div>
                      <p class="font-medium text-gray-900">{{ material.material }}</p>
                      <p class="text-sm text-gray-600">{{ material.specification }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-gray-900">{{ material.quantity }} {{ material.unit }}</p>
                      <span 
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="material.received ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ material.received ? 'Received' : 'Pending' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Quick Actions -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div class="space-y-2">
                  <button
                    v-if="canUpdateStatus"
                    @click="showStatusModal = true"
                    class="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Update Status
                  </button>
                  <button
                    @click="showQuantityModal = true"
                    class="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Update Quantity
                  </button>
                  <button
                    @click="addNote"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              <!-- Quality Requirements -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Quality Requirements</h3>
                <div class="space-y-2">
                  <div
                    v-for="req in job.qualityRequirements.slice(0, 3)"
                    :key="req.id"
                    class="p-2 bg-white rounded border text-sm"
                  >
                    <p class="font-medium text-gray-900">{{ req.feature }}</p>
                    <p class="text-gray-600">{{ req.specification }}</p>
                    <p class="text-xs text-gray-500">{{ req.tolerance }}</p>
                  </div>
                  <button
                    v-if="job.qualityRequirements.length > 3"
                    @click="activeTab = 'quality'"
                    class="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View all {{ job.qualityRequirements.length }} requirements
                  </button>
                </div>
              </div>

              <!-- Drawings -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Drawings</h3>
                <div class="space-y-2">
                  <div
                    v-for="drawing in job.drawings"
                    :key="drawing.id"
                    class="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ drawing.name }}</p>
                      <p class="text-xs text-gray-500">Rev {{ drawing.revision }}</p>
                    </div>
                    <button
                      @click="viewDrawing(drawing)"
                      class="text-primary-600 hover:text-primary-700"
                    >
                      <DocumentIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Operations Tab -->
        <div v-if="activeTab === 'operations'" class="p-6">
          <div class="space-y-6">
            <div
              v-for="operation in job.operations"
              :key="operation.id"
              class="bg-white border border-gray-200 rounded-lg p-6"
            >
              <!-- Operation Header -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Op {{ operation.operationNumber }}: {{ operation.name }}
                  </h3>
                  <p class="text-gray-600">{{ operation.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getOperationStatusClass(operation.status)"
                  >
                    {{ formatStatus(operation.status) }}
                  </span>
                  <button
                    v-if="operation.status === 'pending'"
                    @click="startOperation(operation)"
                    class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                  >
                    Start
                  </button>
                  <button
                    v-else-if="operation.status === 'running'"
                    @click="completeOperation(operation)"
                    class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    Complete
                  </button>
                </div>
              </div>

              <!-- Operation Details -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label class="text-sm text-gray-500">Work Center</label>
                  <p class="font-medium text-gray-900">{{ operation.workCenter }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Setup Time</label>
                  <p class="font-medium text-gray-900">{{ operation.setupTime }} min</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Cycle Time</label>
                  <p class="font-medium text-gray-900">{{ operation.cycleTime }} min</p>
                </div>
              </div>

              <!-- Progress -->
              <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{{ operation.completedQuantity }}/{{ job.quantity }} parts</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(operation.completedQuantity / job.quantity) * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- Instructions -->
              <div v-if="operation.instructions.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Instructions</h4>
                <ul class="space-y-1">
                  <li
                    v-for="instruction in operation.instructions"
                    :key="instruction"
                    class="text-sm text-gray-700 flex items-start space-x-2"
                  >
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{{ instruction }}</span>
                  </li>
                </ul>
              </div>

              <!-- Tooling -->
              <div v-if="operation.tooling.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Required Tooling</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tool in operation.tooling"
                    :key="tool"
                    class="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs"
                  >
                    {{ tool }}
                  </span>
                </div>
              </div>

              <!-- Programs -->
              <div v-if="operation.programs.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">CNC Programs</h4>
                <div class="space-y-2">
                  <div
                    v-for="programId in operation.programs"
                    :key="programId"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span class="text-sm font-medium text-gray-900">{{ getProgramName(programId) }}</span>
                    <button
                      @click="loadProgram(programId)"
                      class="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Load to DNC
                    </button>
                  </div>
                </div>
              </div>

              <!-- Quality Checks -->
              <div v-if="operation.qualityChecks.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Quality Checks</h4>
                <div class="space-y-2">
                  <div
                    v-for="check in operation.qualityChecks"
                    :key="check.id"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getQualityRequirement(check.requirementId)?.feature }}</p>
                      <p class="text-xs text-gray-600">{{ check.inspector }} - {{ formatDateTime(check.timestamp) }}</p>
                    </div>
                    <span 
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="getQualityResultClass(check.result)"
                    >
                      {{ check.result.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Operation Notes -->
              <div v-if="operation.notes" class="p-3 bg-blue-50 rounded">
                <p class="text-sm text-blue-800">{{ operation.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- DNC Programs Tab -->
        <div v-if="activeTab === 'dnc'" class="p-6">
          <div class="space-y-6">
            <div
              v-for="program in job.dncPrograms"
              :key="program.id"
              class="bg-white border border-gray-200 rounded-lg p-6"
            >
              <!-- Program Header -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ program.programNumber }}</h3>
                  <p class="text-gray-600">{{ program.name }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getProgramStatusClass(program.status)"
                  >
                    {{ program.status.toUpperCase() }}
                  </span>
                  <button
                    @click="downloadProgram(program)"
                    class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    Download
                  </button>
                  <button
                    @click="sendToDNC(program)"
                    class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                  >
                    Send to DNC
                  </button>
                </div>
              </div>

              <!-- Program Details -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label class="text-sm text-gray-500">Version</label>
                  <p class="font-medium text-gray-900">{{ program.version }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Machine</label>
                  <p class="font-medium text-gray-900">{{ program.machine }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Est. Run Time</label>
                  <p class="font-medium text-gray-900">{{ program.estimatedRunTime }} min</p>
                </div>
              </div>

              <!-- Tool List -->
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Tool List</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">T#</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diameter</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Length</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="tool in program.toolList"
                        :key="tool.id"
                        class="hover:bg-gray-50"
                      >
                        <td class="px-3 py-2 text-sm font-medium text-gray-900">T{{ tool.toolNumber }}</td>
                        <td class="px-3 py-2 text-sm text-gray-900">{{ tool.description }}</td>
                        <td class="px-3 py-2 text-sm text-gray-900">{{ tool.diameter }}"</td>
                        <td class="px-3 py-2 text-sm text-gray-900">{{ tool.length }}"</td>
                        <td class="px-3 py-2">
                          <span 
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            :class="getToolStatusClass(tool.status)"
                          >
                            {{ tool.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Program Parameters -->
              <div v-if="program.parameters.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Parameters</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    v-for="param in program.parameters"
                    :key="param.name"
                    class="p-2 bg-gray-50 rounded"
                  >
                    <p class="text-xs text-gray-500">{{ param.name }}</p>
                    <p class="text-sm font-medium text-gray-900">{{ param.value }} {{ param.unit }}</p>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-700">{{ program.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quality Tab -->
        <div v-if="activeTab === 'quality'" class="p-6">
          <div class="space-y-6">
            <div
              v-for="requirement in job.qualityRequirements"
              :key="requirement.id"
              class="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ requirement.feature }}</h3>
                  <p class="text-gray-600">{{ requirement.specification }}</p>
                </div>
                <button
                  @click="performQualityCheck(requirement.id)"
                  class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                >
                  Perform Check
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label class="text-sm text-gray-500">Tolerance</label>
                  <p class="font-medium text-gray-900">{{ requirement.tolerance }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Method</label>
                  <p class="font-medium text-gray-900">{{ requirement.inspectionMethod }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Frequency</label>
                  <p class="font-medium text-gray-900">{{ requirement.frequency }}</p>
                </div>
              </div>

              <!-- Recent Checks -->
              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-900">Recent Checks</h4>
                <div
                  v-for="check in getQualityChecks(requirement.id)"
                  :key="check.id"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ check.inspector }}</p>
                    <p class="text-xs text-gray-600">{{ formatDateTime(check.timestamp) }}</p>
                  </div>
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getQualityResultClass(check.result)"
                  >
                    {{ check.result.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div v-if="activeTab === 'history'" class="p-6">
          <div class="space-y-4">
            <div
              v-for="entry in job.history"
              :key="entry.id"
              class="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getHistoryIconClass(entry.action)"
                >
                  <component :is="getHistoryIcon(entry.action)" class="w-4 h-4" />
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">{{ formatHistoryAction(entry.action) }}</p>
                  <span class="text-xs text-gray-500">{{ formatDateTime(entry.timestamp) }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ entry.userName }}</p>
                <div v-if="entry.field" class="mt-1">
                  <span class="text-xs text-gray-500">{{ entry.field }}:</span>
                  <span class="text-xs text-red-600 line-through ml-1">{{ entry.oldValue }}</span>
                  <span class="text-xs text-green-600 ml-1">{{ entry.newValue }}</span>
                </div>
                <p v-if="entry.notes" class="text-sm text-gray-700 mt-1">{{ entry.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Update Job Status</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              v-model="statusUpdate.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="pending">Pending</option>
              <option value="setup">Setup</option>
              <option value="running">Running</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              v-model="statusUpdate.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add notes about this status change..."
            ></textarea>
          </div>
        </div>
        <div class="flex space-x-3 mt-6">
          <button
            @click="confirmStatusUpdate"
            class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Update Status
          </button>
          <button
            @click="showStatusModal = false"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Quantity Update Modal -->
    <div v-if="showQuantityModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Update Completed Quantity</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Completed Quantity</label>
            <input
              v-model.number="quantityUpdate.completed"
              type="number"
              :max="job.quantity"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <p class="text-xs text-gray-500 mt-1">Total quantity: {{ job.quantity }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              v-model="quantityUpdate.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add notes about this quantity update..."
            ></textarea>
          </div>
        </div>
        <div class="flex space-x-3 mt-6">
          <button
            @click="confirmQuantityUpdate"
            class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
          >
            Update Quantity
          </button>
          <button
            @click="showQuantityModal = false"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import type { Job, JobOperation, DNCProgram, QualityRequirement, QualityCheck, JobHistoryEntry } from '../types';
import { useAuthStore } from '../stores/auth';
import { useJobsStore } from '../stores/jobs';
import {
  XMarkIcon,
  DocumentIcon,
  ClipboardDocumentListIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  ClockIcon,
  PlayIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CogIcon
} from '@heroicons/vue/24/outline';

interface Props {
  job: Job;
}

const props = defineProps<Props>();
const authStore = useAuthStore();
const jobsStore = useJobsStore();

defineEmits<{
  close: [];
}>();

const activeTab = ref('overview');
const showStatusModal = ref(false);
const showQuantityModal = ref(false);

const statusUpdate = ref({
  status: props.job.status,
  notes: ''
});

const quantityUpdate = ref({
  completed: props.job.completedQuantity,
  notes: ''
});

const tabs = [
  { id: 'overview', name: 'Overview', icon: ClipboardDocumentListIcon },
  { id: 'operations', name: 'Operations', icon: CogIcon },
  { id: 'dnc', name: 'DNC Programs', icon: CodeBracketIcon },
  { id: 'quality', name: 'Quality', icon: ShieldCheckIcon },
  { id: 'history', name: 'History', icon: ClockIcon }
];

const progressPercentage = computed(() => 
  Math.round((props.job.completedQuantity / props.job.quantity) * 100)
);

const currentOperation = computed(() => 
  props.job.operations.find(op => op.status === 'running') || 
  props.job.operations.find(op => op.status === 'setup')
);

const canUpdateStatus = computed(() => 
  ['operator', 'lead', 'supervisor', 'manager', 'admin'].includes(authStore.user?.role || '')
);

const statusClasses = {
  'pending': 'bg-gray-100 text-gray-800',
  'setup': 'bg-purple-100 text-purple-800',
  'running': 'bg-green-100 text-green-800',
  'on-hold': 'bg-red-100 text-red-800',
  'completed': 'bg-blue-100 text-blue-800'
};

const priorityClasses = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'high': 'bg-orange-100 text-orange-800',
  'urgent': 'bg-red-100 text-red-800'
};

const formatStatus = (status: string) => {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

const getOperationStatusClass = (status: string) => {
  return statusClasses[status as keyof typeof statusClasses] || statusClasses.pending;
};

const getProgramStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'archived': 'bg-gray-100 text-gray-800',
    'development': 'bg-yellow-100 text-yellow-800'
  };
  return classes[status as keyof typeof classes] || classes.active;
};

const getToolStatusClass = (status: string) => {
  const classes = {
    'available': 'bg-green-100 text-green-800',
    'in-use': 'bg-blue-100 text-blue-800',
    'maintenance': 'bg-yellow-100 text-yellow-800',
    'broken': 'bg-red-100 text-red-800'
  };
  return classes[status as keyof typeof classes] || classes.available;
};

const getQualityResultClass = (result: string) => {
  const classes = {
    'pass': 'bg-green-100 text-green-800',
    'fail': 'bg-red-100 text-red-800',
    'rework': 'bg-yellow-100 text-yellow-800'
  };
  return classes[result as keyof typeof classes] || classes.pass;
};

const getHistoryIconClass = (action: string) => {
  const classes = {
    'created': 'bg-blue-100 text-blue-600',
    'status-changed': 'bg-purple-100 text-purple-600',
    'operation-started': 'bg-green-100 text-green-600',
    'operation-completed': 'bg-blue-100 text-blue-600',
    'quantity-updated': 'bg-orange-100 text-orange-600',
    'notes-added': 'bg-gray-100 text-gray-600',
    'program-updated': 'bg-indigo-100 text-indigo-600',
    'quality-check': 'bg-yellow-100 text-yellow-600',
    'rework-required': 'bg-red-100 text-red-600'
  };
  return classes[action as keyof typeof classes] || classes.created;
};

const getHistoryIcon = (action: string) => {
  const icons = {
    'created': PlayIcon,
    'status-changed': CogIcon,
    'operation-started': PlayIcon,
    'operation-completed': CheckIcon,
    'quantity-updated': ClipboardDocumentListIcon,
    'notes-added': DocumentIcon,
    'program-updated': CodeBracketIcon,
    'quality-check': ShieldCheckIcon,
    'rework-required': ExclamationTriangleIcon
  };
  return icons[action as keyof typeof icons] || UserIcon;
};

const formatHistoryAction = (action: string) => {
  return action.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getProgramName = (programId: string) => {
  const program = props.job.dncPrograms.find(p => p.id === programId);
  return program ? program.programNumber : programId;
};

const getQualityRequirement = (requirementId: string) => {
  return props.job.qualityRequirements.find(req => req.id === requirementId);
};

const getQualityChecks = (requirementId: string) => {
  return props.job.operations
    .flatMap(op => op.qualityChecks)
    .filter(check => check.requirementId === requirementId)
    .slice(0, 3);
};

const startOperation = (operation: JobOperation) => {
  console.log('Starting operation:', operation.id);
  // Implementation would update operation status
};

const completeOperation = (operation: JobOperation) => {
  console.log('Completing operation:', operation.id);
  // Implementation would update operation status
};

const loadProgram = (programId: string) => {
  console.log('Loading program to DNC:', programId);
  // Implementation would send program to DNC system
};

const downloadProgram = (program: DNCProgram) => {
  console.log('Downloading program:', program.programNumber);
  // Implementation would download program file
};

const sendToDNC = (program: DNCProgram) => {
  console.log('Sending program to DNC:', program.programNumber);
  // Implementation would send program to DNC system
};

const performQualityCheck = (requirementId: string) => {
  console.log('Performing quality check:', requirementId);
  // Implementation would open quality check interface
};

const viewDrawing = (drawing: any) => {
  console.log('Viewing drawing:', drawing.name);
  // Implementation would open drawing viewer
};

const addNote = () => {
  console.log('Adding note to job');
  // Implementation would open note interface
};

const confirmStatusUpdate = async () => {
  await jobsStore.updateJobStatus(props.job.id, statusUpdate.value.status, statusUpdate.value.notes);
  showStatusModal.value = false;
};

const confirmQuantityUpdate = async () => {
  await jobsStore.updateJobProgress(props.job.id, quantityUpdate.value.completed);
  showQuantityModal.value = false;
};
</script>