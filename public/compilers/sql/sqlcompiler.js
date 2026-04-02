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

const mockDB = {
    employees: [
        { id: 1, name: 'Alice', role: 'Backend Lead', department: 'Engineering' },
        { id: 2, name: 'Bob', role: 'DevOps Engineer', department: 'Engineering' },
        { id: 3, name: 'Eve', role: 'Designer', department: 'Design' },
        { id: 5, name: 'Charlie', role: 'QA Analyst', department: 'Engineering' }
    ]
};

function simulateSQL(query) {
    query = query.replace(/--.*$/gm, '').trim().toLowerCase();

    const selectMatch = query.match(/select (.+) from (\w+)( where (.+))?/);
    if (!selectMatch) return 'Invalid query<br>';

    let columns = selectMatch[1].trim();
    const table = selectMatch[2].trim();
    const whereClause = selectMatch[4];

    if (!mockDB[table]) return 'Table not found<br>';

    let rows = [...mockDB[table]];

    if (whereClause) {
        const whereMatch = whereClause.match(/(\w+)\s*=\s*'([^']+)'/);
        if (whereMatch) {
            const col = whereMatch[1];
            const val = whereMatch[2];
            rows = rows.filter(r => String(r[col]) === val);
        }
    }

    if (columns !== '*') {
        columns = columns.split(',').map(c => c.trim());
    } else {
        columns = Object.keys(rows[0] || {});
    }

    let output = '+ ' + columns.join(' | ') + ' +<br>';
    output += rows.map(r => columns.map(c => r[c]).join(' | ')).join('<br>');
    output += `<br><br>${rows.length} rows returned`;

    return output;
}

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #66d9ef;">-- Executing query...</span><br><br>';
    
    setTimeout(() => {
        const resultDiv = document.createElement('div');
        resultDiv.style.color = '#ae81ff';
        resultDiv.innerHTML = simulateSQL(editor.value);
        consoleWindow.appendChild(resultDiv);
        
        const footer = document.createElement('div');
        footer.style.marginTop = '10px';
        footer.style.color = '#a6e22e';
        footer.textContent = 'Query OK.';
        consoleWindow.appendChild(footer);
        
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 300);
});

setupTabs('files');
setupTabs('outconsole');