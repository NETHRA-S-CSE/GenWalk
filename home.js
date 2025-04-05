// Animation on scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements that need to be animated
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-right, .animate-slide-left');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll events
    function handleScroll() {
        animatedElements.forEach(element => {
            if (isInViewport(element) && element.style.opacity !== '1') {
                element.style.animationPlayState = 'running';
            }
        });
    }
    
    // Initially pause animations that should trigger on scroll
    animatedElements.forEach(element => {
        // Skip hero section elements which should animate on page load
        if (!element.closest('.hero') && !element.classList.contains('logo')) {
            element.style.animationPlayState = 'paused';
        }
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Trigger once on page load
    handleScroll();
});

// Backend simulation for Dynamo tile system
class DynamoTileSystem {
    constructor() {
        this.todayEnergy = 0;
        this.todayFootsteps = 0;
        this.batteryCapacityWh = 1000; // 1 kWh battery
        this.currentBatteryWh = 300; // Starting at 30%
        this.energyPerStep = 0.05; // 0.05 Wh per step (estimate)
        this.co2PerWh = 0.5; // 0.5g of CO2 saved per Wh
        this.energyRate = 0;
        
        // Hourly data for the last 24 hours
        this.hourlyData = Array(24).fill(0).map(() => Math.random() * 20 + 5);
        
        // Initialize the system
        this.initSystem();
    }
    
    initSystem() {
        // Load any saved data from localStorage
        this.loadData();
        
        // Update displays
        this.updateDisplays();
        
        // Set up simulated footstep detection
        this.simulateFootsteps();
        
        // Set up auto-save
        setInterval(() => this.saveData(), 30000);
        
        // Set up chart update
        this.initChart();
        
        // Update hourly data every hour
        setInterval(() => this.updateHourlyData(), 3600000);
    }
    
    loadData() {
        try {
            const savedData = localStorage.getItem('dynamoData');
            if (savedData) {
                const data = JSON.parse(savedData);
                const lastDate = new Date(data.date);
                const today = new Date();
                
                // If the data is from today, load it
                if (lastDate.toDateString() === today.toDateString()) {
                    this.todayEnergy = data.energy;
                    this.todayFootsteps = data.footsteps;
                    this.currentBatteryWh = data.battery;
                    this.hourlyData = data.hourlyData;
                } else {
                    // Reset for new day but keep battery level
                    this.currentBatteryWh = data.battery;
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    saveData() {
        try {
            const data = {
                energy: this.todayEnergy,
                footsteps: this.todayFootsteps,
                battery: this.currentBatteryWh,
                hourlyData: this.hourlyData,
                date: new Date().toISOString()
            };
            
            localStorage.setItem('dynamoData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
    
    updateDisplays() {
        document.getElementById('total-energy').textContent = this.todayEnergy.toFixed(2) + ' Wh';
        document.getElementById('footsteps').textContent = this.todayFootsteps;
        document.getElementById('energy-rate').textContent = this.energyRate.toFixed(2) + ' W';
        document.getElementById('co2-saved').textContent = (this.todayEnergy * this.co2PerWh).toFixed(2) + ' g';
        
        const batteryPercentage = (this.currentBatteryWh / this.batteryCapacityWh) * 100;
        document.getElementById('battery-percentage').textContent = batteryPercentage.toFixed(1);
        document.getElementById('battery-level').style.width = batteryPercentage + '%';
        
        const usageTime = (this.currentBatteryWh / 10).toFixed(1); // Assuming 10W usage
        document.getElementById('usage-time').textContent = usageTime;
        
        // Update chart
        this.updateChart();
    }
    
    recordFootstep() {
        this.todayFootsteps++;
        this.todayEnergy += this.energyPerStep;
        this.currentBatteryWh += this.energyPerStep;
        
        // Cap battery at maximum capacity
        if (this.currentBatteryWh > this.batteryCapacityWh) {
            this.currentBatteryWh = this.batteryCapacityWh;
        }
        
        // Update the current hour in hourly data
        const currentHour = new Date().getHours();
        this.hourlyData[currentHour] += this.energyPerStep;
        
        // Calculate energy rate (average over last minute)
        this.calculateEnergyRate();
        
        // Update displays
        this.updateDisplays();
        
        // Animate footstep
        this.animateFootstep();
    }
    
    calculateEnergyRate() {
        // Simple calculation based on recent activity
        this.energyRate = this.energyPerStep * 10; // Assume 10 steps per minute
    }
    
    simulateFootsteps() {
        // For demo purposes, simulate random footsteps
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance of footstep
                this.recordFootstep();
            }
        }, 1000);
    }
    
    animateFootstep() {
        const container = document.getElementById('footstep-animation');
        const footstep = document.createElement('div');
        footstep.className = 'footstep';
        
        // Random position within container
        const left = Math.random() * (container.offsetWidth - 40);
        const top = Math.random() * (container.offsetHeight - 20);
        
        footstep.style.left = left + 'px';
        footstep.style.top = top + 'px';
        
        container.appendChild(footstep);
        
        // Remove after animation completes
        setTimeout(() => {
            footstep.remove();
        }, 1000);
    }
    
    initChart() {
        const ctx = document.getElementById('energy-chart').getContext('2d');
        
        // Labels for 24 hours
        const labels = Array.from({ length: 24 }, (_, i) => {
            return i + ':00';
        });
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Energy Generated (Wh)',
                    data: this.hourlyData,
                    backgroundColor: 'rgba(52, 105, 154, 0.7)', // Professional blue
                    borderColor: 'rgba(52, 105, 154, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Energy (Wh)',
                            color: '#34699a'
                        },
                        grid: {
                            color: 'rgba(211, 186, 136, 0.1)' // Very light beige grid lines
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Hour of Day',
                            color: '#34699a'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#3a4a5a'
                        }
                    }
                }
            }
        });
    }
    
    updateChart() {
        if (this.chart) {
            this.chart.data.datasets[0].data = this.hourlyData;
            this.chart.update();
        }
    }
    
    updateHourlyData() {
        // Shift data left and add new data point at current hour
        const currentHour = new Date().getHours();
        // Reset the current hour for the new hour
        this.hourlyData[currentHour] = 0;
        
        // Update the chart
        this.updateChart();
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dynamoSystem = new DynamoTileSystem();
    
    // Allow manual footstep for demo purposes
    document.addEventListener('click', () => {
        dynamoSystem.recordFootstep();
    });
});
