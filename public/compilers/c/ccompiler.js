const fileContents = {
    'main.c': `#include <stdio.h>\n\nint main() {\n    printf("Hello, C World!\\n");\n    int a = 10, b = 20;\n    printf("Sum: %d\\n", a + b);\n    return 0;\n}`
};

let currentFile = 'main.c';
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
document.querySelector('.output').appendChild(consoleWindow);

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
editor.value = fileContents[currentFile];
updateLineNumbers();

const setupTabs = (containerId) => {
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.topper:not(#run)');
    let selectedTab = container.querySelector('.firstfile');

    tabs.forEach(tab => {
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
            tab.click();
        }
    });
};

function simulateC(code) {
    let output = '';

    const printfRegex = /printf\((.*?)\);/g;
    let match;

    while ((match = printfRegex.exec(code)) !== null) {
        let content = match[1];

        const stringMatch = content.match(/"(.*?)"/);
        if (!stringMatch) continue;

        let text = stringMatch[1];

        if (content.includes('%d')) {
            const exprMatch = content.split(',')[1];
            try {
                const result = eval(exprMatch);
                text = text.replace('%d', result);
            } catch {
                text = text.replace('%d', '0');
            }
        }

        text = text.replace(/\\n/g, '<br>');
        output += text;
    }

    return output;
}

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #bbb;">$ gcc main.c -o program</span><br><span style="color: #bbb;">$ ./program</span><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = simulateC(editor.value) + '<br><br><span style="color: #55ff55;">Program exited with status 0</span>';
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 300);
});

setupTabs('files');
setupTabs('outconsole');