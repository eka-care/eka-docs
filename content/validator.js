
// Wrap everything in an IIFE to avoid global namespace pollution
(function() {
    if (window.validatorScriptLoaded) {
        return;
    }
    window.validatorScriptLoaded = true;

    function mockJQValidation(payload, expression) {
        try {
            // Handle jq command style expressions (e.g., jq '.user.name')
            if (expression.startsWith('jq ')) {
                const jqExpression = expression.substring(3).trim();

                // Extract the actual expression without quotes
                let actualExpression;
                if ((jqExpression.startsWith("'") && jqExpression.endsWith("'")) ||
                    (jqExpression.startsWith('"') && jqExpression.endsWith('"'))) {
                    actualExpression = jqExpression.substring(1, jqExpression.length - 1);
                } else {
                    actualExpression = jqExpression;
                }

                // Call the validation function with the extracted expression
                const result = mockJQValidation(payload, actualExpression);

                // Return true/false instead of the actual value
                if (result.valid) {
                    return {
                        valid: true,
                        result: true,
                        error: null
                    };
                } else {
                    return {
                        valid: true,
                        result: false,
                        error: null
                    };
                }
            }

            if (expression === '.') {
                return {
                    valid: true,
                    result: payload,
                    error: null
                };
            }

            if (expression.startsWith('.') && !expression.includes('[') && !expression.includes('|')) {
                const key = expression.substring(1);

                if (key === '') {
                    return {
                        valid: true,
                        result: payload,
                        error: null
                    };
                }

                if (key.includes('.')) {
                    const keys = key.split('.');
                    let current = payload;

                    for (const k of keys) {
                        if (current && typeof current === 'object' && current.hasOwnProperty(k)) {
                            current = current[k];
                        } else {
                            return {
                                valid: false,
                                result: null,
                                error: `Property path '${key}' not found in JSON object`
                            };
                        }
                    }
                    return {
                        valid: true,
                        result: current,
                        error: null
                    };
                }

                if (payload && typeof payload === 'object' && payload.hasOwnProperty(key)) {
                    return {
                        valid: true,
                        result: payload[key],
                        error: null
                    };
                } else {
                    return {
                        valid: false,
                        result: null,
                        error: `Property '${key}' not found in JSON object`
                    };
                }
            }

            // Handle array indexing
            if (expression.match(/^\.\[\d+]$/)) {
                const indexMatch = expression.match(/^\.\[(\d+)]$/);
                if (indexMatch) {
                    const index = parseInt(indexMatch[1]);

                    if (Array.isArray(payload)) {
                        if (index >= 0 && index < payload.length) {
                            return {
                                valid: true,
                                result: payload[index],
                                error: null
                            };
                        } else {
                            return {
                                valid: false,
                                result: null,
                                error: `Array index ${index} is out of bounds (array length: ${payload.length})`
                            };
                        }
                    } else {
                        return {
                            valid: false,
                            result: null,
                            error: `Cannot index non-array value with [${index}]`
                        };
                    }
                }
            }

            // Handle length
            if (expression === '.length' || expression === '. | length') {
                if (Array.isArray(payload)) {
                    return {
                        valid: true,
                        result: payload.length,
                        error: null
                    };
                } else if (typeof payload === 'object' && payload !== null) {
                    return {
                        valid: true,
                        result: Object.keys(payload).length,
                        error: null
                    };
                } else {
                    return {
                        valid: false,
                        result: null,
                        error: "Cannot get length of non-array/non-object value"
                    };
                }
            }

            // Handle keys
            if (expression === '. | keys' || expression === '.keys') {
                if (typeof payload === 'object' && payload !== null) {
                    return {
                        valid: true,
                        result: Array.isArray(payload)
                            ? Array.from({ length: payload.length }, (_, i) => i)
                            : Object.keys(payload),
                        error: null
                    };
                } else {
                    return {
                        valid: false,
                        result: null,
                        error: "Cannot get keys of non-object value"
                    };
                }
            }
            // Handle type checking
            if (expression === '. | type' || expression === '.type') {
                let type;
                if (payload === null) type = 'null';
                else if (Array.isArray(payload)) type = 'array';
                else if (typeof payload === 'object') type = 'object';
                else type = typeof payload;

                return {
                    valid: true,
                    result: type,
                    error: null
                };
            }
            if (expression.match(/^(all|any|map|select|group_by|min|max|min_by|max_by)\(.+\[];.+\)$/)) {
                try {
                    // Extract the function name and content
                    const functionMatch = expression.match(/^(all|any|map|select|group_by|min|max|min_by|max_by)\((.+)\)$/);
                    if (!functionMatch) {
                        return {
                            valid: false,
                            result: null,
                            error: `Invalid array iteration expression format: ${expression}`
                        };
                    }
                    const functionName = functionMatch[1];
                    const functionContent = functionMatch[2];

                    // Split into array path and operation
                    const parts = functionContent.split(';');
                    if (parts.length < 2) {
                        return {
                            valid: false,
                            result: null,
                            error: `Array iteration expression must have format: ${functionName}(path[]; operation)`
                        };
                    }

                    const arrayPath = parts[0].trim();
                    const operation = parts.slice(1).join(';').trim();
                    const arrayPathWithoutIteration = arrayPath.replace(/\[]$/, '');
                    const arrayResult = mockJQValidation(payload, arrayPathWithoutIteration);
                    if (!arrayResult.valid || !Array.isArray(arrayResult.result)) {
                        return {
                            valid: false,
                            result: null,
                            error: `Path '${arrayPathWithoutIteration}' does not resolve to an array or is invalid`
                        };
                    }

                    const array = arrayResult.result;
                    switch (functionName) {
                        case 'all': {
                            const conditionMatch = operation.match(/^\s*\.\s*==\s*"([^"]+)"\s*$/);
                            if (!conditionMatch) {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `For 'all' function, only conditions in the form '. == "value"' are supported currently`
                                };
                            }
                            const checkValue = conditionMatch[1];
                            const allMatch = array.every(item => item === checkValue);
                            return {
                                valid: true,
                                result: allMatch,
                                error: null
                            };
                        }

                        case 'any': {
                            const conditionMatch = operation.match(/^\s*\.\s*==\s*"([^"]+)"\s*$/);
                            if (!conditionMatch) {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `For 'any' function, only conditions in the form '. == "value"' are supported currently`
                                };
                            }
                            const checkValue = conditionMatch[1];
                            const anyMatch = array.some(item => item === checkValue);
                            return {
                                valid: true,
                                result: anyMatch,
                                error: null
                            };
                        }

                        case 'map': {
                            // Handle simple mappings like .property or .
                            if (operation === '.') {
                                return {
                                    valid: true,
                                    result: array,
                                    error: null
                                };
                            } else if (operation.startsWith('.')) {
                                const property = operation.substring(1);
                                const mappedArray = array.map(item => {
                                    if (typeof item === 'object' && item !== null && property in item) {
                                        return item[property];
                                    }
                                    return null;
                                });
                                return {
                                    valid: true,
                                    result: mappedArray,
                                    error: null
                                };
                            } else {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `For 'map' function, only operations in the form '.' or '.property' are supported currently`
                                };
                            }
                        }

                        case 'select': {
                            if (operation.includes(' == ')) {
                                const [leftSide, rightSide] = operation.split(' == ').map(s => s.trim());
                                let propertyName = null;
                                if (leftSide.startsWith('.')) {
                                    propertyName = leftSide.substring(1);
                                }
                                let comparisonValue = rightSide;
                                if ((rightSide.startsWith('"') && rightSide.endsWith('"')) ||
                                    (rightSide.startsWith("'") && rightSide.endsWith("'"))) {
                                    comparisonValue = rightSide.substring(1, rightSide.length - 1);
                                }

                                if (propertyName) {
                                    const filteredArray = array.filter(item => {
                                        return typeof item === 'object' &&
                                            item !== null &&
                                            propertyName in item &&
                                            item[propertyName] === comparisonValue;
                                    });
                                    return {
                                        valid: true,
                                        result: filteredArray,
                                        error: null
                                    };
                                } else {
                                    // If it's just ".", compare the item directly
                                    const filteredArray = array.filter(item => item === comparisonValue);
                                    return {
                                        valid: true,
                                        result: filteredArray,
                                        error: null
                                    };
                                }
                            } else {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `For 'select' function, only conditions with equality operations (==) are supported currently`
                                };
                            }
                        }

                        case 'min':
                            if (array.every(item => typeof item === 'number')) {
                                return {
                                    valid: true,
                                    result: Math.min(...array),
                                    error: null
                                };
                            } else {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `'min' function requires an array of numbers`
                                };
                            }

                        case 'max':
                            if (array.every(item => typeof item === 'number')) {
                                return {
                                    valid: true,
                                    result: Math.max(...array),
                                    error: null
                                };
                            } else {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `'max' function requires an array of numbers`
                                };
                            }

                        case 'min_by': {
                            if (operation.startsWith('.')) {
                                const property = operation.substring(1);
                                // Filter out objects that don't have the property or where it's not a number
                                const validItems = array.filter(item =>
                                    typeof item === 'object' &&
                                    item !== null &&
                                    property in item &&
                                    typeof item[property] === 'number'
                                );

                                if (validItems.length === 0) {
                                    return {
                                        valid: false,
                                        result: null,
                                        error: `No items with numeric property '${property}' found in array`
                                    };
                                }

                                const minItem = validItems.reduce((min, item) =>
                                    item[property] < min[property] ? item : min, validItems[0]);

                                return {
                                    valid: true,
                                    result: minItem,
                                    error: null
                                };
                            } else {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `For 'min_by' function, only operations in the form '.property' are supported`
                                };
                            }
                        }

                        case 'max_by': {
                            if (operation.startsWith('.')) {
                                const property = operation.substring(1);
                                const validItems = array.filter(item =>
                                    typeof item === 'object' &&
                                    item !== null &&
                                    property in item &&
                                    typeof item[property] === 'number'
                                );

                                if (validItems.length === 0) {
                                    return {
                                        valid: false,
                                        result: null,
                                        error: `No items with numeric property '${property}' found in array`
                                    };
                                }
                                const maxItem = validItems.reduce((max, item) =>
                                    item[property] > max[property] ? item : max, validItems[0]);

                                return {
                                    valid: true,
                                    result: maxItem,
                                    error: null
                                };
                            } else {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `For 'max_by' function, only operations in the form '.property' are supported`
                                };
                            }
                        }
                        case 'group_by': {
                            if (operation.startsWith('.')) {
                                const property = operation.substring(1);
                                const grouped = {};

                                array.forEach(item => {
                                    if (typeof item === 'object' && item !== null && property in item) {
                                        const key = String(item[property]);
                                        if (!grouped[key]) {
                                            grouped[key] = [];
                                        }
                                        grouped[key].push(item);
                                    }
                                });
                                return {
                                    valid: true,
                                    result: grouped,
                                    error: null
                                };
                            } else {
                                return {
                                    valid: false,
                                    result: null,
                                    error: `For 'group_by' function, only operations in the form '.property' are supported`
                                };
                            }
                        }

                        default:
                            return {
                                valid: false,
                                result: null,
                                error: `Function '${functionName}' is not implemented`
                            };
                    }
                } catch (error) {
                    return {
                        valid: false,
                        result: null,
                        error: `Error processing array iteration expression: ${error.message}`
                    };
                }
            }
            // Handle example() function that showcases different expressions
            if (expression.startsWith('example(') && expression.endsWith(')')) {
                try {
                    // Extract the expressions from inside example()
                    const exampleContent = expression.substring(8, expression.length - 1);
                    const expressions = exampleContent.split(',').map(expr => expr.trim());
                    const exampleResults = {};
                    for (const expr of expressions) {
                        const result = mockJQValidation(payload, expr);
                        exampleResults[expr] = {
                            valid: result.valid,
                            result: result.result,
                            error: result.error
                        };
                    }
                    return {
                        valid: true,
                        result: exampleResults,
                        error: null
                    };
                } catch (error) {
                    return {
                        valid: false,
                        result: null,
                        error: `Error processing example expression: ${error.message}`
                    };
                }
            }

            return {
                valid: false,
                result: null,
                error: `JQ expression '${expression}' is not supported in demo mode. Supported: ., .property, .[index], .length, . | keys, . | type, all(), any(), map(), select(), min(), max(), min_by(), max_by(), group_by(), example()`
            };

        } catch (error) {
            return {
                valid: false,
                result: null,
                error: `Error processing expression: ${error.message}`
            };
        }
    }
    function showValidationResult(valid, result, error) {
        const out = document.getElementById('jq-validation-output');
        if (!out) {
            return;
        }

        out.innerHTML = '';

        const resultsContainer = document.createElement('div');
        resultsContainer.style.cssText = `
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    `;

        // Validation Status Card
        const statusCard = document.createElement('div');
        statusCard.style.cssText = `
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background-color: ${valid ? '#f0f9ff' : '#fef2f2'};
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

        const statusTitle = document.createElement('h3');
        statusTitle.textContent = 'Validation Status';
        statusTitle.style.cssText = 'margin: 0 0 10px 0; color: #333;';
        statusCard.appendChild(statusTitle);

        const status = document.createElement('div');
        status.innerHTML = valid
            ? '<b style="color: #059669; font-size: 16px;">✓ Valid JQ Expression</b>'
            : '<b style="color: #dc2626; font-size: 16px;">✗ Invalid JQ Expression</b>';
        statusCard.appendChild(status);

        resultsContainer.appendChild(statusCard);

        // Result Card
        if (typeof result !== 'undefined' && result !== null) {
            const resultCard = document.createElement('div');
            resultCard.style.cssText = `
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        background-color: #f9fafb;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;

            const resultTitle = document.createElement('h3');
            resultTitle.textContent = 'JQ Expression Result';
            resultTitle.style.cssText = 'margin: 0 0 15px 0; color: #333;';
            resultCard.appendChild(resultTitle);

            const resultPre = document.createElement('pre');
            resultPre.textContent = JSON.stringify(result, null, 2);
            resultPre.style.cssText = `
        background-color: #fff;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 15px;
        overflow-x: auto;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        white-space: pre-wrap;
        color: #dc2626;
      `;
            resultCard.appendChild(resultPre);

            resultsContainer.appendChild(resultCard);
        }

        // Error Card
        if (error) {
            const errorCard = document.createElement('div');
            errorCard.style.cssText = `
        border: 1px solid #fca5a5;
        border-radius: 8px;
        padding: 20px;
        background-color: #fef2f2;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;

            const errorTitle = document.createElement('h3');
            errorTitle.textContent = 'Error Details';
            errorTitle.style.cssText = 'margin: 0 0 10px 0; color: #dc2626;';
            errorCard.appendChild(errorTitle);

            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<span style="color: #dc2626; font-weight: 500;">${error}</span>`;
            errorCard.appendChild(errorDiv);

            resultsContainer.appendChild(errorCard);
        }

        out.appendChild(resultsContainer);
    }

    let savedTextareaValue = '';


    function useExistingOrCreateTextarea() {
        const existingTextarea = document.getElementById('payload');
        if (existingTextarea) {
            if (existingTextarea.value && existingTextarea.value.trim() !== '') {
                savedTextareaValue = existingTextarea.value;
            }
            existingTextarea.style.display = 'block';
            existingTextarea.style.visibility = 'visible';
            existingTextarea.style.height = '200px';
            existingTextarea.style.width = '100%';
            if (savedTextareaValue && existingTextarea.value.trim() === '') {
                existingTextarea.value = savedTextareaValue;
            } else if (!savedTextareaValue && existingTextarea.value.trim() === '') {
            }

            return existingTextarea;
        }
        const form = document.getElementById('jq-validator-form');
        if (!form) {
            return null;
        }

        const jsonPayloadContainer = Array.from(form.querySelectorAll('div')).find(div => {
            const label = div.querySelector('label');
            return label && label.textContent && label.textContent.trim().includes('JSON Payload');
        });

        if (!jsonPayloadContainer) {
            return null;
        }

        const newTextarea = document.createElement('textarea');
        newTextarea.id = 'payload';
        newTextarea.name = 'payload';
        newTextarea.placeholder = 'Enter JSON payload';

        newTextarea.style.width = '100%';
        newTextarea.style.height = '200px';
        newTextarea.style.padding = '10px';
        newTextarea.style.border = '1px solid #ccc';
        newTextarea.style.borderRadius = '4px';
        newTextarea.style.fontFamily = 'monospace';
        newTextarea.style.fontSize = '14px';
        newTextarea.style.resize = 'vertical';
        newTextarea.style.display = 'block';
        newTextarea.style.visibility = 'visible';
        newTextarea.style.backgroundColor = '#454343';

        const label = jsonPayloadContainer.querySelector('label');
        if (label) {
            label.parentNode.insertBefore(newTextarea, label.nextSibling);
        } else {
            jsonPayloadContainer.appendChild(newTextarea);
        }

        return newTextarea;
    }

    function validateJQ() {
        const payloadInput = useExistingOrCreateTextarea();
        const expressionInput = document.getElementById('jq-expression-input');

        if (!payloadInput || !expressionInput) {
            showValidationResult(false, undefined, 'Form elements not found');
            return;
        }

        const payload = payloadInput.value.trim();
        const expression = expressionInput.value.trim();

        if (!payload) {
            showValidationResult(false, undefined, 'Please enter a JSON payload');
            return;
        }

        if (!expression) {
            showValidationResult(false, undefined, 'Please enter a JQ expression');
            return;
        }

        try {
            const parsedPayload = JSON.parse(payload);
            const result = mockJQValidation(parsedPayload, expression);
            showValidationResult(result.valid, result.result, result.error);
        } catch (parseError) {
            showValidationResult(false, undefined, 'Invalid JSON format in payload');
        }
    }

    window.validateJQ = validateJQ;

    function handleSubmitClick(e) {
        if (e) e.preventDefault();
        validateJQ();
    }
    function findSubmitButton(element) {
        let current = element;
        while (current && current !== document) {
            if (current.id === 'submit') {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    function initializeValidatorButton() {
        const submitButton = document.getElementById('submit');
        if (submitButton) {
            submitButton.removeEventListener('click', handleSubmitClick);
            submitButton.addEventListener('click', handleSubmitClick);
            return true;
        }
        return false;
    }

    document.addEventListener('click', function(e) {
        const submitButton = findSubmitButton(e.target);
        if (submitButton) {
            e.preventDefault();
            validateJQ();
        }
    });
    function setupMutationObserver() {
        const form = document.getElementById('jq-validator-form');
        if (!form) return;

        const observer = new MutationObserver(function() {
            // Removed 'mutations' parameter since it's not being used
            const textareaExists = !!document.getElementById('payload');
            if (!textareaExists) {
                useExistingOrCreateTextarea();
            }
            initializeValidatorButton();
        });
        observer.observe(form, {
            childList: true,
            subtree: true,
            attributes: true
        });
        observer.observe(document.body, {
            childList: true,
            subtree: false
        });

        return observer;
    }

    function startPeriodicCheck() {
        useExistingOrCreateTextarea();
        return setInterval(() => {
            const textarea = document.getElementById('payload');
            if (!textarea || textarea.style.display === 'none' || textarea.style.visibility === 'hidden') {
                useExistingOrCreateTextarea();
            }
        }, 1000);
    }
    function init() {
        useExistingOrCreateTextarea();
        initializeValidatorButton();
        const observer = setupMutationObserver();
        const intervalId = startPeriodicCheck();
        window.validatorCleanup = function() {
            if (observer) observer.disconnect();
            if (intervalId) clearInterval(intervalId);
        };
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('load', init);
})();