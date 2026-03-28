const fileContents = {
    'index.html': `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="bootstrap.css">\n</head>\n<body class="p-5">\n  <div class="container">\n    <h1 class="text-primary">Bootstrap Terminal</h1>\n    <p class="lead">Click the button to trigger a Bootstrap Modal.</p>\n    <button class="btn btn-success" onclick="showMsg()">Launch Success</button>\n  </div>\n\n  <script src="bootstrap.js"></script>\n  <script>\n    function showMsg() {\n      console.log("Bootstrap Action: Button Clicked");\n      alert("Bootstrap JS is working!");\n    }\n  </script>\n</body>\n</html>`,
    'bootstrap.css': `/* Simulated Bootstrap Core */\n.container { max-width: 800px; margin: auto; }\n.p-5 { padding: 3rem; }\n.text-primary { color: #0d6efd; font-family: sans-serif; }\n.btn { padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer; }\n.btn-success { background: #198754; color: white; }\n.lead { font-size: 1.25rem; color: #6c757d; }`,
    'bootstrap.js': `console.log("Bootstrap v5.3.0 initialized...");\nconsole.log("Popper.js loaded.");`
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
consoleWindow.style.padding = '15px';
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
editor.value = fileContents[currentFile];
updateLineNumbers();

const setupTabs = (containerId) => {
    const container = document.getElementById(containerId);
    const tabs = container.querySelectorAll('.topper:not(#run)');

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
                if (tabName === 'Console') {
                    preview.style.display = 'none';
                    consoleWindow.style.display = 'block';
                } else {
                    preview.style.display = 'block';
                    consoleWindow.style.display = 'none';
                }
            }

            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });
    });
};

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    
    const fullCode = `
        <style>${fileContents['bootstrap.css']}</style>
        ${fileContents['index.html']}
        <script>${fileContents['bootstrap.js']}</script>
    `;
    
    preview.srcdoc = fullCode;
    
    const now = new Date().toLocaleTimeString();
    consoleWindow.innerHTML += `[${now}] Deploying Bootstrap assets...<br>`;
    consoleWindow.innerHTML += `[${now}] index.html updated.<br>`;
    consoleWindow.scrollTop = consoleWindow.scrollHeight;
});

setupTabs('files');
setupTabs('outconsole');