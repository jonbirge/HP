let stack = [0, 0, 0, 0]; // T, Z, Y, X (with T = stack[3])
let currentEntry = '';
let memory = 0;
let lastX = 0;
let sumStats = { n: 0, sumX: 0, sumX2: 0, sumY: 0, sumY2: 0, sumXY: 0 };

function pushStack(newValue) {
    stack[3] = stack[2];
    stack[2] = stack[1];
    stack[1] = stack[0];
    stack[0] = newValue;
}

function popStack() {
    stack[0] = stack[1];
    stack[1] = stack[2];
    stack[2] = stack[3];
}

function updateDisplay() {
    document.getElementById('stack-t').textContent = stack[3];
    document.getElementById('stack-z').textContent = stack[2];
    document.getElementById('stack-y').textContent = stack[1];
    document.getElementById('stack-x').textContent = stack[0];
    document.getElementById('stack-entry').textContent = currentEntry;
}

function asFloat(value) {
    if (typeof value === 'string') {
        const f = parseFloat(value);
        return isNaN(f) ? 0 : f;
    }
    return value;
}

function handleDigitOrDecimal(digit) {
    currentEntry += digit;
    updateDisplay();
}

function handleEnter() {
    if (currentEntry !== '') {
        pushStack(parseFloat(currentEntry));
        currentEntry = '';
    } else {
        pushStack(stack[0]);
    }
    updateDisplay();
}

function handleClear() {
    stack = [0, 0, 0, 0];
    currentEntry = '';
    updateDisplay();
}

function handleDelete() {
    currentEntry = '';
    updateDisplay();
}

function handleDrop() {
    popStack();
    stack[3] = 0;
    updateDisplay();
}

function handleSwap() {
    const temp = stack[0];
    stack[0] = stack[1];
    stack[1] = temp;
    updateDisplay();
}

function handleRoll() {
    const x = stack[0], y = stack[1], z = stack[2], t = stack[3];
    stack[0] = y;
    stack[1] = z;
    stack[2] = t;
    stack[3] = x;
    updateDisplay();
}

function handleDup() {
    pushStack(stack[0]);
    updateDisplay();
}

function handleArithmetic(op) {
    if (currentEntry !== '') {
        pushStack(parseFloat(currentEntry));
        currentEntry = '';
    }
    const x = asFloat(stack[0]);
    const y = asFloat(stack[1]);
    popStack();
    let result;
    switch (op) {
        case '+': result = y + x; break;
        case '-': result = y - x; break;
        case '*': result = y * x; break;
        case '/':
            if (x === 0) {
                alert('Divide by zero error');
                pushStack(y);
                pushStack(x);
                updateDisplay();
                return;
            }
            result = y / x;
            break;
        case 'y^x': result = Math.pow(y, x); break;
        default: result = 0;
    }
    stack[0] = result;
    updateDisplay();
}

function handleFunction(fn) {
    if (currentEntry !== '') {
        pushStack(parseFloat(currentEntry));
        currentEntry = '';
    }
    const x = asFloat(stack[0]);
    let result = x;
    
    // Save lastX before any operation
    lastX = x;
    
    switch (fn) {
        case 'sin': result = Math.sin(x); break;
        case 'cos': result = Math.cos(x); break;
        case 'tan': result = Math.tan(x); break;
        case 'asin': result = Math.asin(x); break;
        case 'acos': result = Math.acos(x); break;
        case 'atan': result = Math.atan(x); break;
        case 'ln': result = Math.log(x); break;
        case 'exp': result = Math.exp(x); break;
        case 'log10': result = Math.log10 ? Math.log10(x) : (Math.log(x) / Math.log(10)); break;
        case 'sqrt':
            if (x < 0) {
                alert('Square root of negative number is invalid');
                updateDisplay();
                return;
            }
            result = Math.sqrt(x);
            break;
        case 'x^2': result = x * x; break;
        case 'inv':
            if (x === 0) {
                alert('Divide by zero error in 1/x');
                updateDisplay();
                return;
            }
            result = 1 / x;
            break;
        case 'abs': result = Math.abs(x); break;
        case 'int': result = Math.floor(x); break;
        case 'frac': result = x - Math.floor(x); break;
        case 'pi': result = Math.PI; break;
        case 'percent': 
            const y = asFloat(stack[1]);
            result = (y * x) / 100;
            break;
        case 'factorial':
            if (x < 0 || x > 170 || x !== Math.floor(x)) {
                alert('Invalid input for factorial');
                updateDisplay();
                return;
            }
            result = 1;
            for (let i = 2; i <= x; i++) {
                result *= i;
            }
            break;
        case 'polar':
            // Convert rectangular (x, y) to polar (r, θ)
            const yVal = asFloat(stack[1]);
            const r = Math.sqrt(x * x + yVal * yVal);
            const theta = Math.atan2(x, yVal);
            popStack();
            stack[0] = theta;
            pushStack(r);
            updateDisplay();
            return;
        case 'rect':
            // Convert polar (r, θ) to rectangular (x, y)
            const theta2 = asFloat(stack[1]);
            const xVal = x * Math.cos(theta2);
            const yVal2 = x * Math.sin(theta2);
            popStack();
            stack[0] = yVal2;
            pushStack(xVal);
            updateDisplay();
            return;
        case 'HMS':
            // Convert decimal hours to H.MS format
            const hours = Math.floor(x);
            const minutes = Math.floor((x - hours) * 60);
            const seconds = Math.round(((x - hours) * 60 - minutes) * 60);
            result = hours + minutes / 100 + seconds / 10000;
            break;
        default: break;
    }
    stack[0] = result;
    updateDisplay();
}

