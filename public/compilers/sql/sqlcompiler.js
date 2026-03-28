const fileContents = {
    'query.sql': `-- SQL Query Example\nSELECT id, name, role \nFROM employees \nWHERE department = 'Engineering';\n\n-- Try another one:\n-- SELECT * FROM projects;`,
};

let currentFile = 'query.sql';
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
consoleWindow.style.fontFamily = '"Courier New", monospace';
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
            
            if (containerId === 'outconsole' && tab.textContent.trim() === 'Console') {
            tab.click();
        }
        });
    });
};

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #66d9ef;">-- Executing query...</span><br><br>';
    
    setTimeout(() => {
        const table = document.createElement('pre');
        table.style.margin = '0';
        table.style.color = '#ae81ff';
        
        const result = 
`+----+----------+-----------------+
| id | name     | role            |
+----+----------+-----------------+
| 1  | Alice    | Backend Lead    |
| 2  | Bob      | DevOps Engineer |
| 5  | Charlie  | QA Analyst      |
+----+----------+-----------------+
3 rows in set (0.02 sec)`;

        table.textContent = result;
        consoleWindow.appendChild(table);
        
        const footer = document.createElement('div');
        footer.style.marginTop = '10px';
        footer.style.color = '#a6e22e';
        footer.textContent = 'Query OK.';
        consoleWindow.appendChild(footer);
        
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 400);
});

setupTabs('files');
setupTabs('outconsole');