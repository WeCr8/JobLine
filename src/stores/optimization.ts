import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  PartSimilarity, 
  SetupOptimization, 
  ProductionTrend, 
  VoiceNote, 
  MediaUpload,
  QualityInsight,
  EngineeringAlert,
  OptimizationSuggestion
} from '../types/optimization';

export const useOptimizationStore = defineStore('optimization', () => {
  const partSimilarities = ref<PartSimilarity[]>([]);
  const setupOptimizations = ref<SetupOptimization[]>([]);
  const productionTrends = ref<ProductionTrend[]>([]);
  const voiceNotes = ref<VoiceNote[]>([]);
  const mediaUploads = ref<MediaUpload[]>([]);
  const qualityInsights = ref<QualityInsight[]>([]);
  const engineeringAlerts = ref<EngineeringAlert[]>([]);
  const loading = ref(false);

  // Mock data for demonstration
  const mockPartSimilarities: PartSimilarity[] = [
    {
      id: '1',
      partNumber: 'PN-12345',
      partName: 'Hydraulic Cylinder Housing',
      material: 'Aluminum 6061',
      dimensions: { length: 150, width: 100, height: 75 },
      machineType: 'CNC Mill',
      fixtureType: 'Vise',
      setupTime: 45,
      cycleTime: 25,
      tooling: ['1/2" End Mill', '1/4" Drill', 'M6 Tap'],
      operations: ['Face', 'Bore', 'Tap'],
      similarityScore: 0.95,
      groupId: 'group-1'
    },
    {
      id: '2',
      partNumber: 'PN-67890',
      partName: 'Cylinder Housing Variant',
      material: 'Aluminum 6061',
      dimensions: { length: 155, width: 105, height: 80 },
      machineType: 'CNC Mill',
      fixtureType: 'Vise',
      setupTime: 50,
      cycleTime: 28,
      tooling: ['1/2" End Mill', '1/4" Drill', 'M6 Tap'],
      operations: ['Face', 'Bore', 'Tap'],
      similarityScore: 0.92,
      groupId: 'group-1'
    }
  ];

  const mockSetupOptimizations: SetupOptimization[] = [
    {
      id: '1',
      jobId: '1',
      currentSetupTime: 45,
      optimizedSetupTime: 25,
      timeSavings: 20,
      confidence: 0.85,
      implementationDifficulty: 'medium',
      estimatedROI: 2500,
      suggestions: [
        {
          type: 'fixture',
          title: 'Use Dedicated Fixture',
          description: 'Create a dedicated fixture for this part family to eliminate individual part alignment',
          impact: 'high',
          timeSavings: 15,
          costSavings: 1800,
          implementation: 'Design and manufacture custom fixture',
          relatedParts: ['PN-12345', 'PN-67890']
        },
        {
          type: 'tooling',
          title: 'Pre-set Tool Package',
          description: 'Create a pre-set tool package for this operation sequence',
          impact: 'medium',
          timeSavings: 5,
          costSavings: 700,
          implementation: 'Organize tools in preset holder'
        }
      ],
      createdAt: '2024-01-12T10:00:00Z'
    }
  ];

  const mockProductionTrends: ProductionTrend[] = [
    {
      id: '1',
      metric: 'efficiency',
      period: 'daily',
      data: [
        { date: '2024-01-08', value: 82, target: 85, variance: -3 },
        { date: '2024-01-09', value: 84, target: 85, variance: -1 },
        { date: '2024-01-10', value: 87, target: 85, variance: 2 },
        { date: '2024-01-11', value: 89, target: 85, variance: 4 },
        { date: '2024-01-12', value: 91, target: 85, variance: 6 }
      ],
      trend: 'improving',
      changePercent: 10.9,
      insights: [
        'Efficiency has improved 11% over the past week',
        'New fixture implementation showing positive results',
        'Operator training program contributing to gains'
      ]
    }
  ];

  const mockQualityInsights: QualityInsight[] = [
    {
      id: '1',
      partNumber: 'PN-12345',
      issueType: 'Dimensional Variance',
      frequency: 3,
      impact: 'medium',
      rootCause: 'Tool wear on operation 3',
      recommendations: [
        'Implement tool wear monitoring',
        'Reduce feed rate on final pass',
        'Add mid-process inspection'
      ],
      trend: 'decreasing',
      relatedJobs: ['J2024-001', 'J2024-003']
    }
  ];

  const mockEngineeringAlerts: EngineeringAlert[] = [
    {
      id: '1',
      type: 'process-improvement',
      priority: 'medium',
      title: 'Setup Time Optimization Opportunity',
      description: 'AI analysis suggests 44% setup time reduction possible for part family PF-001',
      affectedParts: ['PN-12345', 'PN-67890'],
      status: 'open',
      dueDate: '2024-01-20',
      attachments: [],
      createdAt: '2024-01-12T09:00:00Z',
      updatedAt: '2024-01-12T09:00:00Z'
    }
  ];

  const fetchPartSimilarities = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    partSimilarities.value = mockPartSimilarities;
    loading.value = false;
  };

  const fetchSetupOptimizations = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 600));
    setupOptimizations.value = mockSetupOptimizations;
    loading.value = false;
  };

  const fetchProductionTrends = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    productionTrends.value = mockProductionTrends;
    loading.value = false;
  };

  const fetchQualityInsights = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    qualityInsights.value = mockQualityInsights;
    loading.value = false;
  };

  const fetchEngineeringAlerts = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    engineeringAlerts.value = mockEngineeringAlerts;
    loading.value = false;
  };

  const analyzePartSimilarity = async (partNumber: string): Promise<PartSimilarity[]> => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    return partSimilarities.value.filter(p => p.partNumber !== partNumber);
  };

  const generateSetupOptimization = async (jobId: string): Promise<SetupOptimization> => {
    // Simulate AI optimization analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const optimization: SetupOptimization = {
      id: Date.now().toString(),
      jobId,
      currentSetupTime: 60,
      optimizedSetupTime: 35,
      timeSavings: 25,
      confidence: 0.78,
      implementationDifficulty: 'medium',
      estimatedROI: 3200,
      suggestions: [
        {
          type: 'batching',
          title: 'Batch Similar Parts',
          description: 'Group similar parts together to minimize setup changes',
          impact: 'high',
          timeSavings: 20,
          costSavings: 2400,
          implementation: 'Schedule similar parts consecutively'
        }
      ],
      createdAt: new Date().toISOString()
    };

    setupOptimizations.value.unshift(optimization);
    return optimization;
  };

  const addVoiceNote = async (note: Omit<VoiceNote, 'id' | 'createdAt'>) => {
    const newNote: VoiceNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    voiceNotes.value.unshift(newNote);
  };

  const addMediaUpload = async (upload: Omit<MediaUpload, 'id' | 'createdAt'>) => {
    const newUpload: MediaUpload = {
      ...upload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    mediaUploads.value.unshift(newUpload);
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // Simulate speech-to-text API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock transcription responses
    const mockTranscriptions = [
      "Job 2024-001 is running smoothly, completed 15 parts so far",
      "Quality issue detected on part number PN-12345, dimension out of tolerance",
      "Machine CNC-001 making unusual noise during spindle operation",
      "Setup complete for job 2024-002, ready to start production",
      "Tool change required on station 3, current tool showing wear"
    ];
    
    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  };

  // Computed properties
  const partFamilies = computed(() => {
    const families: Record<string, PartSimilarity[]> = {};
    partSimilarities.value.forEach(part => {
      const groupId = part.groupId || 'ungrouped';
      if (!families[groupId]) families[groupId] = [];
      families[groupId].push(part);
    });
    return families;
  });

  const totalTimeSavings = computed(() => 
    setupOptimizations.value.reduce((total, opt) => total + opt.timeSavings, 0)
  );

  const totalCostSavings = computed(() => 
    setupOptimizations.value.reduce((total, opt) => total + opt.estimatedROI, 0)
  );

  const criticalQualityIssues = computed(() => 
    qualityInsights.value.filter(insight => insight.impact === 'high')
  );

  const openEngineeringAlerts = computed(() => 
    engineeringAlerts.value.filter(alert => alert.status === 'open')
  );

  return {
    partSimilarities,
    setupOptimizations,
    productionTrends,
    voiceNotes,
    mediaUploads,
    qualityInsights,
    engineeringAlerts,
    loading,
    partFamilies,
    totalTimeSavings,
    totalCostSavings,
    criticalQualityIssues,
    openEngineeringAlerts,
    fetchPartSimilarities,
    fetchSetupOptimizations,
    fetchProductionTrends,
    fetchQualityInsights,
    fetchEngineeringAlerts,
    analyzePartSimilarity,
    generateSetupOptimization,
    addVoiceNote,
    addMediaUpload,
    transcribeAudio
  };
});