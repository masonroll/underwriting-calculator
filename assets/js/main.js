/**
 * Real Estate Underwriting Calculator - Main JavaScript
 * All financial calculations and UI interactions
 */

// Global state
let deals = [];
let currentDeal = null;
let cashflowChart = null;
let comparisonChart = null;
let currentUser = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication and load user
    initializeAuth();
    loadDeals();
    renderDashboard();
    setupFormHandlers();
    initializeCharts();
});

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Initialize authentication and display user info
 */
function initializeAuth() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userStr);
    
    // Display user name in navigation
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = `Welcome, ${currentUser.name}`;
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// ============================================
// VIEW MANAGEMENT
// ============================================

function showView(viewName) {
    console.log('showView called with:', viewName);
    
    try {
        // Hide all views
        const allViews = document.querySelectorAll('.view-container');
        console.log('Found views:', allViews.length);
        allViews.forEach(view => {
            view.classList.add('hidden');
        });
        
        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        console.log('Target view element:', targetView);
        
        if (!targetView) {
            console.error(`View not found: ${viewName}-view`);
            return;
        }
        
        targetView.classList.remove('hidden');
        
        // Update navigation - find the active link by matching the viewName
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('border-white', 'text-white');
            link.classList.add('border-transparent', 'text-gray-300');
            
            // Check if this link's onclick matches the current view
            const onclick = link.getAttribute('onclick');
            if (onclick && onclick.includes(`'${viewName}'`)) {
                link.classList.remove('border-transparent', 'text-gray-300');
                link.classList.add('border-white', 'text-white');
            }
        });
        
        // Refresh view-specific data
        if (viewName === 'dashboard') {
            renderDashboard();
        } else if (viewName === 'analytics') {
            renderAnalytics();
        }
        
        console.log('View switched successfully to:', viewName);
    } catch (error) {
        console.error('Error in showView:', error);
    }
}

// Make sure critical functions are accessible globally from inline onclick handlers
window.showView = showView;

// ============================================
// LOCAL STORAGE MANAGEMENT (User-specific)
// ============================================

function getUserStorageKey() {
    if (!currentUser) return 'underwriting_deals';
    return `underwriting_deals_${currentUser.id}`;
}

function loadDeals() {
    const storageKey = getUserStorageKey();
    const stored = localStorage.getItem(storageKey);
    if (stored) {
        deals = JSON.parse(stored);
    }
}

function saveDeals() {
    const storageKey = getUserStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(deals));
}

function saveDeal(dealData) {
    const deal = {
        id: Date.now(),
        userId: currentUser ? currentUser.id : null,
        createdAt: new Date().toISOString(),
        ...dealData
    };
    deals.push(deal);
    saveDeals();
    return deal;
}

function deleteDeal(dealId) {
    deals = deals.filter(d => d.id !== dealId);
    saveDeals();
    renderDashboard();
}

// ============================================
// DASHBOARD RENDERING
// ============================================

