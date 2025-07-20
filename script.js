// 全局数据存储
let customerGroups = [];
let prompts = [];
let experiments = [];
let currentSection = 'dashboard';

// 客群数据模板
const customerGroupTemplates = [
    {
        id: 'eagle',
        name: '老鹰型',
        icon: 'fas fa-eagle',
        color: 'red',
        description: '决策果断，追求效率',
        characteristics: ['目标导向', '决策迅速', '注重结果', '时间敏感'],
        size: 1250,
        conversionRate: 0.85,
        adoptionRate: 0.82
    },
    {
        id: 'peacock',
        name: '孔雀型',
        icon: 'fas fa-feather',
        color: 'purple',
        description: '注重形象，喜欢展示',
        characteristics: ['社交活跃', '注重品牌', '喜欢分享', '追求时尚'],
        size: 980,
        conversionRate: 0.72,
        adoptionRate: 0.78
    },
    {
        id: 'dove',
        name: '鸽子型',
        icon: 'fas fa-dove',
        color: 'blue',
        description: '温和友善，重视关系',
        characteristics: ['关系导向', '温和友善', '重视服务', '忠诚度高'],
        size: 1420,
        conversionRate: 0.68,
        adoptionRate: 0.75
    },
    {
        id: 'owl',
        name: '猫头鹰型',
        icon: 'fas fa-owl',
        color: 'green',
        description: '理性分析，谨慎决策',
        characteristics: ['数据驱动', '理性分析', '谨慎决策', '重视细节'],
        size: 890,
        conversionRate: 0.79,
        adoptionRate: 0.73
    }
];

// 实验数据模板
const experimentTemplates = [
    {
        id: 'exp1',
        name: '老鹰型客群决策话术优化',
        customerGroup: 'eagle',
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-01-29',
        versionA: {
            name: 'A版本 - 直接型',
            adoptionRate: 0.78,
            conversionRate: 0.82,
            participants: 625
        },
        versionB: {
            name: 'B版本 - 效率型',
            adoptionRate: 0.823,
            conversionRate: 0.85,
            participants: 625
        },
        winner: 'B',
        improvement: 5.3
    },
    {
        id: 'exp2',
        name: '孔雀型客群互动话术测试',
        customerGroup: 'peacock',
        status: 'running',
        startDate: '2024-01-20',
        endDate: '2024-02-03',
        versionA: {
            name: 'A版本 - 社交型',
            adoptionRate: 0.76,
            conversionRate: 0.71,
            participants: 490
        },
        versionB: {
            name: 'B版本 - 品牌型',
            adoptionRate: 0.74,
            conversionRate: 0.73,
            participants: 490
        },
        winner: null,
        improvement: null
    },
    {
        id: 'exp3',
        name: '鸽子型客群服务话术优化',
        customerGroup: 'dove',
        status: 'planned',
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        versionA: {
            name: 'A版本 - 温情型',
            adoptionRate: null,
            conversionRate: null,
            participants: 710
        },
        versionB: {
            name: 'B版本 - 关怀型',
            adoptionRate: null,
            conversionRate: null,
            participants: 710
        },
        winner: null,
        improvement: null
    }
];

// 提示词模板
const promptTemplates = [
    {
        id: 'prompt1',
        name: '老鹰型决策话术模板',
        customerGroup: 'eagle',
        scenario: 'promotion',
        content: '针对追求效率的客户，直接展示产品核心价值和时间优势。强调"立即行动"、"限时优惠"、"快速解决"等关键词。',
        version: 'B',
        performance: 0.823,
        lastUpdated: '2024-01-29'
    },
    {
        id: 'prompt2',
        name: '孔雀型互动话术模板',
        customerGroup: 'peacock',
        scenario: 'introduction',
        content: '突出产品的品牌价值和社交属性，使用"独特"、"时尚"、"分享"等词汇。鼓励客户展示和分享使用体验。',
        version: 'A',
        performance: 0.76,
        lastUpdated: '2024-01-25'
    },
    {
        id: 'prompt3',
        name: '鸽子型服务话术模板',
        customerGroup: 'dove',
        scenario: 'consultation',
        content: '强调贴心服务和长期关系，使用温和友善的语调。重点介绍售后服务和客户关怀政策。',
        version: 'A',
        performance: 0.75,
        lastUpdated: '2024-01-20'
    },
    {
        id: 'prompt4',
        name: '猫头鹰型分析话术模板',
        customerGroup: 'owl',
        scenario: 'consultation',
        content: '提供详细的数据分析和对比信息，使用图表和具体数字。强调产品的技术优势和性价比。',
        version: 'A',
        performance: 0.73,
        lastUpdated: '2024-01-18'
    }
];

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    customerGroups = [...customerGroupTemplates];
    experiments = [...experimentTemplates];
    prompts = [...promptTemplates];
    
    showSection('dashboard');
    initializeCharts();
});

