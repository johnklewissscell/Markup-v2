const fileContents = {
    'main.rs': `fn main() {\n    let name = "Rustacean";\n    println!("Hello, {}!", name);\n\n    let a = 5;\n    let b = 10;\n    println!("{} + {} = {}", a, b, a + b);\n\n    let numbers = vec![1, 2, 3];\n    println!("Vector: {:?}", numbers);\n}`
};

let currentFile = 'main.rs';
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
consoleWindow.style.fontFamily = '"Fira Code", monospace';
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

            tabs.forEach(t => t.classList.remove('firstfile'));
            tab.classList.add('firstfile');
        });

        if (containerId === 'outconsole' && tab.textContent.trim() === 'Console') {
            tab.click();
        }
    });
};

function simulateRust(code) {
    let output = '';
    const vars = {};

    const lines = code.split('\n');

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('let ')) {
            if (line.includes('vec!')) {
                const match = line.match(/let (\w+) = vec!\[(.*)\]/);
                if (match) {
                    vars[match[1]] = match[2].split(',').map(n => Number(n.trim()));
                }
            } else if (line.includes('=')) {
                const match = line.match(/let (\w+) = "?([^";]+)"?/);
                if (match) {
                    const name = match[1];
                    const val = isNaN(match[2]) ? match[2] : Number(match[2]);
                    vars[name] = val;
                }
            }
        }

        if (line.startsWith('println!')) {
            const inside = line.match(/println!\((.*)\)/)[1];

            const strMatch = inside.match(/"(.*?)"/);
            if (!strMatch) return;

            let text = strMatch[1];
            const args = inside.split(',').slice(1).map(a => a.trim());

            args.forEach(arg => {
                if (arg.includes('+')) {
                    const [a, b] = arg.split('+').map(x => vars[x.trim()]);
                    text = text.replace("{}", a + b);
                } else if (vars[arg] !== undefined) {
                    text = text.replace("{}", vars[arg]);
                }
            });

            if (text.includes("{:?}")) {
                const varName = args[0];
                text = text.replace("{:?}", `[${vars[varName].join(', ')}]`);
            }

            output += text + '<br>';
        }
    });

    return output;
}

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #f07178;">Compiling</span> project v0.1.0...<br><span style="color: #c3e88d;">Finished</span> dev [unoptimized + debuginfo] target(s) in 0.43s<br><span style="color: #89ddff;">Running</span> `target/debug/main`<br><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = simulateRust(editor.value) + '<br><span style="color: #c3e88d;">Process finished with exit code 0</span>';
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 400);
});

setupTabs('files');
setupTabs('outconsole');