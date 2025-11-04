class Calculator {
    constructor() {
        this.currentOperandTextElement = document.querySelector('[data-current-operand]');
        this.previousOperandTextElement = document.querySelector('[data-previous-operand]');
        this.angleModeElement = document.querySelector('[data-angle-mode]');
        this.secondFnIndicatorElement = document.querySelector('[data-2nd-indicator]');
        this.allButtons = document.querySelectorAll('button');
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.memory = 0;
        this.isSecondFunctionActive = false;
        this.angleMode = 'deg';
        this.shouldResetScreen = false;
        if (!this.currentOperandTextElement || !this.previousOperandTextElement || !this.angleModeElement || !this.secondFnIndicatorElement) {
            console.error("Calculator Error: Required display elements not found.");
            return;
        }
        const buttonsContainer = document.querySelector('.calculator-grid');
        if (buttonsContainer) {
            buttonsContainer.addEventListener('click', (event) => this.handleClick(event));
        }
        this.updateDisplay();
    }
    handleClick(event) {
        const target = event.target;
        if (!target.matches('button'))
            return;
        if (target.dataset.action) {
            this.handleAction(target.dataset.action, target);
        }
        else if (target.dataset.value) {
            this.handleValue(target.dataset.value);
        }
    }
    handleAction(action, buttonElement) {
        switch (action) {
            case 'second-function':
                this.toggleSecondFunction();
                break;
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'calculate':
                this.compute();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'open-parenthesis':
            case 'close-parenthesis':
                this.appendNumber(action === 'open-parenthesis' ? '(' : ')');
                break;
            case 'cycle-angle-mode':
                this.cycleAngleMode();
                break;
            case 'memory-clear':
                this.memoryClear();
                break;
            case 'memory-recall':
                this.memoryRecall();
                break;
            case 'memory-add':
                this.memoryAdd();
                break;
            case 'memory-subtract':
                this.memorySubtract();
                break;
            case 'memory-store':
                this.memoryStore();
                break;
            case 'sine':
                this.applyTrigFunction('sin');
                break;
            case 'cosine':
                this.applyTrigFunction('cos');
                break;
            case 'tangent':
                this.applyTrigFunction('tan');
                break;
            case 'arc-sine':
                this.applyTrigFunction('asin');
                break;
            case 'arc-cosine':
                this.applyTrigFunction('acos');
                break;
            case 'arc-tangent':
                this.applyTrigFunction('atan');
                break;
            case 'square-root':
                this.applyScientificFunction('sqrt');
                break;
            case 'square':
                this.applyScientificFunction('square');
                break;
            case 'cube':
                this.applyScientificFunction('cube');
                break;
            case 'power':
                this.chooseOperation('pow');
                break;
            case 'root':
                this.chooseOperation('root');
                break;
            case 'log':
                this.applyScientificFunction('log10');
                break;
            case 'power-of-10':
                this.applyScientificFunction('pow10');
                break;
            case 'ln':
                this.applyScientificFunction('ln');
                break;
            case 'exp':
                this.applyScientificFunction('exp');
                break;
            case 'reciprocal':
                this.applyScientificFunction('reciprocal');
                break;
            case 'factorial':
                this.applyScientificFunction('factorial');
                break;
            case 'absolute':
                this.applyScientificFunction('abs');
                break;
            case 'modulo':
                this.chooseOperation('mod');
                break;
            case 'exponential':
                this.applyScientificFunction('exp');
                break;
            case 'power-of-e':
                this.applyScientificFunction('exp');
                break;
            case 'pi':
                this.appendNumber(Math.PI.toString());
                break;
            case 'e':
                this.appendNumber(Math.E.toString());
                break;
            case 'percentage':
                this.applyScientificFunction('percentage');
                break;
        }
    }
    handleValue(value) {
        if (['+', '-', '*', '/', 'pow', 'root', 'mod'].includes(value)) {
            this.chooseOperation(value);
        }
        else {
            this.appendNumber(value);
        }
    }
    toggleSecondFunction() {
        this.isSecondFunctionActive = !this.isSecondFunctionActive;
        this.secondFnIndicatorElement?.classList.toggle('hidden');
        this.allButtons.forEach(button => {
            if (button.dataset.secondAction) {
                const originalText = button.innerText;
                button.innerText = button.dataset.secondAction;
                button.dataset.secondAction = originalText;
            }
        });
    }
    cycleAngleMode() {
        const modes = ['deg', 'rad'];
        const currentIndex = modes.indexOf(this.angleMode);
        this.angleMode = modes[(currentIndex + 1) % modes.length];
        if (this.angleModeElement) {
            this.angleModeElement.innerText = this.angleMode.toUpperCase();
        }
    }
    applyTrigFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current))
            return;
        let radians = current;
        if (func !== 'asin' && func !== 'acos' && func !== 'atan') {
            if (this.angleMode === 'deg')
                radians = current * (Math.PI / 180);
        }
        let result = Math[func](radians);
        if (isNaN(result) || !isFinite(result)) {
            this.currentOperand = 'Error';
        }
        else {
            this.currentOperand = this.formatNumber(result);
        }
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    applyScientificFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current))
            return;
        let result;
        switch (func) {
            case 'sqrt':
                result = Math.sqrt(current);
                break;
            case 'square':
                result = Math.pow(current, 2);
                break;
            case 'cube':
                result = Math.pow(current, 3);
                break;
            case 'log10':
                result = Math.log10(current);
                break;
            case 'pow10':
                result = Math.pow(10, current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case 'exp':
                result = Math.exp(current);
                break;
            case 'reciprocal':
                result = 1 / current;
                break;
            case 'abs':
                result = Math.abs(current);
                break;
            case 'factorial':
                if (current < 0 || current !== Math.trunc(current) || current > 170) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = this.factorial(current);
                break;
            case 'percentage':
                result = current / 100;
                break;
            default:
                return;
        }
        if (isNaN(result) || !isFinite(result)) {
            this.currentOperand = 'Error';
        }
        else {
            this.currentOperand = this.formatNumber(result);
        }
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    factorial(n) {
        if (n === 0 || n === 1)
            return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    memoryClear() {
        this.memory = 0;
    }
    memoryRecall() {
        this.currentOperand = this.formatNumber(this.memory);
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    memoryAdd() {
        this.memory += parseFloat(this.currentOperand) || 0;
        this.shouldResetScreen = true;
    }
    memorySubtract() {
        this.memory -= parseFloat(this.currentOperand) || 0;
        this.shouldResetScreen = true;
    }
    memoryStore() {
        this.memory = parseFloat(this.currentOperand) || 0;
        this.shouldResetScreen = true;
    }
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.'))
            return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        }
        else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }
    chooseOperation(operation) {
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current))
            return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    this.shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            case 'pow':
                computation = Math.pow(prev, current);
                break;
            case 'root':
                computation = Math.pow(prev, 1 / current);
                break;
            case 'mod':
                computation = prev % current;
                break;
            default:
                return;
        }
        this.currentOperand = this.formatNumber(computation);
        this.operation = null;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '')
            this.currentOperand = '0';
        this.updateDisplay();
    }
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.updateDisplay();
    }
    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
        this.updateDisplay();
    }
    formatNumber(number) {
        const stringNumber = number.toLocaleString('en', { maximumFractionDigits: 10 });
        return stringNumber;
    }
    updateDisplay() {
        if (this.currentOperandTextElement) {
            this.currentOperandTextElement.innerText = this.currentOperand;
        }
        if (this.previousOperandTextElement) {
            if (this.operation != null) {
                this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.getOperatorSymbol(this.operation)}`;
            }
            else {
                this.previousOperandTextElement.innerText = '';
            }
        }
    }
    getOperatorSymbol(op) {
        switch (op) {
            case '*':
                return '×';
            case '/':
                return '÷';
            case '-':
                return '−';
            case 'pow':
                return '^';
            case 'root':
                return 'ʸ√x';
            case 'mod':
                return 'mod';
            default:
                return op;
        }
    }
}
new Calculator();