function renderDashboard() {
    const grid = document.getElementById('deals-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (deals.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    grid.innerHTML = deals.map(deal => `
        <div class="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="text-base font-semibold text-gray-900">${deal.propertyName}</h3>
                    <p class="text-xs text-gray-500">${deal.address}</p>
                </div>
                <span class="px-2 py-0.5 bg-navy text-white text-xs rounded">${deal.propertyType}</span>
            </div>
            
            <div class="space-y-1.5 mb-3">
                <div class="flex justify-between text-xs">
                    <span class="text-gray-600">Purchase Price:</span>
                    <span class="font-semibold">${formatCurrency(deal.purchasePrice)}</span>
                </div>
                <div class="flex justify-between text-xs">
                    <span class="text-gray-600">Cap Rate:</span>
                    <span class="font-semibold text-navy">${deal.metrics?.capRate || 'N/A'}</span>
                </div>
                <div class="flex justify-between text-xs">
                    <span class="text-gray-600">Cash-on-Cash:</span>
                    <span class="font-semibold text-navy">${deal.metrics?.coc || 'N/A'}</span>
                </div>
                <div class="flex justify-between text-xs">
                    <span class="text-gray-600">Monthly Cash Flow:</span>
                    <span class="font-semibold ${deal.metrics?.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}">
                        ${formatCurrency(deal.metrics?.monthlyCashFlow || 0)}
                    </span>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button onclick="viewDeal(${deal.id})" class="flex-1 px-3 py-1.5 bg-navy text-white text-xs rounded hover:bg-navy-dark">
                    View Details
                </button>
                <button onclick="deleteDeal(${deal.id})" class="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function viewDeal(dealId) {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;
    
    // Populate form with deal data
    currentDeal = deal;
    populateFormWithDeal(deal);
    showView('add-deal');
    
    // Show results if metrics exist
    if (deal.metrics) {
        displayResults(deal.metrics);
    }
}

function populateFormWithDeal(deal) {
    document.getElementById('property-name').value = deal.propertyName || '';
    document.getElementById('address').value = deal.address || '';
    document.getElementById('property-type').value = deal.propertyType || 'Single Family';
    document.getElementById('sqft').value = deal.sqft || '';
    document.getElementById('purchase-price').value = deal.purchasePrice || 0;
    document.getElementById('rehab-costs').value = deal.rehabCosts || 0;
    document.getElementById('closing-cost-percent').value = deal.closingCostPercent || 3;
    document.getElementById('closing-costs').value = deal.closingCosts || 0;
    document.getElementById('arv').value = deal.arv || 0;
    document.getElementById('down-payment').value = deal.downPayment || 0;
    document.getElementById('loan-amount').value = deal.loanAmount || 0;
    
    // Update calculated fields
    updateClosingCosts();
    updatePricePerSqft();
    updateLoanAmount();
    document.getElementById('interest-rate').value = deal.interestRate || 6.5;
    document.getElementById('loan-term').value = deal.loanTerm || 30;
    document.getElementById('monthly-rent').value = deal.monthlyRent || 0;
    document.getElementById('other-income').value = deal.otherIncome || 0;
    document.getElementById('vacancy-rate').value = deal.vacancyRate || 5;
    document.getElementById('property-tax').value = deal.propertyTax || 0;
    document.getElementById('insurance').value = deal.insurance || 0;
    document.getElementById('maintenance').value = deal.maintenance || 0;
    document.getElementById('hoa').value = deal.hoa || 0;
    document.getElementById('mgmt-fee').value = deal.mgmtFee || 8;
    document.getElementById('sale-price').value = deal.salePrice || 0;
    document.getElementById('exit-cap-rate').value = deal.exitCapRate || 6.5;
    document.getElementById('holding-period').value = deal.holdingPeriod || 5;
}

// ============================================
// FORM HANDLING
// ============================================

function setupFormHandlers() {
    const form = document.getElementById('deal-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            propertyName: document.getElementById('property-name').value,
            address: document.getElementById('address').value,
            propertyType: document.getElementById('property-type').value,
            sqft: parseFloat(document.getElementById('sqft').value) || 0,
            purchasePrice: parseFloat(document.getElementById('purchase-price').value) || 0,
            rehabCosts: parseFloat(document.getElementById('rehab-costs').value) || 0,
            closingCostPercent: parseFloat(document.getElementById('closing-cost-percent').value) || 3,
            closingCosts: parseFloat(document.getElementById('closing-costs').value) || 0,
            arv: parseFloat(document.getElementById('arv').value) || 0,
            downPayment: parseFloat(document.getElementById('down-payment').value) || 0,
            loanAmount: parseFloat(document.getElementById('loan-amount').value) || 0,
            interestRate: parseFloat(document.getElementById('interest-rate').value) || 0,
            loanTerm: parseFloat(document.getElementById('loan-term').value) || 30,
            monthlyRent: parseFloat(document.getElementById('monthly-rent').value) || 0,
            otherIncome: parseFloat(document.getElementById('other-income').value) || 0,
            vacancyRate: parseFloat(document.getElementById('vacancy-rate').value) || 0,
            propertyTax: parseFloat(document.getElementById('property-tax').value) || 0,
            insurance: parseFloat(document.getElementById('insurance').value) || 0,
            maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
            hoa: parseFloat(document.getElementById('hoa').value) || 0,
            mgmtFee: parseFloat(document.getElementById('mgmt-fee').value) || 0,
            salePrice: parseFloat(document.getElementById('sale-price').value) || 0,
            exitCapRate: parseFloat(document.getElementById('exit-cap-rate').value) || 0,
            holdingPeriod: parseFloat(document.getElementById('holding-period').value) || 5
        };
        
        // Calculate metrics
        const metrics = performCalculations(formData);
        formData.metrics = metrics;
        
        // Save or update deal
        if (currentDeal) {
            // Update existing deal
            const index = deals.findIndex(d => d.id === currentDeal.id);
            deals[index] = { ...currentDeal, ...formData };
            saveDeals();
        } else {
            // Create new deal
            saveDeal(formData);
        }
        
        alert('Deal saved successfully!');
        form.reset();
        currentDeal = null;
        showView('dashboard');
    });
}

// ============================================
// FINANCIAL CALCULATIONS
// ============================================

