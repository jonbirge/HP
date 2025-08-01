let stack = [0, 0, 0, 0]; // T, Z, Y, X (with T = stack[3])
let currentEntry = '';
let memory = 0;

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
    switch (fn) {
        case 'sin': result = Math.sin(x); break;
        case 'cos': result = Math.cos(x); break;
        case 'tan': result = Math.tan(x); break;
        case 'asin': result = Math.asin(x); break;
        case 'acos': result = Math.acos(x); break;
        case 'atan': result = Math.atan(x); break;
        case 'sinh': result = Math.sinh ? Math.sinh(x) : (Math.exp(x) - Math.exp(-x)) / 2; break;
        case 'cosh': result = Math.cosh ? Math.cosh(x) : (Math.exp(x) + Math.exp(-x)) / 2; break;
        case 'tanh': result = Math.tanh ? Math.tanh(x) : (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x)); break;
        case 'ln': result = Math.log(x); break;
        case 'exp': result = Math.exp(x); break;
        case 'log2': result = Math.log2 ? Math.log2(x) : (Math.log(x) / Math.log(2)); break;
        case 'tenx': result = Math.pow(10, x); break;
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
        case 'fact':
            if (x < 0 || !Number.isInteger(x)) {
                alert('Factorial is only defined for non-negative integers');
                updateDisplay();
                return;
            }
            result = 1;
            for (let i = 2; i <= x; i++) result *= i;
            break;
        case 'abs': result = Math.abs(x); break;
        case 'floor': result = Math.floor(x); break;
        case 'ceil': result = Math.ceil(x); break;
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
    switch (op) {
        case 'STO': memory = stack[0]; break;
        case 'RCL': pushStack(memory); break;
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
    if (action === 'STO' || action === 'RCL') { handleMemoryOp(action); return; }
    if (['+', '-', '*', '/', 'y^x'].includes(action)) { handleArithmetic(action); return; }
    if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'ln', 'exp', 'log2', 'tenx', 'log10', 'sqrt', 'x^2', 'inv', 'fact', 'abs', 'floor', 'ceil'].includes(action)) { handleFunction(action); return; }
    alert('Unknown action: ' + action);
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
