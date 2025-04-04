// home.js

// Initial values
let totalEnergy = 0;
let footsteps = 0;
let energyRate = 0;

// HTML elements
const totalEnergyEl = document.getElementById("total-energy");
const footstepsEl = document.getElementById("footsteps");
const energyRateEl = document.getElementById("energy-rate");

// Utility: format number with commas
function formatNumber(num) {
    return num.toLocaleString();
}

// Simulate footsteps and energy generation
function generateRandomStepData() {
    const newSteps = Math.floor(Math.random() * 10) + 1; // 1 to 10 steps
    footsteps += newSteps;

    const energyPerStep = 0.05; // Wh per step
    const newEnergy = newSteps * energyPerStep;
    totalEnergy += newEnergy;

    energyRate = newEnergy * 2; // Simulated live rate (Wh * 2 = W)

    updateDashboard();
}

// Animate number counting
function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.textContent = formatNumber(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Update the dashboard values
function updateDashboard() {
    animateValue(totalEnergyEl, parseFloat(totalEnergyEl.textContent) || 0, totalEnergy.toFixed(2), 500);
    animateValue(footstepsEl, parseInt(footstepsEl.textContent) || 0, footsteps, 500);
    animateValue(energyRateEl, parseFloat(energyRateEl.textContent) || 0, energyRate.toFixed(2), 500);

    totalEnergyEl.textContent = `${totalEnergy.toFixed(2)} Wh`;
    energyRateEl.textContent = `${energyRate.toFixed(2)} W`;
}

// Start simulation on load
window.onload = function () {
    // Run every 2 seconds
    setInterval(generateRandomStepData, 2000);
};

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Optional: console log for testing
console.log("GenWalk dashboard simulation started.");

// User tip popup (after 5 seconds)
setTimeout(() => {
    alert("Welcome to GenWalk!\nYour footsteps are now generating clean energy.");
}, 5000);

// Hover animation (optional)
const cards = document.querySelectorAll(".stat-card");
cards.forEach(card => {
    card.addEventListener("mouseover", () => {
        card.style.transform = "scale(1.05)";
    });
    card.addEventListener("mouseout", () => {
        card.style.transform = "scale(1)";
    });
});