function calculateMetrics() {
    const formData = {
        purchasePrice: parseFloat(document.getElementById('purchase-price').value) || 0,
        rehabCosts: parseFloat(document.getElementById('rehab-costs').value) || 0,
        closingCostPercent: parseFloat(document.getElementById('closing-cost-percent').value) || 3,
        closingCosts: parseFloat(document.getElementById('closing-costs').value) || 0,
        arv: parseFloat(document.getElementById('arv').value) || 0,
        downPayment: parseFloat(document.getElementById('down-payment').value) || 0,
        loanAmount: parseFloat(document.getElementById('loan-amount').value) || 0,
        interestRate: parseFloat(document.getElementById('interest-rate').value) || 0,
        loanTerm: parseFloat(document.getElementById('loan-term').value) || 30,
        monthlyRent: parseFloat(document.getElementById('monthly-rent').value) || 0,
        otherIncome: parseFloat(document.getElementById('other-income').value) || 0,
        vacancyRate: parseFloat(document.getElementById('vacancy-rate').value) || 0,
        propertyTax: parseFloat(document.getElementById('property-tax').value) || 0,
        insurance: parseFloat(document.getElementById('insurance').value) || 0,
        maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
        hoa: parseFloat(document.getElementById('hoa').value) || 0,
        mgmtFee: parseFloat(document.getElementById('mgmt-fee').value) || 0,
        salePrice: parseFloat(document.getElementById('sale-price').value) || 0,
        exitCapRate: parseFloat(document.getElementById('exit-cap-rate').value) || 0,
        holdingPeriod: parseFloat(document.getElementById('holding-period').value) || 5
    };
    
    const metrics = performCalculations(formData);
    displayResults(metrics);
    initializeSensitivity(formData);
}

function performCalculations(data) {
    // Total Investment
    const totalInvestment = data.purchasePrice + data.rehabCosts + data.closingCosts;
    
    // Annual Income
    const annualGrossIncome = (data.monthlyRent * 12) + (data.otherIncome * 12);
    const vacancyLoss = annualGrossIncome * (data.vacancyRate / 100);
    const effectiveGrossIncome = annualGrossIncome - vacancyLoss;
    
    // Operating Expenses
    const annualPropertyTax = data.propertyTax;
    const annualInsurance = data.insurance;
    const annualMaintenance = data.maintenance;
    const annualHOA = data.hoa * 12;
    const managementFees = effectiveGrossIncome * (data.mgmtFee / 100);
    const totalOperatingExpenses = annualPropertyTax + annualInsurance + annualMaintenance + annualHOA + managementFees;
    
    // Net Operating Income (NOI)
    const noi = effectiveGrossIncome - totalOperatingExpenses;
    
    // Debt Service
    const monthlyPayment = calculateMortgagePayment(data.loanAmount, data.interestRate, data.loanTerm);
    const annualDebtService = monthlyPayment * 12;
    
    // Cash Flow
    const annualCashFlow = noi - annualDebtService;
    const monthlyCashFlow = annualCashFlow / 12;
    
    // Cap Rate
    const capRate = totalInvestment > 0 ? (noi / totalInvestment) * 100 : 0;
    
    // Cash-on-Cash Return
    const cashInvested = data.downPayment + data.closingCosts + data.rehabCosts;
    const coc = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;
    
    // DSCR (Debt Service Coverage Ratio)
    const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
    
    // Break-even Occupancy
    const breakEvenOccupancy = annualGrossIncome > 0 ? 
        ((totalOperatingExpenses + annualDebtService) / annualGrossIncome) * 100 : 0;
    
    // IRR (Internal Rate of Return) - Simplified calculation
    const irr = calculateIRR(data, noi, cashInvested, annualCashFlow);
    
    // ROI over holding period
    const totalCashFlowOverPeriod = annualCashFlow * data.holdingPeriod;
    const saleProceeds = data.salePrice - (data.loanAmount * 0.9); // Assuming 10% principal paydown
    const totalReturn = totalCashFlowOverPeriod + saleProceeds;
    const roi = cashInvested > 0 ? ((totalReturn - cashInvested) / cashInvested) * 100 : 0;
    
    return {
        totalInvestment,
        annualGrossIncome,
        effectiveGrossIncome,
        totalOperatingExpenses,
        noi,
        annualDebtService,
        annualCashFlow,
        monthlyCashFlow,
        capRate: capRate.toFixed(2) + '%',
        coc: coc.toFixed(2) + '%',
        dscr: dscr.toFixed(2),
        breakEvenOccupancy: breakEvenOccupancy.toFixed(2) + '%',
        irr: irr.toFixed(2) + '%',
        roi: roi.toFixed(2) + '%',
        monthlyPayment
    };
}

function calculateMortgagePayment(principal, annualRate, years) {
    if (principal === 0 || annualRate === 0) return 0;
    
    const monthlyRate = (annualRate / 100) / 12;
    const numPayments = years * 12;
    
    const payment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return payment;
}

function calculateIRR(data, noi, initialInvestment, annualCashFlow) {
    // Simplified IRR calculation
    // In real scenario, would use NPV iteration method
    
    const years = data.holdingPeriod;
    const exitValue = data.salePrice || (noi / (data.exitCapRate / 100));
    const remainingLoan = data.loanAmount * (1 - (0.1 * years)); // Simplified principal paydown
    const saleProceeds = exitValue - remainingLoan;
    
    // Total return
    const totalCashFlow = annualCashFlow * years + saleProceeds;
    
    // Simple annualized return
    const totalReturn = totalCashFlow - initialInvestment;
    const annualizedReturn = (Math.pow((totalCashFlow / initialInvestment), (1 / years)) - 1) * 100;
    
    return annualizedReturn;
}

