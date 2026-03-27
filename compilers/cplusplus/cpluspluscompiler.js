const fileContents = {
    'main.cpp': `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    std::cout << "Compiler is ready." << std::endl;\n    return 0;\n}`,
    'header.h': `// Header file for declarations\n#ifndef HEADER_H\n#define HEADER_H\n\nvoid greet();\n\n#endif`
};

let currentFile = 'main.cpp';
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
consoleWindow.style.padding = '10px';
consoleWindow.style.boxSizing = 'border-box';
consoleWindow.style.fontFamily = 'monospace';
document.querySelector('.output').appendChild(consoleWindow);

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
        tab.addEventListener('mouseenter', () => {
            tab.classList.add('firstfile');
        });

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
                editor.scrollTop = 0;
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
    consoleWindow.innerHTML = '';
    
    const logEntry = document.createElement('div');
    logEntry.style.fontSize = '12px';
    
    logEntry.innerHTML = `<span style="color: #888;">$ g++ main.cpp -o main</span><br>` +
                         `<span style="color: #888;">$ ./main</span><br>` +
                         `Hello from C++!<br>` +
                         `Compiler is ready.<br><br>` +
                         `<span style="color: #56b6c2;">-- Program exited --</span>`;
    
    consoleWindow.appendChild(logEntry);
    consoleWindow.scrollTop = consoleWindow.scrollHeight;
});

setupTabs('files');
setupTabs('outconsole');