function handleMemoryOp(op) {
    if (currentEntry !== '') {
        pushStack(parseFloat(currentEntry));
        currentEntry = '';
    }
    const x = asFloat(stack[0]);
    const y = asFloat(stack[1]);
    
    switch (op) {
        case 'STO': 
            memory = stack[0]; 
            break;
        case 'RCL': 
            pushStack(memory); 
            break;
        case 'SUM':
            // Statistics: add data point
            sumStats.n++;
            sumStats.sumX += x;
            sumStats.sumX2 += x * x;
            if (stack[1] !== 0) {
                sumStats.sumY += y;
                sumStats.sumY2 += y * y;
                sumStats.sumXY += x * y;
            }
            break;
        case 'MEAN':
            // Calculate mean
            if (sumStats.n === 0) {
                alert('No data for statistics');
                return;
            }
            stack[0] = sumStats.sumX / sumStats.n;
            break;
        case 'STDEV':
            // Calculate standard deviation
            if (sumStats.n < 2) {
                alert('Need at least 2 data points');
                return;
            }
            const mean = sumStats.sumX / sumStats.n;
            const variance = (sumStats.sumX2 - sumStats.n * mean * mean) / (sumStats.n - 1);
            stack[0] = Math.sqrt(variance);
            break;
        case 'LR':
            // Linear regression: calculate slope and intercept
            if (sumStats.n < 2) {
                alert('Need at least 2 data points');
                return;
            }
            const n = sumStats.n;
            const slope = (n * sumStats.sumXY - sumStats.sumX * sumStats.sumY) / 
                         (n * sumStats.sumX2 - sumStats.sumX * sumStats.sumX);
            const intercept = (sumStats.sumY - slope * sumStats.sumX) / n;
            popStack();
            stack[0] = intercept;
            pushStack(slope);
            break;
    }
    updateDisplay();
}

function handleAction(action) {
    if (!isNaN(action) || action === '.') {
        handleDigitOrDecimal(action);
        return;
    }
    if (action === 'ENTER') { handleEnter(); return; }
    if (action === 'CLR') { handleClear(); return; }
    if (action === 'DEL') { handleDelete(); return; }
    if (action === 'DROP') { handleDrop(); return; }
    if (action === 'SWAP') { handleSwap(); return; }
    if (action === 'ROLL') { handleRoll(); return; }
    if (action === 'DUP') { handleDup(); return; }
    if (action === 'CHS') { handleCHS(); return; }
    if (action === 'EEX') { handleEEX(); return; }
    if (action === 'LASTX') { handleLastX(); return; }
    if (['STO', 'RCL', 'SUM', 'MEAN', 'STDEV', 'LR'].includes(action)) { handleMemoryOp(action); return; }
    if (['+', '-', '*', '/', 'y^x'].includes(action)) { handleArithmetic(action); return; }
    if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'exp', 'log10', 'sqrt', 'x^2', 'inv',
         'abs', 'int', 'frac', 'pi', 'percent', 'factorial', 'polar', 'rect', 'HMS'].includes(action)) { 
        handleFunction(action); 
        return; 
    }
    alert('Unknown action: ' + action);
}

function handleCHS() {
    if (currentEntry !== '') {
        if (currentEntry.startsWith('-')) {
            currentEntry = currentEntry.substring(1);
        } else {
            currentEntry = '-' + currentEntry;
        }
    } else {
        stack[0] = -stack[0];
    }
    updateDisplay();
}

function handleEEX() {
    if (currentEntry === '') {
        currentEntry = '1';
    }
    if (!currentEntry.includes('e')) {
        currentEntry += 'e';
    }
    updateDisplay();
}

function handleLastX() {
    pushStack(lastX);
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleAction(action);
        });
    });
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if ((key >= '0' && key <= '9') || key === '.') {
            e.preventDefault();
            handleAction(key);
            return;
        }
        if (key === 'Enter') {
            e.preventDefault();
            handleAction('ENTER');
            return;
        }
        if (key === 'Backspace') {
            e.preventDefault();
            handleAction('DEL');
            return;
        }
        if (key === 'Escape') {
            e.preventDefault();
            handleAction('CLR');
            return;
        }
        if (['+', '-', '*', '/'].includes(key)) {
            e.preventDefault();
            handleAction(key);
            return;
        }
    });
});