// 显示指定部分
function showSection(sectionName) {
    // 隐藏所有部分
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // 显示指定部分
    document.getElementById(sectionName).classList.remove('hidden');
    
    // 更新导航状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-700');
    });
    
    currentSection = sectionName;
    
    // 根据部分加载相应数据
    switch(sectionName) {
        case 'customer-groups':
            loadCustomerGroups();
            break;
        case 'prompts':
            loadPrompts();
            break;
        case 'ab-testing':
            loadExperiments();
            break;
        case 'analytics':
            updateCharts();
            loadAnalyticsTable();
            break;
    }
}

// 客群管理相关函数
function runClustering() {
    const progressContainer = document.getElementById('clustering-progress');
    const progressBar = document.getElementById('progress-bar');
    
    progressContainer.classList.remove('hidden');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                loadCustomerGroups();
                showNotification('聚类分析完成！已识别出4个客群类型', 'success');
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 300);
}

function loadCustomerGroups() {
    const container = document.getElementById('customer-groups-grid');
    container.innerHTML = '';
    
    customerGroups.forEach(group => {
        const card = createCustomerGroupCard(group);
        container.appendChild(card);
    });
}

function createCustomerGroupCard(group) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-md p-6 card-hover';
    
    const colorClasses = {
        red: 'text-red-600 bg-red-100',
        purple: 'text-purple-600 bg-purple-100',
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-600 bg-green-100'
    };
    
    div.innerHTML = `
        <div class="text-center mb-4">
            <div class="inline-flex items-center justify-center w-16 h-16 ${colorClasses[group.color]} rounded-full mb-3">
                <i class="${group.icon} text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900">${group.name}</h3>
            <p class="text-gray-600 text-sm">${group.description}</p>
        </div>
        
        <div class="space-y-3 mb-4">
            <div class="flex justify-between">
                <span class="text-gray-600">客群规模</span>
                <span class="font-semibold">${group.size.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">转化率</span>
                <span class="font-semibold text-green-600">${(group.conversionRate * 100).toFixed(1)}%</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">采纳率</span>
                <span class="font-semibold text-blue-600">${(group.adoptionRate * 100).toFixed(1)}%</span>
            </div>
        </div>
        
        <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">特征标签</h4>
            <div class="flex flex-wrap gap-1">
                ${group.characteristics.map(char => 
                    `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">${char}</span>`
                ).join('')}
            </div>
        </div>
        
        <button onclick="viewGroupDetails('${group.id}')" class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
            <i class="fas fa-eye mr-2"></i>查看详情
        </button>
    `;
    
    return div;
}

function viewGroupDetails(groupId) {
    const group = customerGroups.find(g => g.id === groupId);
    showNotification(`查看${group.name}详细信息`, 'info');
}

// 提示词管理相关函数
function loadPrompts() {
    const container = document.getElementById('prompts-list');
    container.innerHTML = '';
    
    prompts.forEach(prompt => {
        const item = createPromptItem(prompt);
        container.appendChild(item);
    });
}

function createPromptItem(prompt) {
    const div = document.createElement('div');
    div.className = 'p-6 hover:bg-gray-50 transition-colors';
    
    const group = customerGroups.find(g => g.id === prompt.customerGroup);
    const scenarioNames = {
        promotion: '促销推广',
        introduction: '产品介绍',
        consultation: '咨询服务',
        retention: '客户挽留'
    };
    
    div.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <div class="flex items-center mb-2">
                    <h4 class="text-lg font-medium text-gray-900">${prompt.name}</h4>
                    <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">v${prompt.version}</span>
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span><i class="${group.icon} mr-1"></i>${group.name}</span>
                    <span><i class="fas fa-tag mr-1"></i>${scenarioNames[prompt.scenario]}</span>
                    <span><i class="fas fa-chart-line mr-1"></i>${(prompt.performance * 100).toFixed(1)}%</span>
                </div>
                <p class="text-gray-700 text-sm">${prompt.content.substring(0, 100)}...</p>
                <p class="text-xs text-gray-500 mt-2">最后更新：${prompt.lastUpdated}</p>
            </div>
            <div class="flex space-x-2 ml-4">
                <button onclick="editPrompt('${prompt.id}')" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="duplicatePrompt('${prompt.id}')" class="text-green-600 hover:text-green-800">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="deletePrompt('${prompt.id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return div;
}

function createNewPrompt() {
    clearPromptForm();
    showNotification('请填写新提示词信息', 'info');
}

function editPrompt(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
        document.getElementById('prompt-name').value = prompt.name;
        document.getElementById('prompt-target').value = prompt.customerGroup;
        document.getElementById('prompt-scenario').value = prompt.scenario;
        document.getElementById('prompt-content').value = prompt.content;
        showNotification(`正在编辑：${prompt.name}`, 'info');
    }
}

function savePrompt() {
    const name = document.getElementById('prompt-name').value;
    const target = document.getElementById('prompt-target').value;
    const scenario = document.getElementById('prompt-scenario').value;
    const content = document.getElementById('prompt-content').value;
    
    if (!name || !target || !scenario || !content) {
        showNotification('请填写完整信息', 'error');
        return;
    }
    
    const newPrompt = {
        id: 'prompt' + Date.now(),
        name,
        customerGroup: target,
        scenario,
        content,
        version: 'A',
        performance: 0.5 + Math.random() * 0.3,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    prompts.push(newPrompt);
    loadPrompts();
    clearPromptForm();
    showNotification('提示词保存成功', 'success');
}

function testPrompt() {
    const content = document.getElementById('prompt-content').value;
    if (!content) {
        showNotification('请先输入提示词内容', 'error');
        return;
    }
    
    showNotification('正在测试提示词效果...', 'info');
    setTimeout(() => {
        showNotification('测试完成，预期采纳率：75.2%', 'success');
    }, 2000);
}

function clearPromptForm() {
    document.getElementById('prompt-form').reset();
}

function duplicatePrompt(promptId) {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
        const newPrompt = {
            ...prompt,
            id: 'prompt' + Date.now(),
            name: prompt.name + ' (副本)',
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        prompts.push(newPrompt);
        loadPrompts();
        showNotification('提示词复制成功', 'success');
    }
}

function deletePrompt(promptId) {
    if (confirm('确定要删除这个提示词吗？')) {
        prompts = prompts.filter(p => p.id !== promptId);
        loadPrompts();
        showNotification('提示词删除成功', 'success');
    }
}

// AB测试相关函数
function loadExperiments() {
    const container = document.getElementById('experiments-list');
    container.innerHTML = '';
    
    experiments.forEach(experiment => {
        const item = createExperimentItem(experiment);
        container.appendChild(item);
    });
}

function createExperimentItem(experiment) {
    const div = document.createElement('div');
    div.className = 'p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors';
    
    const group = customerGroups.find(g => g.id === experiment.customerGroup);
    const statusClasses = {
        completed: 'bg-green-100 text-green-800',
        running: 'bg-blue-100 text-blue-800',
        planned: 'bg-gray-100 text-gray-800'
    };
    const statusNames = {
        completed: '已完成',
        running: '进行中',
        planned: '计划中'
    };
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h4 class="text-lg font-medium text-gray-900">${experiment.name}</h4>
                <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span><i class="${group.icon} mr-1"></i>${group.name}</span>
                    <span><i class="fas fa-calendar mr-1"></i>${experiment.startDate} - ${experiment.endDate}</span>
                </div>
            </div>
            <span class="px-3 py-1 ${statusClasses[experiment.status]} text-sm rounded-full">
                ${statusNames[experiment.status]}
            </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <h5 class="font-medium text-gray-900 mb-2">${experiment.versionA.name}</h5>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                        <span>参与人数：</span>
                        <span>${experiment.versionA.participants || '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>采纳率：</span>
                        <span>${experiment.versionA.adoptionRate ? (experiment.versionA.adoptionRate * 100).toFixed(1) + '%' : '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>转化率：</span>
                        <span>${experiment.versionA.conversionRate ? (experiment.versionA.conversionRate * 100).toFixed(1) + '%' : '-'}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg ${experiment.winner === 'B' ? 'ring-2 ring-green-500' : ''}">
                <h5 class="font-medium text-gray-900 mb-2">
                    ${experiment.versionB.name}
                    ${experiment.winner === 'B' ? '<i class="fas fa-crown text-yellow-500 ml-2"></i>' : ''}
                </h5>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                        <span>参与人数：</span>
                        <span>${experiment.versionB.participants || '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>采纳率：</span>
                        <span>${experiment.versionB.adoptionRate ? (experiment.versionB.adoptionRate * 100).toFixed(1) + '%' : '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>转化率：</span>
                        <span>${experiment.versionB.conversionRate ? (experiment.versionB.conversionRate * 100).toFixed(1) + '%' : '-'}</span>
                    </div>
                </div>
            </div>
        </div>
        
        ${experiment.status === 'completed' && experiment.improvement ? 
            `<div class="bg-green-50 p-3 rounded-lg">
                <p class="text-green-800 text-sm">
                    <i class="fas fa-check-circle mr-2"></i>
                    实验完成！${experiment.winner}版本获胜，采纳率提升${experiment.improvement}%
                </p>
            </div>` : 
            experiment.status === 'running' ?
            `<div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-blue-800 text-sm">
                    <i class="fas fa-clock mr-2"></i>
                    实验进行中，预计还需${Math.ceil(Math.random() * 10)}天完成
                </p>
            </div>` :
            `<div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-gray-800 text-sm">
                    <i class="fas fa-calendar-plus mr-2"></i>
                    实验计划中，等待启动
                </p>
            </div>`
        }
        
        <div class="flex space-x-2 mt-4">
            <button onclick="viewExperimentDetails('${experiment.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                <i class="fas fa-eye mr-1"></i>查看详情
            </button>
            ${experiment.status === 'planned' ? 
                `<button onclick="startExperiment('${experiment.id}')" class="text-green-600 hover:text-green-800 text-sm">
                    <i class="fas fa-play mr-1"></i>启动实验
                </button>` : ''
            }
            ${experiment.status === 'running' ? 
                `<button onclick="stopExperiment('${experiment.id}')" class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-stop mr-1"></i>停止实验
                </button>` : ''
            }
        </div>
    `;
    
    return div;
}

