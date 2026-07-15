document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.getElementById('body');
    
    // Check local storage for theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        if(themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- Toast Notification ---
    const showToast = (message) => {
        const toastEl = document.getElementById('liveToast');
        if (toastEl) {
            document.getElementById('toast-message').textContent = message;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    };

    // --- Index Page Logic ---
    const newsText = document.getElementById('news-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    
    if (newsText) {
        // Counters
        newsText.addEventListener('input', () => {
            const text = newsText.value;
            document.getElementById('char-count').textContent = text.length;
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            document.getElementById('word-count').textContent = words;
        });

        // Clear
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                newsText.value = '';
                newsText.dispatchEvent(new Event('input'));
            });
        }

        // Sample News
        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                newsText.value = "Breaking News: The government is hiding a secret 100% cure for all diseases discovered by a miracle doctor! Click here to see the exclusive report before it's banned.";
                newsText.dispatchEvent(new Event('input'));
            });
        }

        // Analyze Form Submit
        const analyzeForm = document.getElementById('analyze-form');
        if (analyzeForm) {
            analyzeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = newsText.value.trim();
                
                if (!text) {
                    showToast("Please enter some text to analyze.");
                    return;
                }

                // UI Loading State
                const btnText = analyzeBtn.querySelector('.btn-text');
                const spinner = analyzeBtn.querySelector('.spinner-border');
                const progressBar = document.getElementById('loading-progress');
                const progressBarInner = progressBar.querySelector('.progress-bar');
                
                analyzeBtn.disabled = true;
                btnText.textContent = 'Analyzing...';
                spinner.classList.remove('d-none');
                progressBar.classList.remove('d-none');
                
                // Simulate progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    progressBarInner.style.width = `${progress}%`;
                    if (progress >= 90) clearInterval(interval);
                }, 200);

                try {
                    const response = await fetch('/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: text })
                    });
                    
                    clearInterval(interval);
                    progressBarInner.style.width = `100%`;

                    if (response.ok) {
                        const data = await response.json();
                        // Save data to localStorage to pass to result page
                        localStorage.setItem('predictionData', JSON.stringify({
                            text: text,
                            ...data
                        }));
                        
                        setTimeout(() => {
                            window.location.href = '/result';
                        }, 500);
                    } else {
                        const err = await response.json();
                        showToast(err.error || "Analysis failed.");
                        analyzeBtn.disabled = false;
                        btnText.textContent = 'Analyze';
                        spinner.classList.add('d-none');
                        progressBar.classList.add('d-none');
                    }
                } catch (error) {
                    clearInterval(interval);
                    showToast("Network error occurred.");
                    analyzeBtn.disabled = false;
                    btnText.textContent = 'Analyze';
                    spinner.classList.add('d-none');
                    progressBar.classList.add('d-none');
                }
            });
        }
    }

    // --- Result Page Logic ---
    if (window.location.pathname === '/result') {
        const dataStr = localStorage.getItem('predictionData');
        if (!dataStr) {
            window.location.href = '/';
            return;
        }

        const data = JSON.parse(dataStr);
        
        // Populate DOM
        const badge = document.getElementById('prediction-badge');
        const confText = document.getElementById('confidence-text');
        const riskBar = document.getElementById('risk-bar');
        
        if (data.prediction === 'Fake News') {
            badge.className = 'badge rounded-pill mb-3 px-4 py-2 fs-4 shadow-sm bg-danger';
            badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-2"></i>Fake News Detected';
            riskBar.className = 'progress-bar bg-danger';
            riskBar.style.width = '90%';
        } else {
            badge.className = 'badge rounded-pill mb-3 px-4 py-2 fs-4 shadow-sm bg-success';
            badge.innerHTML = '<i class="fa-solid fa-check-circle me-2"></i>Real News Detected';
            riskBar.className = 'progress-bar bg-success';
            riskBar.style.width = '10%';
        }
        
        confText.textContent = `${data.confidence}%`;
        document.getElementById('explanation-box').innerHTML = data.explanation;
        document.getElementById('highlighted-text').innerHTML = data.highlighted_text;

        // Charts
        const confCtx = document.getElementById('confidenceChart').getContext('2d');
        new Chart(confCtx, {
            type: 'doughnut',
            data: {
                labels: ['Confidence', 'Uncertainty'],
                datasets: [{
                    data: [data.confidence, 100 - data.confidence],
                    backgroundColor: [
                        data.prediction === 'Fake News' ? '#ef4444' : '#10b981',
                        '#e2e8f0'
                    ],
                    borderWidth: 0,
                    cutout: '80%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });

        const barCtx = document.getElementById('barChart').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Fake Probability', 'Real Probability'],
                datasets: [{
                    data: [data.fake_prob, data.real_prob],
                    backgroundColor: ['#ef4444', '#10b981'],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });

        // Download Report
        const downloadBtn = document.getElementById('download-report-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', async () => {
                showToast("Generating PDF report...");
                try {
                    const response = await fetch('/download_report', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text: data.text,
                            prediction: data.prediction,
                            confidence: data.confidence
                        })
                    });
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'TruthAI_Report.pdf';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                    }
                } catch (e) {
                    showToast("Failed to download report.");
                }
            });
        }
    }

    // --- Admin Page Logic ---
    if (window.location.pathname === '/admin' && window.adminData) {
        const pieCtx = document.getElementById('adminPieChart').getContext('2d');
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Real News', 'Fake News'],
                datasets: [{
                    data: [window.adminData.real, window.adminData.fake],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: 'var(--text-color)' } }
                }
            }
        });

        const lineCtx = document.getElementById('adminLineChart').getContext('2d');
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Mock Data
                datasets: [{
                    label: 'Predictions Over Time',
                    data: [12, 19, 15, 25, 22, (window.adminData.real + window.adminData.fake)],
                    borderColor: '#3b82f6',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: 'var(--text-color)' }, grid: { color: 'var(--card-border)' } },
                    x: { ticks: { color: 'var(--text-color)' }, grid: { color: 'var(--card-border)' } }
                }
            }
        });
    }

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (contactForm.checkValidity()) {
                showToast("Message sent successfully! We'll get back to you soon.");
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            } else {
                contactForm.classList.add('was-validated');
            }
        });
    }
});
