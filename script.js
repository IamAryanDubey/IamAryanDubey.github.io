// ============================================
// THEME MANAGER
// ============================================
class ThemeManager {
    constructor() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.currentTheme = localStorage.getItem('theme') || 'dark';

        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);

        // Event listener
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update button icon
        if (this.toggleBtn) {
            const sunIcon = `
                <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>`;

            const moonIcon = `
                <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>`;

            this.toggleBtn.classList.add('changing');

            setTimeout(() => {
                this.toggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
                this.toggleBtn.classList.remove('changing');
            }, 300);
        }

        // Trigger event for Matrix Rain to update
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
}

// ============================================
// MATRIX RAIN EFFECT
// ============================================
class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => this.updateTheme(e.detail.theme));
        this.currentTheme = localStorage.getItem('theme') || 'dark';
    }

    updateTheme(theme) {
        this.currentTheme = theme;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        // Adjust fade based on theme
        this.ctx.fillStyle = this.currentTheme === 'light' ? 'rgba(240, 242, 245, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));

            // Adjust color based on theme
            if (this.currentTheme === 'light') {
                this.ctx.fillStyle = '#008f24'; // Darker green for light mode
                this.ctx.globalAlpha = 0.3;     // Lower opacity
            } else {
                this.ctx.fillStyle = '#0F0'; // Default green for dark mode
                this.ctx.globalAlpha = 1;
            }

            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// TERMINAL TYPING EFFECT
// ============================================
class TerminalTyping {
    constructor(commandElement, outputElement) {
        this.commandElement = commandElement;
        this.outputElement = outputElement;
        this.commands = [
            {
                cmd: 'whoami',
                output: 'Aryan Dubey\nData Analytics & AI Engineer\nTexas Tech University | CS Major | 3.9 GPA'
            },
            {
                cmd: 'ls achievements/',
                output: '🏆 HackTX_2024_Winner/\n🏆 HackWesTX_2024_Winner/\n📊 5000+_Tickets_Analyzed/\n🤖 95%_Workload_Reduction/\n👨‍🏫 40+_Students_Mentored/'
            },
            {
                cmd: 'cat skills.txt',
                output: 'Languages: Python, JavaScript, SQL, Java, C++\nFrameworks: React, Next.js, Node.js, Flask\nML/AI: TensorFlow, PyTorch, Scikit-learn, NLP\nCloud: AWS, Azure, Docker, Terraform\nData: PowerBI, Tableau, Pandas, NumPy'
            },
            {
                cmd: 'echo $MISSION',
                output: '"Transforming data into intelligent solutions that drive real-world impact."'
            }
        ];
        this.currentCommandIndex = 0;
        this.currentCharIndex = 0;
        this.isTypingCommand = true;
    }

    async start() {
        await this.delay(1000);
        this.typeNext();
    }


    typeNext() {
        if (this.currentCommandIndex >= this.commands.length) {
            this.currentCommandIndex = 0;
            setTimeout(() => {
                this.outputElement.textContent = '';
                this.typeNext();
            }, 5000);
            return;
        }

        const current = this.commands[this.currentCommandIndex];

        if (this.isTypingCommand) {
            if (this.currentCharIndex < current.cmd.length) {
                this.commandElement.textContent += current.cmd[this.currentCharIndex];
                this.currentCharIndex++;
                setTimeout(() => this.typeNext(), 80);
            } else {
                this.isTypingCommand = false;
                this.currentCharIndex = 0;
                this.currentLineIndex = 0;
                this.currentLineChar = 0;
                this.outputLines = current.output.split('\\n');
                setTimeout(() => this.typeNext(), 500);
            }
        } else {
            // Type output line by line, character by character
            if (this.currentLineIndex < this.outputLines.length) {
                const currentLine = this.outputLines[this.currentLineIndex];

                if (this.currentLineChar < currentLine.length) {
                    // Type current line character by character
                    const displayLines = this.outputLines.slice(0, this.currentLineIndex);
                    displayLines.push(currentLine.substring(0, this.currentLineChar + 1));
                    this.outputElement.textContent = displayLines.join('\n');
                    this.currentLineChar++;
                    setTimeout(() => this.typeNext(), 30);
                } else {
                    // Move to next line
                    this.currentLineIndex++;
                    this.currentLineChar = 0;
                    setTimeout(() => this.typeNext(), 400); // Pause between lines
                }
            } else {
                this.currentCommandIndex++;
                this.currentCharIndex = 0;
                this.isTypingCommand = true;
                setTimeout(() => {
                    this.commandElement.textContent = '';
                    this.outputElement.textContent += '\n\n';
                    this.typeNext();
                }, 3000);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// ANIMATED STATS COUNTER
// ============================================
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
    }

    animate() {
        if (this.hasAnimated) return;

        this.stats.forEach(stat => {
            const target = parseFloat(stat.dataset.target);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
                    clearInterval(timer);
                } else {
                    stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                }
            }, duration / steps);
        });

        this.hasAnimated = true;
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        const statsSection = document.querySelector('.live-stats');
        if (statsSection) {
            observer.observe(statsSection);
        } else {
            // Fallback if section not found or observer fails
            setTimeout(() => this.animate(), 1000);
        }
    }
}