function createNewExperiment() {
    showNotification('创建新实验功能开发中...', 'info');
}

function viewExperimentDetails(experimentId) {
    const experiment = experiments.find(e => e.id === experimentId);
    showNotification(`查看实验详情：${experiment.name}`, 'info');
}

function startExperiment(experimentId) {
    const experiment = experiments.find(e => e.id === experimentId);
    if (experiment) {
        experiment.status = 'running';
        loadExperiments();
        showNotification(`实验"${experiment.name}"已启动`, 'success');
    }
}

function stopExperiment(experimentId) {
    if (confirm('确定要停止这个实验吗？')) {
        const experiment = experiments.find(e => e.id === experimentId);
        if (experiment) {
            experiment.status = 'completed';
            loadExperiments();
            showNotification(`实验"${experiment.name}"已停止`, 'success');
        }
    }
}

// 话术生成相关函数
function generateScript() {
    const customerName = document.getElementById('customer-name').value;
    const customerAge = document.getElementById('customer-age').value;
    const customerJob = document.getElementById('customer-job').value;
    const customerIncome = document.getElementById('customer-income').value;
    const scenario = document.getElementById('communication-scenario').value;
    const requirements = document.getElementById('special-requirements').value;
    
    if (!customerName || !customerAge || !customerJob) {
        showNotification('请填写完整的客户信息', 'error');
        return;
    }
    
    // 根据客户信息判断客群类型
    let customerGroup = 'dove'; // 默认
    if (customerIncome === 'high' && customerJob.includes('高管')) {
        customerGroup = 'eagle';
    } else if (customerAge < 35 && customerIncome === 'high') {
        customerGroup = 'peacock';
    } else if (customerJob.includes('分析') || customerJob.includes('技术')) {
        customerGroup = 'owl';
    }
    
    const group = customerGroups.find(g => g.id === customerGroup);
    
    // 显示生成过程
    const resultContainer = document.getElementById('generation-result');
    resultContainer.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-cog fa-spin text-4xl text-blue-600 mb-4"></i>
            <p class="text-gray-600">正在分析客户特征...</p>
            <div class="mt-4">
                <div class="typing-animation text-sm text-blue-600">识别客群类型：${group.name}</div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        const scripts = generateScriptContent(customerGroup, scenario, customerName, requirements);
        displayGeneratedScripts(scripts, group);
    }, 3000);
}

