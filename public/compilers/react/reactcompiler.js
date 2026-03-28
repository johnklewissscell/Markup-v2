const fileContents = {
    'index.html': `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="root"></div>\n  <script src="index.js"></script>\n</body>\n</html>`,
    'react.jsx': `const App = () => {\n  const [count, setCount] = React.useState(0);\n\n  return (\n    <div className="react-app">\n      <h1>Hello React!</h1>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click Me\n      </button>\n    </div>\n  );\n};`,
    'styles.css': `.react-app {\n  font-family: sans-serif;\n  text-align: center;\n  margin-top: 50px;\n}\nbutton {\n  padding: 10px 20px;\n  background: #61dafb;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n}`,
    'index.js': `console.log("React DOM rendering...");\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`
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
consoleWindow.style.overflowY = 'auto';
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
    if (!container) return;

    const tabs = container.querySelectorAll('.topper:not(#run)');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.textContent.trim();

            if (containerId === 'files') {
                fileContents[currentFile] = editor.value;
                currentFile = tabName;
                editor.value = fileContents[currentFile] || "";
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
    
    const babelCdn = '<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>';
    const reactCdn = '<script src="https://unpkg.com/react@18/umd/react.development.js"></script>';
    const reactDomCdn = '<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>';

    const fullCode = `
        <html>
        <head>
            <style>${fileContents['styles.css']}</style>
            ${reactCdn}
            ${reactDomCdn}
            ${babelCdn}
        </head>
        <body>
            <div id="root"></div>
            <script type="text/babel">
                ${fileContents['react.jsx']}
                ${fileContents['index.js']}
            </script>
        </body>
        </html>
    `;
    
    preview.srcdoc = fullCode;
    
    const now = new Date().toLocaleTimeString();
    consoleWindow.innerHTML += `[${now}] React build started...<br>`;
    consoleWindow.innerHTML += `[${now}] DOM rendered successfully.<br>`;
    consoleWindow.scrollTop = consoleWindow.scrollHeight;
});

preview.style.display = 'block';
consoleWindow.style.display = 'none';

setupTabs('files');
setupTabs('outconsole');