// ============================================
// RESULTS DISPLAY
// ============================================

function displayResults(metrics) {
    document.getElementById('results-section').classList.remove('hidden');
    
    // Key Metrics
    document.getElementById('result-cap-rate').textContent = metrics.capRate;
    document.getElementById('result-coc').textContent = metrics.coc;
    document.getElementById('result-dscr').textContent = metrics.dscr;
    document.getElementById('result-irr').textContent = metrics.irr;
    
    // Detailed Metrics
    document.getElementById('result-total-investment').textContent = formatCurrency(metrics.totalInvestment);
    document.getElementById('result-gross-income').textContent = formatCurrency(metrics.annualGrossIncome);
    document.getElementById('result-operating-expenses').textContent = formatCurrency(metrics.totalOperatingExpenses);
    document.getElementById('result-noi').textContent = formatCurrency(metrics.noi);
    document.getElementById('result-debt-service').textContent = formatCurrency(metrics.annualDebtService);
    document.getElementById('result-cash-flow').textContent = formatCurrency(metrics.annualCashFlow);
    document.getElementById('result-monthly-cash-flow').textContent = formatCurrency(metrics.monthlyCashFlow);
    document.getElementById('result-breakeven').textContent = metrics.breakEvenOccupancy;
    document.getElementById('result-roi').textContent = metrics.roi;
    
    // Update chart
    updateCashFlowChart(metrics);
    
    // Scroll to results
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// SENSITIVITY ANALYSIS
// ============================================

function initializeSensitivity(baseData) {
    const rentSlider = document.getElementById('sensitivity-rent');
    const vacancySlider = document.getElementById('sensitivity-vacancy');
    const exitCapSlider = document.getElementById('sensitivity-exit-cap');
    
    rentSlider.value = baseData.monthlyRent;
    rentSlider.min = baseData.monthlyRent * 0.5;
    rentSlider.max = baseData.monthlyRent * 1.5;
    
    vacancySlider.value = baseData.vacancyRate;
    exitCapSlider.value = baseData.exitCapRate;
    
    // Store base data for sensitivity calculations
    window.baseData = baseData;
    
    updateSensitivity();
}

function updateSensitivity() {
    if (!window.baseData) return;
    
    const rentValue = parseFloat(document.getElementById('sensitivity-rent').value);
    const vacancyValue = parseFloat(document.getElementById('sensitivity-vacancy').value);
    const exitCapValue = parseFloat(document.getElementById('sensitivity-exit-cap').value);
    
    document.getElementById('sensitivity-rent-value').textContent = formatCurrency(rentValue);
    document.getElementById('sensitivity-vacancy-value').textContent = vacancyValue.toFixed(1) + '%';
    document.getElementById('sensitivity-exit-cap-value').textContent = exitCapValue.toFixed(1) + '%';
    
    // Calculate impact on metrics
    const baseCoc = parseFloat(performCalculations(window.baseData).coc);
    
    // Rent impact
    const rentData = { ...window.baseData, monthlyRent: rentValue };
    const rentCoc = parseFloat(performCalculations(rentData).coc);
    const rentImpact = ((rentCoc - baseCoc) / baseCoc * 100).toFixed(1);
    document.getElementById('sensitivity-rent-impact').textContent = 
        (rentImpact >= 0 ? '+' : '') + rentImpact + '% CoC';
    document.getElementById('sensitivity-rent-impact').className = 
        rentImpact >= 0 ? 'font-semibold ml-2 text-green-600' : 'font-semibold ml-2 text-red-600';
    
    // Vacancy impact
    const vacancyData = { ...window.baseData, vacancyRate: vacancyValue };
    const vacancyCoc = parseFloat(performCalculations(vacancyData).coc);
    const vacancyImpact = ((vacancyCoc - baseCoc) / baseCoc * 100).toFixed(1);
    document.getElementById('sensitivity-vacancy-impact').textContent = 
        (vacancyImpact >= 0 ? '+' : '') + vacancyImpact + '% CoC';
    document.getElementById('sensitivity-vacancy-impact').className = 
        vacancyImpact >= 0 ? 'font-semibold ml-2 text-green-600' : 'font-semibold ml-2 text-red-600';
    
    // Exit cap impact
    const baseIrr = parseFloat(performCalculations(window.baseData).irr);
    const exitCapData = { ...window.baseData, exitCapRate: exitCapValue };
    const exitCapIrr = parseFloat(performCalculations(exitCapData).irr);
    const exitCapImpact = ((exitCapIrr - baseIrr) / baseIrr * 100).toFixed(1);
    document.getElementById('sensitivity-exit-cap-impact').textContent = 
        (exitCapImpact >= 0 ? '+' : '') + exitCapImpact + '% IRR';
    document.getElementById('sensitivity-exit-cap-impact').className = 
        exitCapImpact >= 0 ? 'font-semibold ml-2 text-green-600' : 'font-semibold ml-2 text-red-600';
}

// ============================================
// CHARTS
// ============================================

function initializeCharts() {
    // Cash Flow Chart
    const cashflowCtx = document.getElementById('cashflow-chart');
    if (cashflowCtx) {
        cashflowChart = new Chart(cashflowCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Cash Flow',
                    data: [],
                    borderColor: '#1e3a5f',
                    backgroundColor: 'rgba(30, 58, 95, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

function updateCashFlowChart(metrics) {
    if (!cashflowChart) return;
    
    const months = 60; // 5 years
    const labels = [];
    const data = [];
    
    for (let i = 1; i <= months; i++) {
        labels.push(`Month ${i}`);
        data.push(metrics.monthlyCashFlow);
    }
    
    cashflowChart.data.labels = labels;
    cashflowChart.data.datasets[0].data = data;
    cashflowChart.update();
}

// ============================================
// ANALYTICS
// ============================================

function renderAnalytics() {
    if (deals.length === 0) {
        document.getElementById('analytics-total-deals').textContent = '0';
        document.getElementById('analytics-avg-cap').textContent = '0%';
        document.getElementById('analytics-total-value').textContent = '$0';
        return;
    }
    
    // Calculate portfolio metrics
    const totalDeals = deals.length;
    const avgCapRate = deals.reduce((sum, deal) => {
        return sum + (parseFloat(deal.metrics?.capRate) || 0);
    }, 0) / totalDeals;
    
    const totalValue = deals.reduce((sum, deal) => {
        return sum + (deal.purchasePrice || 0);
    }, 0);
    
    document.getElementById('analytics-total-deals').textContent = totalDeals;
    document.getElementById('analytics-avg-cap').textContent = avgCapRate.toFixed(2) + '%';
    document.getElementById('analytics-total-value').textContent = formatCurrency(totalValue);
    
    // Update comparison chart
    updateComparisonChart();
}

function updateComparisonChart() {
    const ctx = document.getElementById('comparison-chart');
    if (!ctx) return;
    
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    const labels = deals.map(d => d.propertyName || 'Unnamed');
    const capRates = deals.map(d => parseFloat(d.metrics?.capRate) || 0);
    const cocRates = deals.map(d => parseFloat(d.metrics?.coc) || 0);
    
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cap Rate (%)',
                    data: capRates,
                    backgroundColor: '#1e3a5f'
                },
                {
                    label: 'Cash-on-Cash (%)',
                    data: cocRates,
                    backgroundColor: '#2c5282'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportToCSV() {
    if (deals.length === 0) {
        alert('No deals to export');
        return;
    }
    
    const headers = [
        'Property Name', 'Address', 'Type', 'Purchase Price', 'ARV',
        'Monthly Rent', 'Cap Rate', 'Cash-on-Cash', 'DSCR', 'IRR',
        'NOI', 'Monthly Cash Flow', 'Created Date'
    ];
    
    const rows = deals.map(deal => [
        deal.propertyName,
        deal.address,
        deal.propertyType,
        deal.purchasePrice,
        deal.arv,
        deal.monthlyRent,
        deal.metrics?.capRate || 'N/A',
        deal.metrics?.coc || 'N/A',
        deal.metrics?.dscr || 'N/A',
        deal.metrics?.irr || 'N/A',
        deal.metrics?.noi || 'N/A',
        deal.metrics?.monthlyCashFlow || 'N/A',
        new Date(deal.createdAt).toLocaleDateString()
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    downloadFile(csvContent, 'underwriting_deals.csv', 'text/csv');
}

function exportToJSON() {
    if (deals.length === 0) {
        alert('No deals to export');
        return;
    }
    
    const jsonContent = JSON.stringify(deals, null, 2);
    downloadFile(jsonContent, 'underwriting_deals.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function printReport() {
    window.print();
}

function importData() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file to import');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (Array.isArray(imported)) {
                deals = imported;
                saveDeals();
                renderDashboard();
                alert('Data imported successfully!');
            } else {
                alert('Invalid file format');
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// ============================================
// PROPERTY DATA API (Mock)
// ============================================

async function fetchPropertyData() {
    const address = document.getElementById('address').value;
    
    if (!address) {
        alert('Please enter an address first');
        return;
    }
    
    // Mock API call - in production, this would call Zillow/MLS API
    alert('Property lookup feature coming soon!\n\nThis will integrate with:\n- Zillow API\n- HomeJunction\n- MLS Data\n\nFor now, please enter data manually.');
    
    // Example of what real implementation would look like:
    /*
    try {
        const response = await fetch(`/api/property-lookup?address=${encodeURIComponent(address)}`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('arv').value = data.estimatedValue || 0;
            document.getElementById('sqft').value = data.squareFeet || 0;
            document.getElementById('property-tax').value = data.annualTax || 0;
            // ... populate other fields
        }
    } catch (error) {
        console.error('Property lookup error:', error);
        alert('Unable to fetch property data');
    }
    */
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value || 0);
}

// ============================================
// CLAUDE API INTEGRATION (Future Extension)
// ============================================

async function getAIInsights(dealData) {
    // This is a placeholder for future Claude API integration
    // Would provide AI-powered deal insights and recommendations
    
    /*
    const prompt = `Analyze this real estate deal and provide insights:
    Property: ${dealData.propertyName}
    Purchase Price: ${dealData.purchasePrice}
    Cap Rate: ${dealData.metrics.capRate}
    Cash-on-Cash: ${dealData.metrics.coc}
    DSCR: ${dealData.metrics.dscr}
    
    Provide:
    1. Deal quality assessment
    2. Risk factors
    3. Improvement suggestions
    4. Market comparison
    `;
    
    try {
        const response = await fetch('/api/claude/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, dealData })
        });
        
        const insights = await response.json();
        return insights;
    } catch (error) {
        console.error('AI insights error:', error);
        return null;
    }
    */
    
    return null;
}

// ============================================
// AUTO-CALCULATION HELPERS
// ============================================

/**
 * Update closing costs based on purchase price and closing cost percentage
 */
function updateClosingCosts() {
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value) || 0;
    const closingCostPercent = parseFloat(document.getElementById('closing-cost-percent').value) || 3;
    
    const closingCosts = purchasePrice * (closingCostPercent / 100);
    document.getElementById('closing-costs').value = Math.round(closingCosts);
}

/**
 * Update price per square foot display
 */
function updatePricePerSqft() {
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value) || 0;
    const sqft = parseFloat(document.getElementById('sqft').value) || 0;
    
    const pricePerSqft = sqft > 0 ? purchasePrice / sqft : 0;
    const displayElement = document.getElementById('price-per-sqft');
    
    if (displayElement) {
        if (pricePerSqft > 0) {
            displayElement.textContent = `Price/sqft: $${pricePerSqft.toFixed(2)}`;
            displayElement.className = 'mt-1 text-sm font-semibold text-navy';
        } else {
            displayElement.textContent = 'Price/sqft: $0';
            displayElement.className = 'mt-1 text-sm text-gray-600';
        }
    }
}

/**
 * Update loan amount based on purchase price minus down payment
 */
function updateLoanAmount() {
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value) || 0;
    const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
    
    const loanAmount = Math.max(0, purchasePrice - downPayment);
    document.getElementById('loan-amount').value = Math.round(loanAmount);
}

// Initialize closing costs on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial closing costs after a short delay to ensure form is ready
    setTimeout(() => {
        updateClosingCosts();
        updatePricePerSqft();
        updateLoanAmount();
    }, 100);
});

// ============================================
// PROPERTY TYPE HANDLING
// ============================================

/**
 * Handle property type change in Add Deal form
 */
function handlePropertyTypeChange() {
    const propertyType = document.getElementById('property-type').value;
    const storageSections = document.getElementById('self-storage-sections');
    
    if (propertyType === 'Self Storage') {
        storageSections.classList.remove('hidden');
    } else {
        storageSections.classList.add('hidden');
    }
}

// ============================================
// SELF STORAGE DEAL FUNCTIONS (in Add Deal form)
// ============================================

/**
 * Update price per unit for self storage in deal form
 */
function updateStorageDealPricePerUnit() {
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value) || 0;
    const numUnits = parseFloat(document.getElementById('storage-num-units-deal').value) || 0;
    
    const pricePerUnit = numUnits > 0 ? purchasePrice / numUnits : 0;
    document.getElementById('storage-price-per-unit-deal').value = Math.round(pricePerUnit);
}

/**
 * Update income calculations for self storage in deal form
 */
function updateStorageDealIncome() {
    const grossRents = parseFloat(document.getElementById('storage-gross-rents-deal').value) || 0;
    const vacancy = parseFloat(document.getElementById('storage-vacancy-deal').value) || 0;
    const concessions = parseFloat(document.getElementById('storage-concessions-deal').value) || 0;
    const otherStorageIncome = parseFloat(document.getElementById('storage-other-storage-income-deal').value) || 0;
    const retailSales = parseFloat(document.getElementById('storage-retail-sales-deal').value) || 0;
    const otherIncome = parseFloat(document.getElementById('storage-other-income-deal').value) || 0;
    
    // Calculate net storage income
    const netStorageIncome = grossRents - vacancy - concessions;
    document.getElementById('storage-net-income-deal').value = Math.round(netStorageIncome);
    
    // Calculate total operating income
    const totalOperatingIncome = netStorageIncome + otherStorageIncome + retailSales + otherIncome;
    document.getElementById('storage-total-income-deal').value = Math.round(totalOperatingIncome);
    
    // Also update the main monthly rent field to match storage income (monthly)
    document.getElementById('monthly-rent').value = Math.round(totalOperatingIncome / 12);
}

/**
 * Update expense calculations for self storage in deal form
 */
function updateStorageDealExpenses() {
    const management = parseFloat(document.getElementById('storage-management-deal').value) || 0;
    const repairs = parseFloat(document.getElementById('storage-repairs-deal').value) || 0;
    const payroll = parseFloat(document.getElementById('storage-payroll-deal').value) || 0;
    const contractServices = parseFloat(document.getElementById('storage-contract-deal').value) || 0;
    const retailExpenses = parseFloat(document.getElementById('storage-retail-exp-deal').value) || 0;
    
    // Calculate total additional storage expenses
    const totalExpenses = management + repairs + payroll + contractServices + retailExpenses;
    document.getElementById('storage-additional-exp-deal').value = Math.round(totalExpenses);
    
    // Also add this to the main operating expenses field (monthly)
    const currentOpex = parseFloat(document.getElementById('operating-expenses').value) || 0;
    document.getElementById('operating-expenses').value = Math.round((currentOpex + totalExpenses) / 12);
}

// ============================================
// SELF STORAGE ANALYZER FUNCTIONS (Standalone tab)
// ============================================

/**
 * Update price per unit for self storage
 */
function updateStoragePricePerUnit() {
    const purchasePrice = parseFloat(document.getElementById('storage-purchase-price').value) || 0;
    const numUnits = parseFloat(document.getElementById('storage-num-units').value) || 0;
    
    const pricePerUnit = numUnits > 0 ? purchasePrice / numUnits : 0;
    document.getElementById('storage-price-per-unit').value = Math.round(pricePerUnit);
}

/**
 * Update price per square foot for self storage
 */
function updateStoragePricePerSqft() {
    const purchasePrice = parseFloat(document.getElementById('storage-purchase-price').value) || 0;
    const sqft = parseFloat(document.getElementById('storage-sqft').value) || 0;
    
    const pricePerSqft = sqft > 0 ? purchasePrice / sqft : 0;
    document.getElementById('storage-price-per-sqft').value = pricePerSqft.toFixed(2);
}

/**
 * Update mortgage calculations for self storage
 */
function updateStorageMortgage() {
    const purchasePrice = parseFloat(document.getElementById('storage-purchase-price').value) || 0;
    const downPercent = parseFloat(document.getElementById('storage-down-percent').value) || 0;
    const interestRate = parseFloat(document.getElementById('storage-interest-rate').value) || 0;
    const amortizationYears = parseFloat(document.getElementById('storage-amortization').value) || 0;
    
    // Update mortgage purchase price field
    document.getElementById('storage-mort-purchase-price').value = purchasePrice;
    
    // Calculate down payment
    const downPayment = (purchasePrice * downPercent) / 100;
    document.getElementById('storage-down-payment').value = Math.round(downPayment);
    
    // Calculate loan amount
    const loanAmount = purchasePrice - downPayment;
    document.getElementById('storage-loan-amount').value = Math.round(loanAmount);
    
    // Calculate annual debt service
    if (loanAmount > 0 && interestRate > 0 && amortizationYears > 0) {
        const monthlyRate = (interestRate / 100) / 12;
        const numPayments = amortizationYears * 12;
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
        const annualDebt = monthlyPayment * 12;
        document.getElementById('storage-annual-debt').value = Math.round(annualDebt);
    } else {
        document.getElementById('storage-annual-debt').value = 0;
    }
    
    // Update closing costs since loan amount changed
    updateStorageClosingCosts();
}

/**
 * Update closing costs calculations for self storage
 */
function updateStorageClosingCosts() {
    const closingCosts = parseFloat(document.getElementById('storage-closing-costs').value) || 0;
    const loanAmount = parseFloat(document.getElementById('storage-loan-amount').value) || 0;
    const loanPoints = parseFloat(document.getElementById('storage-loan-points').value) || 0;
    const expenseReimbPercent = parseFloat(document.getElementById('storage-expense-reimb-percent').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('storage-purchase-price').value) || 0;
    const closingCostsOther = parseFloat(document.getElementById('storage-closing-costs-other').value) || 0;
    
    // Calculate loan point cost
    const loanPointCost = (loanAmount * loanPoints) / 100;
    document.getElementById('storage-loan-point-cost').value = Math.round(loanPointCost);
    
    // Calculate expense reimbursement amount
    const expenseReimbAmount = (purchasePrice * expenseReimbPercent) / 100;
    document.getElementById('storage-expense-reimb-amount').value = Math.round(expenseReimbAmount);
    
    // Calculate total closing costs
    const totalClosingCosts = closingCosts + loanPointCost + expenseReimbAmount + closingCostsOther;
    document.getElementById('storage-total-closing-costs').value = Math.round(totalClosingCosts);
    
    // Calculate total acquisition costs
    const totalAcquisitionCosts = purchasePrice + totalClosingCosts;
    document.getElementById('storage-total-acquisition-costs').value = Math.round(totalAcquisitionCosts);
}

/**
 * Update income calculations for self storage
 */
function updateStorageIncome() {
    const grossRents = parseFloat(document.getElementById('storage-gross-rents').value) || 0;
    const vacancy = parseFloat(document.getElementById('storage-vacancy').value) || 0;
    const concessions = parseFloat(document.getElementById('storage-concessions').value) || 0;
    const otherStorageIncome = parseFloat(document.getElementById('storage-other-storage-income').value) || 0;
    const otherRentalIncome = parseFloat(document.getElementById('storage-other-rental-income').value) || 0;
    const retailSales = parseFloat(document.getElementById('storage-retail-sales').value) || 0;
    const officeIncome = parseFloat(document.getElementById('storage-office-income').value) || 0;
    const otherIncome1 = parseFloat(document.getElementById('storage-other-income-1').value) || 0;
    const otherIncome2 = parseFloat(document.getElementById('storage-other-income-2').value) || 0;
    const otherIncome3 = parseFloat(document.getElementById('storage-other-income-3').value) || 0;
    const otherIncome4 = parseFloat(document.getElementById('storage-other-income-4').value) || 0;
    
    // Calculate net storage income
    const netStorageIncome = grossRents - vacancy - concessions;
    document.getElementById('storage-net-storage-income').value = Math.round(netStorageIncome);
    
    // Calculate total operating income
    const totalOperatingIncome = netStorageIncome + otherStorageIncome + otherRentalIncome + 
                                 retailSales + officeIncome + otherIncome1 + otherIncome2 + 
                                 otherIncome3 + otherIncome4;
    document.getElementById('storage-total-operating-income').value = Math.round(totalOperatingIncome);
}

/**
 * Update expense calculations for self storage
 */
function updateStorageExpenses() {
    const taxes = parseFloat(document.getElementById('storage-taxes').value) || 0;
    const insurance = parseFloat(document.getElementById('storage-insurance').value) || 0;
    const repairs = parseFloat(document.getElementById('storage-repairs').value) || 0;
    const admin = parseFloat(document.getElementById('storage-admin').value) || 0;
    const management = parseFloat(document.getElementById('storage-management').value) || 0;
    const contractServices = parseFloat(document.getElementById('storage-contract-services').value) || 0;
    const utilities = parseFloat(document.getElementById('storage-utilities').value) || 0;
    const payroll = parseFloat(document.getElementById('storage-payroll').value) || 0;
    const retailExpenses = parseFloat(document.getElementById('storage-retail-expenses').value) || 0;
    const officeExpense = parseFloat(document.getElementById('storage-office-expense').value) || 0;
    
    // Calculate total operating expenses
    const totalExpenses = taxes + insurance + repairs + admin + management + contractServices + 
                         utilities + payroll + retailExpenses + officeExpense;
    document.getElementById('storage-total-expenses').value = Math.round(totalExpenses);
}

/**
 * Calculate and display storage metrics
 */
function calculateStorageMetrics() {
    // Get all values
    const totalOperatingIncome = parseFloat(document.getElementById('storage-total-operating-income').value) || 0;
    const totalExpenses = parseFloat(document.getElementById('storage-total-expenses').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('storage-purchase-price').value) || 0;
    const annualDebt = parseFloat(document.getElementById('storage-annual-debt').value) || 0;
    
    // Calculate NOI
    const noi = totalOperatingIncome - totalExpenses;
    
    // Calculate Cap Rate
    const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
    
    // Calculate Cash Flow
    const cashFlow = noi - annualDebt;
    
    // Calculate DSCR
    const dscr = annualDebt > 0 ? noi / annualDebt : 0;
    
    // Display results
    document.getElementById('storage-result-noi').textContent = '$' + Math.round(noi).toLocaleString();
    document.getElementById('storage-result-cap-rate').textContent = capRate.toFixed(2) + '%';
    document.getElementById('storage-result-cash-flow').textContent = '$' + Math.round(cashFlow).toLocaleString();
    document.getElementById('storage-result-dscr').textContent = dscr.toFixed(2);
    
    // Show results section
    document.getElementById('storage-results-section').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('storage-results-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE FOR ONCLICK HANDLERS
// ============================================
window.showView = showView;
window.handleLogout = handleLogout;
window.fetchPropertyData = fetchPropertyData;
window.calculateMetrics = calculateMetrics;
window.calculateStorageMetrics = calculateStorageMetrics;
window.exportToCSV = exportToCSV;
window.exportToJSON = exportToJSON;
window.printReport = printReport;
window.importData = importData;
window.handlePropertyTypeChange = handlePropertyTypeChange;
window.updatePricePerSqft = updatePricePerSqft;
window.updateLoanAmount = updateLoanAmount;
window.updateStorageDealPricePerUnit = updateStorageDealPricePerUnit;
window.updateStorageDealIncome = updateStorageDealIncome;
window.editDeal = editDeal;
window.deleteDeal = deleteDeal;
window.viewDeal = viewDeal;
