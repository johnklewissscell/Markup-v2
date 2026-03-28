const fileContents = {
    'main.rb': `def greet(name)\n  puts "Hello, #{name}!"\nend\n\ngreet("Rubyist")\n\nnumbers = [1, 2, 3, 4, 5]\nsum = numbers.reduce(0, :+)\n\nputs "The sum of #{numbers} is #{sum}."\n\n# Simulating an object\nclass Robot\n  attr_accessor :name\n  def initialize(name)\n    @name = name\n  end\nend\n\nbot = Robot.new("RubyBot")\nputs "Robot name: #{bot.name}"`
};

let currentFile = 'main.rb';
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

document.getElementById('run').addEventListener('click', () => {
    fileContents[currentFile] = editor.value;
    consoleWindow.innerHTML = '<span style="color: #ff5c57;">$ ruby main.rb</span><br>';
    
    setTimeout(() => {
        const log = document.createElement('div');
        log.innerHTML = `Hello, Rubyist!<br>The sum of [1, 2, 3, 4, 5] is 15.<br>Robot name: RubyBot<br><br><span style="color: #f1fa8c;">=> nil</span>`;
        consoleWindow.appendChild(log);
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
    }, 450);
});

setupTabs('files');
setupTabs('outconsole');