function generateScriptContent(customerGroup, scenario, customerName, requirements) {
    const scriptTemplates = {
        eagle: {
            promotion: `${customerName}您好！我直接说重点：我们的产品能为您节省30%的时间成本，立即购买还有限时优惠。这个机会稍纵即逝，建议您现在就决定。`,
            introduction: `${customerName}，我知道您时间宝贵，所以直接介绍核心价值：这款产品专为高效人士设计，能让您的工作效率提升50%。`,
            consultation: `${customerName}，根据您的需求，我推荐最适合的解决方案。这个方案已经帮助1000+企业高管提升了决策效率。`,
            retention: `${customerName}，我们非常重视您这样的优质客户。为了挽留您，我们准备了专属的VIP服务方案。`
        },
        peacock: {
            promotion: `${customerName}您好！这款产品是今年最受欢迎的时尚选择，已经有很多成功人士在使用。分享到朋友圈还能获得额外优惠哦！`,
            introduction: `${customerName}，这款产品不仅功能强大，设计也非常时尚。很多像您这样有品味的客户都选择了它，而且经常在社交媒体上分享使用体验。`,
            consultation: `${customerName}，根据您的品味和需求，我特别推荐这个方案。它不仅实用，还能彰显您的独特品味。`,
            retention: `${customerName}，作为我们的忠实客户，您的意见对我们非常重要。我们希望继续为您提供最时尚、最优质的服务。`
        },
        dove: {
            promotion: `${customerName}您好！我们一直致力于为客户提供最贴心的服务。这次推广活动是为了回馈像您这样的忠实客户，希望能为您带来更好的体验。`,
            introduction: `${customerName}，我很高兴为您介绍这款产品。我们的团队花了很多心思来确保它能满足您的需求，并提供完善的售后服务。`,
            consultation: `${customerName}，我会耐心为您解答所有问题。我们的目标是建立长期的合作关系，确保您完全满意。`,
            retention: `${customerName}，您一直是我们珍贵的客户，我们真诚希望能继续为您服务。让我们一起找到解决方案。`
        },
        owl: {
            promotion: `${customerName}您好！根据数据分析，这款产品的性价比在同类产品中排名第一，投资回报率达到300%。详细的对比数据我可以发给您参考。`,
            introduction: `${customerName}，我为您准备了详细的产品技术规格和性能对比。从数据来看，这款产品在各项指标上都表现优异。`,
            consultation: `${customerName}，我会为您提供详细的分析报告和数据支持，帮助您做出最理性的决策。所有的技术细节我都可以详细解释。`,
            retention: `${customerName}，让我们用数据说话。根据您的使用情况分析，继续合作对双方都是最优选择。我可以提供详细的成本效益分析。`
        }
    };
    
    return scriptTemplates[customerGroup][scenario];
}

