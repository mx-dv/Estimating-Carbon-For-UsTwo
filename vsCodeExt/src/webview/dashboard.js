(function(){


// initialising vscode api so that back end can be connected
    const vscode = acquireVsCodeApi();

    // click listener so reset button can be used
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // sending a message to extension.ts
            vscode.postMessage({ command: 'triggerReset' });
        });}

 const btn = document.getElementById('theme-switch');
            btn.addEventListener('click', () => { document.body.classList.toggle('darkmode'); });

            function generateColors(count) {
                const colors = [];
                for (let i = 0; i < count; i++) {
                    const hue = Math.floor(i * (360 / count));
                    colors.push('hsl(' + hue + ', 70%, 50%)');
                }
                return colors;
            }

            const commonOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#888' } } }
            };

            
            // emissions by Model chart live data from backend
            const modelEmissionsChart = new Chart(document.getElementById('modelEmissionsChart'), {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: generateColors(0)
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    return label + ': ' + value.toFixed(8) + ' g CO₂e';
                                }
                            }
                        }
                    }
                }
            });

            

            window.addEventListener('message', event => {
    const message = event.data;
    if (message.command === 'updateData') {
        
        // live emission by model data from backend
        if (message.modelLabels && message.modelEmissions) {
            const hasData = message.modelLabels.length > 0;
            const emptyMsg = document.getElementById('model-empty-msg');
            if (emptyMsg) { emptyMsg.style.display = hasData ? 'none' : 'block'; }

            modelEmissionsChart.data.labels = message.modelLabels;
            modelEmissionsChart.data.datasets[0].data = message.modelEmissions;
            modelEmissionsChart.data.datasets[0].backgroundColor = generateColors(message.modelLabels.length);
            modelEmissionsChart.update();
            
            //budget prgess bar update logic
            // calculate total session emissions by summing the array
            const totalEmissions = message.modelEmissions.reduce((sum, current) => sum + current, 0);
            
            // Hardcoding a budget limit for testing  
            
            const SESSION_BUDGET = 5; 
            
            // calculate percentage 
            let percentUsed = 0;
            if (SESSION_BUDGET > 0) {
                percentUsed = (totalEmissions / SESSION_BUDGET) * 100;
            }
            
            // capping visual width at 100% for display purposes
            const visualWidth = Math.min(percentUsed, 100);

            // update the progress bar and text elements
            const fillEl = document.getElementById('session-progress-fill');
            const pctEl = document.getElementById('session-percent-used');
            const rightEl = document.getElementById('session-text-right');
            
            fillEl.style.width = visualWidth + '%';
            pctEl.innerText = percentUsed.toFixed(1) + '% used';
            rightEl.innerText = totalEmissions.toFixed(5) + 'g / ' + SESSION_BUDGET + 'g CO₂e';
            
            // change colour to red if over 90% of budget is used
            if (percentUsed >= 90) {
                fillEl.classList.add('danger');
            } else {
                fillEl.classList.remove('danger');
            }
        }
    }
});
    })();