console.log("validator.js loaded");

// validator.js
document.addEventListener('DOMContentLoaded', function () {
    function showValidationResult(valid, result, error) {
        const out = document.getElementById('jq-validation-output');
        out.innerHTML = '';

        // Create card container
        const card = document.createElement('div');
        card.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // Add validation status
        if (typeof valid !== 'undefined') {
            const status = document.createElement('div');
            status.innerHTML = valid ? '<b style="color: green;">✓ Valid JQ expression</b>' : '<b style="color: red;">✗ Invalid JQ expression</b>';
            status.style.marginBottom = '15px';
            card.appendChild(status);
        }

        // Add result
        if (typeof result !== 'undefined') {
            const resultTitle = document.createElement('h4');
            resultTitle.textContent = 'Result:';
            resultTitle.style.marginBottom = '10px';
            card.appendChild(resultTitle);

            const resultPre = document.createElement('pre');
            resultPre.textContent = JSON.stringify(result, null, 2);
            resultPre.style.cssText = `
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 15px;
                overflow-x: auto;
                font-family: 'Courier New', monospace;
            `;
            card.appendChild(resultPre);
        }

        // Add error
        if (error) {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<span style="color: red;"><b>Error:</b> ${error}</span>`;
            errorDiv.style.marginTop = '10px';
            card.appendChild(errorDiv);
        }

        out.appendChild(card);
    }

    function validateJQ() {
        const payload = document.getElementById('payload').value;
        const expression = document.getElementById('jq-expression-input').value;

        try {
            fetch('/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payload: JSON.parse(payload),
                    expression: expression
                })
            })
                .then(res => res.json())
                .then(data => {
                    showValidationResult(data.valid, data.result, data.error);
                })
                .catch(err => showValidationResult(false, undefined, err && err.message));
        } catch (parseError) {
            showValidationResult(false, undefined, 'Invalid JSON format');
        }
    }

    // Expose validateJQ function globally
    window.validateJQ = validateJQ;

    // Wait for form to be available
    function attachFormHandler() {
        const form = document.getElementById('submit');
        if (form) {
            alert("Form found, attaching handler!");
            form.addEventListener('click', function (e) {
                alert("Form found and handler attached!");
                validateJQ();
            });
        } else {
            // Retry after 100ms
            setTimeout(attachFormHandler, 100);
        }
    }

    // Start checking for form
    attachFormHandler();
});