function displayGeneratedScripts(script, group) {
    const resultContainer = document.getElementById('generation-result');
    resultContainer.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center mb-4">
                <div class="p-2 rounded-full bg-${group.color === 'red' ? 'red' : group.color === 'purple' ? 'purple' : group.color === 'blue' ? 'blue' : 'green'}-100 text-${group.color === 'red' ? 'red' : group.color === 'purple' ? 'purple' : group.color === 'blue' ? 'blue' : 'green'}-600 mr-3">
                    <i class="${group.icon}"></i>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900">识别客群：${group.name}</h4>
                    <p class="text-sm text-gray-600">${group.description}</p>
                </div>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
                <h5 class="font-medium text-gray-900 mb-2">
                    <i class="fas fa-magic mr-2"></i>生成的话术
                </h5>
                <p class="text-gray-800 leading-relaxed">${script}</p>
            </div>
            
            <div class="flex space-x-2">
                <button onclick="adoptScript()" class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    <i class="fas fa-check mr-2"></i>采纳话术
                </button>
                <button onclick="regenerateScript()" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    <i class="fas fa-redo mr-2"></i>重新生成
                </button>
                <button onclick="copyScript()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>
    `;
}

function adoptScript() {
    showNotification('话术已采纳，数据已记录用于优化', 'success');
}

function regenerateScript() {
    generateScript();
}

function copyScript() {
    const scriptText = document.querySelector('#generation-result .bg-blue-50 p').textContent;
    navigator.clipboard.writeText(scriptText).then(() => {
        showNotification('话术已复制到剪贴板', 'success');
    });
}

// 数据分析相关函数
function initializeCharts() {
    // 采纳率趋势图
    const adoptionCtx = document.getElementById('adoptionChart');
    if (adoptionCtx) {
        new Chart(adoptionCtx, {
            type: 'line',
            data: {
                labels: ['1月1日', '1月8日', '1月15日', '1月22日', '1月29日'],
                datasets: [{
                    label: '采纳率',
                    data: [72, 75, 78, 81, 78.5],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 90
                    }
                }
            }
        });
    }
    
    // 转化率对比图
    const conversionCtx = document.getElementById('conversionChart');
    if (conversionCtx) {
        new Chart(conversionCtx, {
            type: 'bar',
            data: {
                labels: ['老鹰型', '孔雀型', '鸽子型', '猫头鹰型'],
                datasets: [{
                    label: '转化率 (%)',
                    data: [85, 72, 68, 79],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(147, 51, 234, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(34, 197, 94, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

function updateCharts() {
    // 图表更新逻辑
    initializeCharts();
}

function loadAnalyticsTable() {
    const tableBody = document.getElementById('analytics-table');
    if (!tableBody) return;
    
    const analyticsData = [
        { group: '老鹰型', version: 'B', adoption: 82.3, click: 76.8, conversion: 85.0, status: 'active' },
        { group: '孔雀型', version: 'A', adoption: 76.0, click: 71.2, conversion: 72.0, status: 'testing' },
        { group: '鸽子型', version: 'A', adoption: 75.0, click: 69.5, conversion: 68.0, status: 'planned' },
        { group: '猫头鹰型', version: 'A', adoption: 73.0, click: 70.1, conversion: 79.0, status: 'active' }
    ];
    
    tableBody.innerHTML = analyticsData.map(row => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${row.group}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">版本${row.version}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.adoption}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.click}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.conversion}%</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${row.status === 'active' ? 'bg-green-100 text-green-800' : 
                      row.status === 'testing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}">
                    ${row.status === 'active' ? '活跃' : row.status === 'testing' ? '测试中' : '计划中'}
                </span>
            </td>
        </tr>
    `).join('');
}

// 通用工具函数
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.className += ` ${colors[type]}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icons[type]} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}