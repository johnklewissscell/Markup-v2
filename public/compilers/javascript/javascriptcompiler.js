const fileContents = {
    'script.js': `// JavaScript Console Example\nconsole.log("Hello! Welcome to the JS Console.");\n\nfunction calculateSum(a, b) {\n    return a + b;\n}\n\nconst result = calculateSum(5, 10);\nconsole.log("The result of 5 + 10 is:", result);\n\nconsole.error("This is an example of an error message.");`,
    'data.js': `// Additional JS file\nconst userData = {\n    name: "Gemini",\n    status: "Active"\n};`
};

let currentFile = 'script.js';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');

const consoleWindow = document.createElement('div');
consoleWindow.id = 'console-window';
consoleWindow.style.display = 'block';
consoleWindow.style.width = '100%';
consoleWindow.style.height = '100%';
consoleWindow.style.background = '#1e1e1e';
consoleWindow.style.color = '#dcdcdc';
consoleWindow.style.overflowY = 'auto';
consoleWindow.style.padding = '15px';
consoleWindow.style.boxSizing = 'border-box';
consoleWindow.style.fontFamily = 'monospace';
consoleWindow.style.fontSize = '13px';
consoleWindow.style.lineHeight = '1.6';

const outputContainer = document.querySelector('.output');
outputContainer.appendChild(consoleWindow);

if (preview) {
    preview.style.display = 'none';
}

const updateLineNumbers = () => {
    const lines = editor.value.split('\n').length;
    let numberString = '';
    for (let i = 1; i <= lines; i++) {
        numberString += i + '<br>';
    }
    lineNumbers.innerHTML = numberString;
};

editor.addEventListener('input', updateLineNumbers);
editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
});

editor.value = fileContents[currentFile];
updateLineNumbers();

const setupTabs = (containerId) => {
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.topper:not(#run)');
    let selectedTab = container.querySelector('.firstfile');

    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => tab.classList.add('firstfile'));
        tab.addEventListener('mouseleave', () => {
            tabs.forEach(t => t.classList.remove('firstfile'));
            if (selectedTab) selectedTab.classList.add('firstfile');
        });

        tab.addEventListener('click', () => {
            const tabName = tab.textContent.trim();

            if (containerId === 'files') {
                fileContents[currentFile] = editor.value;
                currentFile = tabName;
                editor.value = fileContents[currentFile];
                updateLineNumbers();
            }
            
            if (containerId === 'outconsole') {
                preview.style.display = 'none';
                consoleWindow.style.display = 'block';
            }

            selectedTab = tab;
            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });

        if (containerId === 'outconsole' && tab.textContent.trim() === 'Console') {
            tab.classList.add('firstfile');
        }
    });
};

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '';
    
    const codeToRun = fileContents['script.js'];

    try {
        const logs = [];
        const customConsole = {
            log: (...args) => logs.push({ type: 'log', text: args.join(' ') }),
            error: (...args) => logs.push({ type: 'error', text: args.join(' ') }),
            warn: (...args) => logs.push({ type: 'warn', text: args.join(' ') })
        };

        const runCode = new Function('console', codeToRun);
        runCode(customConsole);

        logs.forEach(log => {
            const entry = document.createElement('div');
            entry.textContent = `> ${log.text}`;
            entry.style.marginBottom = '4px';
            if (log.type === 'error') entry.style.color = '#ff5555';
            if (log.type === 'warn') entry.style.color = '#ffb86c';
            consoleWindow.appendChild(entry);
        });

    } catch (err) {
        const errorEntry = document.createElement('div');
        errorEntry.style.color = '#ff5555';
        errorEntry.textContent = `[Runtime Error]: ${err.message}`;
        consoleWindow.appendChild(errorEntry);
    }
    
    consoleWindow.scrollTop = consoleWindow.scrollHeight;
});

setupTabs('files');
setupTabs('outconsole');