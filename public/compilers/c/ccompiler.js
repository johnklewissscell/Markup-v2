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

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #bbb;">$ gcc main.c -o program</span><br><span style="color: #bbb;">$ ./program</span><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = `Hello, C World!<br>Sum: 30<br><br><span style="color: #55ff55;">Program exited with status 0</span>`;
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 500);
});

setupTabs('files');
setupTabs('outconsole');