// ============================================
// 3D SKILLS CONSTELLATION
// ============================================
class SkillsConstellation {
    constructor(container) {
        this.container = container;
        // Expanded to 8 Categories (Centered & Lifted)
        this.skills = [
            { name: 'Languages', class: 'python', x: 20, y: 25, details: ['Python', 'JavaScript', 'C++', 'Java', 'SQL'] },
            { name: 'Frontend', class: 'react', x: 35, y: 35, details: ['React', 'Next.js', 'TailwindCSS', 'HTML5/CSS3'] },
            { name: 'Backend', class: 'ml', x: 50, y: 25, details: ['Node.js', 'Express', 'REST APIs', 'FastAPI'] },
            { name: 'ML / AI', class: 'ml', x: 65, y: 30, details: ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'] },
            { name: 'Data', class: 'python', x: 30, y: 50, details: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'] },
            { name: 'Cloud', class: 'ml', x: 50, y: 50, details: ['AWS', 'Azure', 'Firebase', 'Vercel'] },
            { name: 'DevOps', class: 'python', x: 70, y: 50, details: ['Docker', 'Terraform', 'Git', 'CI/CD'] },
            { name: 'Tools', class: 'react', x: 40, y: 65, details: ['PowerBI', 'Tableau', 'JIRA', 'Postman'] }
        ];
        this.orbs = [];
        this.mouse = { x: -1000, y: -1000 };
        this.render();
        this.animate();
        this.createModal();
    }

    createModal() {
        // Create modal structure if it doesn't exist
        if (!document.getElementById('skill-modal')) {
            const modal = document.createElement('div');
            modal.id = 'skill-modal';
            modal.className = 'skill-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="modal-title"></h3>
                    <ul id="modal-list"></ul>
                </div>
            `;
            document.body.appendChild(modal);

            // Close logic
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
    }

    openModal(skill) {
        const modal = document.getElementById('skill-modal');
        const title = document.getElementById('modal-title');
        const list = document.getElementById('modal-list');

        title.textContent = skill.name;
        list.innerHTML = skill.details.map(item => `<li>${item}</li>`).join('');
        modal.classList.add('active');
    }

    render() {
        this.container.innerHTML = ''; // Clear container
        this.skills.forEach(skill => {
            const orb = document.createElement('div');
            orb.className = `skill-orb ${skill.class}`;
            orb.textContent = skill.name;
            orb.style.left = `${skill.x}%`;
            orb.style.top = `${skill.y}%`;

            // Add click handler
            orb.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent run-away when clicking
                this.openModal(skill);
            });

            // Store physics properties
            const orbObj = {
                element: orb,
                x: 0, // current offset x
                y: 0, // current offset y
                vx: 0, // velocity x
                vy: 0, // velocity y
                ox: skill.x, // original percentage x
                oy: skill.y  // original percentage y
            };
            this.orbs.push(orbObj);
            this.container.appendChild(orb);
        });

        // Track mouse position relative to container
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    animate() {
        const containerRect = this.container.getBoundingClientRect();

        this.orbs.forEach(orb => {
            // Get current absolute center of orb (base position + offset)
            const baseX = (orb.ox / 100) * containerRect.width;
            const baseY = (orb.oy / 100) * containerRect.height;
            const currentX = baseX + orb.x;
            const currentY = baseY + orb.y;

            // Calculate distance to mouse
            const dx = currentX - this.mouse.x;
            const dy = currentY - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Physics Interaction
            if (distance < 250) {
                const angle = Math.atan2(dy, dx); // Fixed: Define angle
                if (distance < 80) {
                    // Magnetic Capture: SNAP to mouse if very close
                    const pull = 0.5;
                    orb.vx -= Math.cos(angle) * pull;
                    orb.vy -= Math.sin(angle) * pull;
                } else {
                    // Repulsion: Run away
                    const force = (250 - distance) / 250;
                    const push = force * 2.0;
                    orb.vx += Math.cos(angle) * push;
                    orb.vy += Math.sin(angle) * push;
                }
            }

            // Spring force (return to origin)
            const springStrength = 0.05;
            orb.vx -= orb.x * springStrength;
            orb.vy -= orb.y * springStrength;

            // Friction (damping)
            const friction = 0.9;
            orb.vx *= friction;
            orb.vy *= friction;

            // Update position
            orb.x += orb.vx;
            orb.y += orb.vy;

            // Boundary Constraints (Soft Bounce)
            // Boundary Constraints (Rigid Clamp + Bounce)
            const margin = 70; // Increased buffer

            // X-axis check
            if (currentX < margin) {
                orb.x = margin - baseX; // Clamp exact position
                orb.vx = Math.abs(orb.vx) * 0.5; // Bounce right
            } else if (currentX > containerRect.width - margin) {
                orb.x = (containerRect.width - margin) - baseX;
                orb.vx = -Math.abs(orb.vx) * 0.5; // Bounce left
            }

            // Y-axis check
            if (currentY < margin) {
                orb.y = margin - baseY;
                orb.vy = Math.abs(orb.vy) * 0.5; // Bounce down
            } else if (currentY > containerRect.height - margin) {
                orb.y = (containerRect.height - margin) - baseY;
                orb.vy = -Math.abs(orb.vy) * 0.5; // Bounce up
            }

            // Apply transform
            const scale = 1 + (Math.abs(orb.vx) + Math.abs(orb.vy)) * 0.01;
            orb.element.style.transform = `translate(${orb.x}px, ${orb.y}px) scale(${Math.min(scale, 1.2)})`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// PROJECT CARDS ANIMATION
// ============================================
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.cards.forEach(c => {
                    if (c !== card) {
                        c.style.opacity = '0.5';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                this.cards.forEach(c => {
                    c.style.opacity = '1';
                });
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// PARALLAX SCROLL EFFECT
// ============================================
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.skill-orb');

        parallaxElements.forEach((el, index) => {
            const speed = (index % 3 + 1) * 0.1;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ============================================
// INTERACTIVE TERMINAL
// ============================================
class InteractiveTerminal {
    constructor() {
        this.terminal = document.getElementById('interactive-terminal');
        this.toggleBtn = document.getElementById('terminal-toggle');
        this.input = document.getElementById('terminal-input');
        this.history = document.getElementById('terminal-history');
        this.commandHistory = [];
        this.historyIndex = -1;

        this.commands = {
            help: () => this.showHelp(),
            about: () => 'Aryan Dubey - Data Analytics & AI Engineer\\nTexas Tech University | CS Major | 3.9 GPA\\nPassionate about transforming data into intelligent solutions.',
            skills: () => 'Languages: Python, JavaScript, SQL, Java, C++\\nFrameworks: React, Next.js, Node.js, Flask\\nML/AI: TensorFlow, PyTorch, Scikit-learn, NLP\\nCloud: AWS, Azure, Docker, Terraform\\nData: PowerBI, Tableau, Pandas, NumPy',
            projects: () => '1. TempTerra - HackTX 2024 Winner\\n   Predictive Resource Optimization System\\n\\n2. FleetRank - HackWesTX 2024 Winner\\n   Real-Time Fleet Analytics Dashboard\\n\\n3. DocMent - Healthcare AI\\n   AI-Powered Medical Intelligence Platform',
            experience: () => 'IT Student Assistant @ Texas Tech University (2023-Present)\\n- Built AI ticket classification model (5,000+ requests)\\n- Automated workflows reducing IT workload by 95%\\n\\nTech Lead @ CodePath TTU (2023-Present)\\n- Led MERN stack workshops (40+ students)\\n- Built codepathttu.org website',
            education: () => 'Texas Tech University\\nBachelor of Science in Computer Science\\nGPA: 3.9/4.0 | Expected: 2026\\nFocus: Data Analytics, Machine Learning, AI',
            contact: () => 'Email: ardubey@ttu.edu\\nPhone: +1(806)758-2024\\nGitHub: github.com/IamAryanDubey\\nLinkedIn: linkedin.com/in/thisisaryandubey\\nLocation: Lubbock, TX 79401',
            achievements: () => '🏆 HackTX 2024 Winner - TempTerra\\n🏆 HackWesTX 2024 Winner - FleetRank\\n📊 5,000+ IT Tickets Analyzed\\n🤖 95% Workload Reduction Achieved\\n👨‍🏫 40+ Students Mentored',
            clear: () => {
                this.history.innerHTML = '';
                return '';
            },
            whoami: () => 'visitor',
            date: () => new Date().toLocaleString(),
            echo: (args) => args.join(' '),
            ls: () => 'about  skills  projects  experience  education  contact  achievements',
            pwd: () => '/home/aryan/portfolio',
            cat: (args) => {
                const file = args[0];
                if (this.commands[file]) {
                    return this.commands[file]();
                }
                return `cat: ${file}: No such file or directory`;
            }
        };

        this.init();
    }

    init() {
        if (!this.terminal) return;

        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Auto-focus input when terminal is visible
        this.input.focus();

        // Initial height sync
        this.updateHeightVariable();
    }

    toggle() {
        this.terminal.classList.toggle('minimized');
        this.toggleBtn.textContent = this.terminal.classList.contains('minimized') ? '▲' : '▼';
        if (!this.terminal.classList.contains('minimized')) {
            this.input.focus();
        }
        // Update height variable
        this.updateHeightVariable();
    }

    updateHeightVariable() {
        // If minimized, visible height is just the header (approx 45px)
        // If open, it's the full offsetHeight
        const isMinimized = this.terminal.classList.contains('minimized');
        const height = isMinimized ? 45 : this.terminal.offsetHeight;
        document.documentElement.style.setProperty('--visible-terminal-height', `${height}px`);
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }

    executeCommand() {
        const input = this.input.value.trim();
        if (!input) return;

        this.commandHistory.push(input);
        this.historyIndex = this.commandHistory.length;

        // Display command
        this.addToHistory(`<div class="terminal-command-line">visitor@aryan:~$ ${input}</div>`);

        // Parse and execute
        const [cmd, ...args] = input.split(' ');
        const result = this.runCommand(cmd.toLowerCase(), args);

        if (result) {
            this.addToHistory(`<div class="terminal-result">${result}</div>`);
        }

        this.input.value = '';
        this.scrollToBottom();
    }

    runCommand(cmd, args) {
        if (this.commands[cmd]) {
            try {
                return this.commands[cmd](args);
            } catch (error) {
                return `<span class="terminal-error">Error executing command: ${error.message}</span>`;
            }
        } else {
            return `<span class="terminal-error">Command not found: ${cmd}. Type 'help' for available commands.</span>`;
        }
    }

    showHelp() {
        return `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help        - Show this help message
  about       - Learn about Aryan
  skills      - View technical skills
  projects    - See featured projects
  experience  - View work experience
  education   - Educational background
  contact     - Get contact information
  achievements- View achievements and awards
  clear       - Clear terminal screen
  whoami      - Display current user
  date        - Show current date and time
  echo [text] - Print text to terminal
  ls          - List available sections
  pwd         - Print working directory
  cat [file]  - Display file contents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tip: Use Tab for autocomplete, ↑↓ for command history`;
    }

    navigateHistory(direction) {
        const newIndex = this.historyIndex + direction;
        if (newIndex >= 0 && newIndex < this.commandHistory.length) {
            this.historyIndex = newIndex;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (newIndex === this.commandHistory.length) {
            this.historyIndex = newIndex;
            this.input.value = '';
        }
    }

    autocomplete() {
        const input = this.input.value.trim().toLowerCase();
        if (!input) return;

        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addToHistory(`<div class="terminal-result">${matches.join('  ')}</div>`);
            this.scrollToBottom();
        }
    }

    addToHistory(html) {
        const div = document.createElement('div');
        div.className = 'terminal-output-line';
        div.innerHTML = html;
        this.history.appendChild(div);
    }

    scrollToBottom() {
        this.history.parentElement.scrollTop = this.history.parentElement.scrollHeight;
    }
}


// ============================================
// PROJECT DETAILS MODAL
// ============================================
class ProjectDetailsModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.closeBtn = this.modal.querySelector('.close-btn');
        this.modalElements = {
            badge: document.getElementById('modal-badge'),
            title: document.getElementById('modal-title'),
            techStack: document.getElementById('modal-tech-stack'),
            purpose: document.getElementById('modal-purpose'),
            functionality: document.getElementById('modal-functionality'),
            technical: document.getElementById('modal-technical'),
            impact: document.getElementById('modal-impact')
        };

        this.projectData = {
            'tempterra': {
                title: 'TempTerra',
                badge: '🏆 HackTX 2024 Winner',
                techStack: ['Python', 'SQL', 'Terraform', 'AWS'],
                purpose: 'To efficiently predict and manage cloud resource scaling based on real-time traffic patterns, reducing costs and latency.',
                functionality: 'A predictive system that analyzes historical and real-time logs to forecast load. It automatically provisions resources just-in-time and deprovisions them when not needed.',
                technical: 'Built on AWS with Lambda functions for serverless compute. Uses Terraform for Infrastructure as Code (IaC). A Python-based ML model (ARIMA) runs on EC2 to predict traffic spikes.',
                impact: [
                    'Achieved 40% higher scaling accuracy compared to default AWS Auto Scaling.',
                    'Reduced idle memory usage by 60%.',
                    'Analyzed over 10,000 log entries for model training.',
                    'Secured 1st Place at HackTX 2024.'
                ]
            },
            'fleetrank': {
                title: 'FleetRank',
                badge: '🏆 HackWesTX 2024 Winner',
                techStack: ['React', 'Next.js', 'MongoDB', 'PowerBI'],
                purpose: 'To optimize logistics and fleet management by providing real-time data insights, reducing operational inefficiencies and downtime.',
                functionality: 'A comprehensive dashboard that tracks vehicle health, fuel consumption, and driver behavior in real-time. It alerts managers about potential breakdowns and suggests optimal routes.',
                technical: 'Built with Next.js for server-side rendering and SEO. Uses MongoDB for storing massive telemetry data. PowerBI integration provides visualization. Real-time updates are handled via WebSockets.',
                impact: [
                    '30% Boost in operational productivity verified by pilot testing.',
                    '25% Reduction in vehicle downtime through predictive maintenance.',
                    'Processed 1000+ fleet records without latency.',
                    'Awarded 1st Place at HackWesTX 2024 Hackathon.'
                ]
            },
            'docment': {
                title: 'DocMent',
                badge: '🏥 Healthcare AI',
                techStack: ['Python', 'NLP', 'OpenAI', 'MERN'],
                purpose: 'To streamling medical documentation, allowing doctors to focus more on patients and less on paperwork.',
                functionality: 'An AI assistant that listens to patient consultations (with consent) and automatically generates structured medical notes (SOAP format). It also flags potential drug interactions.',
                technical: 'Utilizes OpenAI whisper for transcription and a fine-tuned GPT model for extracting medical entities. The backend is Python (Flask) for AI processing, connected to a MERN stack dashboard.',
                impact: [
                    '75% Reduction in manual data entry time.',
                    'Saved doctors approx. 60% of review time per patient.',
                    'Achieved 85% accuracy in medical entity recognition.',
                    'Securely handles patient data with HIPAA-compliant design patterns.'
                ]
            },
            'codet': {
                title: 'Codet',
                badge: '🎓 Educational Platform',
                techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
                purpose: 'To provide a centralized platform for CodePath TTU students to access resources, submit assignments, and track their progress.',
                functionality: 'A Learning Management System (LMS) custom-built for the club. Features include user authentication, assignment submission portals, leaderboards, and a resource library.',
                technical: 'Full MERN stack application. JWT for secure authentication. RESTful API architecture. MongoDB Aggregation pipelines used for leaderboard calculations.',
                impact: [
                    'Impacted 50+ students in the first semester.',
                    '100% Custom CMS allows execs to update content without code.',
                    'Increased club engagement by gamifying the learning process.',
                    'Serves as the central hub for the university\'s top tech community.'
                ]
            },
            'power-predictor': {
                title: 'Power Output Predictor',
                badge: '⚡ Energy Analytics',
                techStack: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
                purpose: 'To predict energy output of power plants based on environmental variables, aiding in grid load balancing.',
                functionality: 'A regression model that takes inputs like temperature, pressure, and humidity to forecast electricity generation. It helps operators plan for demand/supply gaps.',
                technical: 'Trained using Random Forest Regressor on a dataset of 6000+ entries. Features were normalized using Scikit-learn standards. Verified with K-Fold cross-validation.',
                impact: [
                    'Achieved an R² Score of 0.92, indicating high predictive accuracy.',
                    'Analyzed over 6000 data points to train the model.',
                    'Demonstrates strong capability in AI for sustainability.',
                    'Visualized complex correlations using Matplotlib heatmaps.'
                ]
            }
        };

        this.init();
    }

    init() {
        // Event delegation for project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                this.openModal(projectId);
            });
        });

        // Close button click
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // Click outside modal
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const data = this.projectData[projectId];
        if (!data) return;

        // Populate Data
        this.modalElements.badge.textContent = data.badge;
        this.modalElements.title.textContent = data.title;
        this.modalElements.purpose.textContent = data.purpose;
        this.modalElements.functionality.textContent = data.functionality;
        this.modalElements.technical.textContent = data.technical;

        // Populate Tech Stack
        this.modalElements.techStack.innerHTML = data.techStack
            .map(tech => `<span class="tech">${tech}</span>`)
            .join('');

        // Populate Impact List
        this.modalElements.impact.innerHTML = data.impact
            .map(item => `<li>${item}</li>`)
            .join('');

        // Show Modal
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize Theme
        new ThemeManager();

        // Initialize Matrix Rain
        const matrixCanvas = document.getElementById('matrix-canvas');
        if (matrixCanvas) {
            const matrix = new MatrixRain(matrixCanvas);
            matrix.animate();
        }

        // Initialize Terminal Typing
        const commandElement = document.getElementById('terminal-command');
        const outputElement = document.getElementById('terminal-output');
        if (commandElement && outputElement) {
            const terminal = new TerminalTyping(commandElement, outputElement);
            terminal.start();
        }

        // Initialize Stats Counter
        const statsCounter = new StatsCounter();
        statsCounter.init();

        // Initialize Skills Constellation
        const constellationContainer = document.getElementById('constellation');
        if (constellationContainer) {
            new SkillsConstellation(constellationContainer);
        }

        // Initialize Project Cards
        const projectCards = new ProjectCards();

        // Initialize Smooth Scroll
        initSmoothScroll();

        // Initialize Parallax
        initParallax();
        // Initialize Interactive Terminal
        new InteractiveTerminal();

        // Initialize Project Details Modal
        new ProjectDetailsModal();

        console.log('Portfolio loaded!');
    } catch (error) {
        console.error('Critical Error:', error);
        const termOut = document.getElementById('terminal-output');
        if (termOut) {
            termOut.innerHTML += `\n<span style="color:red; font-weight:bold;">[SYSTEM ERROR]: ${error.message}</span>\n<span style="color:#ff5555;">${error.stack}</span>`;
        }
    }
});
