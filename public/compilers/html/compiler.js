const fileContents = {
    'index.html': `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; text-align: center; padding-top: 50px; }\n    button { padding: 10px 20px; cursor: pointer; border-radius: 8px; border: 1px solid #ddd; }\n  </style>\n</head>\n<body>\n  <h1>Markup Editor</h1>\n  <p>Check the console for logs!</p>\n  <button onclick="greet()">Click Me</button>\n</body>\n</html>`,
    'styles.css': `h1 {\n  color: #5cb85c;\n}\n\np {\n  color: #666;\n}`,
    'index.js': `function greet() {\n  console.log("Hello! This is a log message.");\n  console.error("This is what an error looks like.");\n}`
};

let currentFile = 'index.html';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('line-numbers');

const consoleWindow = document.createElement('div');
consoleWindow.id = 'console-window';
consoleWindow.style.display = 'none';
consoleWindow.style.width = '100%';
consoleWindow.style.height = '100%';
consoleWindow.style.background = '#1e1e1e';
consoleWindow.style.color = '#dcdcdc';
consoleWindow.style.overflowY = 'auto';
consoleWindow.style.padding = '10px';
consoleWindow.style.boxSizing = 'border-box';
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
                if (tabName === 'Console') {
                    preview.style.display = 'none';
                    consoleWindow.style.display = 'block';
                } else {
                    preview.style.display = 'block';
                    consoleWindow.style.display = 'none';
                }
            }

            selectedTab = tab;
            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });
    });
};

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '';

    const html = fileContents['index.html'];
    const css = `<style>${fileContents['styles.css']}</style>`;
    const js = `<script>${fileContents['index.js']}<\/script>`;
    
    const consoleScript = `
        <script>
            const oldLog = console.log;
            const oldError = console.error;
            console.log = function(...args) {
                window.parent.postMessage({type: 'log', content: args.join(' ')}, '*');
                oldLog.apply(console, args);
            };
            console.error = function(...args) {
                window.parent.postMessage({type: 'error', content: args.join(' ')}, '*');
                oldError.apply(console, args);
            };
            window.onerror = function(msg) {
                window.parent.postMessage({type: 'error', content: msg}, '*');
            };
        </script>
    `;

    const fullCode = `${consoleScript}${html}${css}${js}`;

    const project = preview.contentWindow.document;
    project.open();
    project.write(fullCode);
    project.close();
});

window.addEventListener('message', (e) => {
    if (e.data.type === 'log' || e.data.type === 'error') {
        const logEntry = document.createElement('div');
        logEntry.textContent = `> ${e.data.content}`;
        logEntry.style.padding = '5px 10px';
        logEntry.style.borderBottom = '1px solid #eee';
        logEntry.style.fontFamily = 'monospace';
        logEntry.style.fontSize = '12px';
        if (e.data.type === 'error') logEntry.style.color = 'red';
        consoleWindow.appendChild(logEntry);
    }
});

setupTabs('files');
setupTabs('outconsole');