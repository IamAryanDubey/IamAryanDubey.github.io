// ============================================
// PARTICLE SYSTEM
// ============================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };

        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());

        // Mouse tracking for interactive particles
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Click effect - create burst of particles
        window.addEventListener('click', (e) => {
            this.createBurst(e.clientX, e.clientY);
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                originalVx: (Math.random() - 0.5) * 0.5,
                originalVy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    createBurst(x, y) {
        // Create temporary burst particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = Math.random() * 3 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                radius: Math.random() * 3 + 1,
                life: 60, // frames to live
                isBurst: true
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        if (particle.isBurst) {
            const alpha = particle.life / 60;
            this.ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        } else {
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        }
        this.ctx.fill();
    }

    drawConnection(p1, p2, distance) {
        const opacity = 1 - (distance / this.connectionDistance);
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    update() {
        this.particles = this.particles.filter(particle => {
            // Handle burst particles
            if (particle.isBurst) {
                particle.life--;
                if (particle.life <= 0) return false;
                particle.vx *= 0.95; // Slow down
                particle.vy *= 0.95;
            } else {
                // Mouse interaction - particles move away from cursor
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = particle.x - this.mouse.x;
                    const dy = particle.y - this.mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.mouse.radius) {
                        const force = (this.mouse.radius - distance) / this.mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        particle.vx = Math.cos(angle) * force * 2;
                        particle.vy = Math.sin(angle) * force * 2;
                    } else {
                        // Return to original velocity
                        particle.vx += (particle.originalVx - particle.vx) * 0.05;
                        particle.vy += (particle.originalVy - particle.vy) * 0.05;
                    }
                }
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            return true;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections (only for non-burst particles)
        const regularParticles = this.particles.filter(p => !p.isBurst);
        for (let i = 0; i < regularParticles.length; i++) {
            for (let j = i + 1; j < regularParticles.length; j++) {
                const dx = regularParticles[i].x - regularParticles[j].x;
                const dy = regularParticles[i].y - regularParticles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.drawConnection(regularParticles[i], regularParticles[j], distance);
                }
            }
        }

        // Draw all particles
        this.particles.forEach(particle => this.drawParticle(particle));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// MODAL CONTENT DATA
// ============================================
const modalContent = {
    about: {
        title: 'About Me',
        content: `
            <h3>🎓 Education</h3>
            <p><strong>Texas Tech University</strong>, Lubbock, Texas</p>
            <p>Bachelor of Science in Computer Science | Minor in Mathematics</p>
            <p>Expected Graduation: May 2027 | GPA: 3.9</p>
            
            <h3>💡 Who I Am</h3>
            <p>I'm a passionate Computer Science student at Texas Tech University with a strong focus on data analytics and artificial intelligence. My journey in tech is driven by a desire to transform complex data into actionable insights and build intelligent solutions that make a real-world impact.</p>
            
            <h3>🎯 Career Goals</h3>
            <p>Looking to apply my data analytics and AI skills to a real-world <strong>internship</strong> in the data field. I'm particularly interested in roles that combine machine learning, data engineering, and full-stack development to solve challenging problems.</p>
            
            <h3>🌟 What Drives Me</h3>
            <p>I thrive on learning new technologies, participating in hackathons, and building projects that push the boundaries of what's possible. Whether it's optimizing cloud infrastructure, developing predictive models, or creating interactive dashboards, I'm always excited to tackle the next challenge.</p>
        `
    },

    projects: {
        title: 'Projects & Achievements',
        content: `
            <div class="project-item">
                <h3 class="project-title">🏆 TempTerra - Predictive Resource Optimization</h3>
                <p class="project-tech">Python | SQL | Terraform | AWS | HackTX 2024 Winner</p>
                <p class="project-description">
                    Built a predictive resource optimization system that won HackTX 2024:
                </p>
                <ul>
                    <li>Analyzed 10K+ cloud logs to identify inefficiencies and optimize infrastructure</li>
                    <li>Modeled a predictive usage model improving scaling accuracy by 40%</li>
                    <li>Automated idle app termination, reducing memory use by 60% and saving resource usage</li>
                    <li>Integrated SQL anomaly detection to flag over-provisioning in real time</li>
                </ul>
            </div>
            
            <div class="project-item">
                <h3 class="project-title">🏆 FleetRank - Real-Time Fleet Analytics</h3>
                <p class="project-tech">ReactJS | NextJS | MongoDB | NodeJS | PowerBI | WeTX 2024 Winner</p>
                <p class="project-description">
                    Developed a real-time fleet management system that won WeTX 2024:
                </p>
                <ul>
                    <li>Devised a data pipeline to process more than 1000 fleet records in real time</li>
                    <li>Applied KPI weighting & statistical analysis - ranked 15+ fleets, identified efficiency gaps</li>
                    <li>Developed an interactive dashboard improving productivity by 30%</li>
                    <li>Implemented predictive thread modeling, forecasting maintenance issues and reducing downtime by 25%</li>
                </ul>
            </div>
            
            <div class="project-item">
                <h3 class="project-title">🏥 DocMent - Healthcare AI-Powered Intelligence</h3>
                <p class="project-tech">Python | MERN Stack | NLP | OpenAI API | Gemini API | Power BI</p>
                <p class="project-description">
                    Healthcare AI system for medical document processing:
                </p>
                <ul>
                    <li>Processed 300+ minutes of audio and structured medical forms, reduced manual entry by 75%</li>
                    <li>Streamlined NLP summarization on 50+ patient records - cut hospital review time by 60%</li>
                    <li>Inherited a medicine recommendation model - 85% test accuracy, supporting prescription decisions</li>
                    <li>Validated hospital-level analytics dashboards with Power BI - provided insights across 10+ departments</li>
                </ul>
            </div>
            
            <div class="project-item">
                <h3 class="project-title">⚡ Power Output Predictor - Predictive Energy Analytics</h3>
                <p class="project-tech">Python | Pandas | NumPy | Scikit-learn | Matplotlib</p>
                <p class="project-description">
                    Machine learning system for energy generation forecasting:
                </p>
                <ul>
                    <li>Collected & cleaned 6000 energy generation data points for modeling</li>
                    <li>Built regression models - forecasted power output with R² = 0.92</li>
                    <li>Visualized predictions vs actuals using Matplotlib and Seaborn - improved stakeholder interpretability</li>
                </ul>
            </div>
        `
    },

    skills: {
        title: 'Technical Skills',
        content: `
            <div class="skills-grid">
                <div class="skill-category">
                    <h4>💻 Programming & Analytics</h4>
                    <div>
                        <span class="skill-tag">Python</span>
                        <span class="skill-tag">Pandas</span>
                        <span class="skill-tag">NumPy</span>
                        <span class="skill-tag">Scikit-learn</span>
                        <span class="skill-tag">SQL</span>
                        <span class="skill-tag">Data Structures</span>
                        <span class="skill-tag">Algorithms</span>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h4>📊 Data Visualization & BI</h4>
                    <div>
                        <span class="skill-tag">Tableau</span>
                        <span class="skill-tag">Power BI</span>
                        <span class="skill-tag">Matplotlib</span>
                        <span class="skill-tag">Seaborn</span>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h4>🤖 Machine Learning & Modeling</h4>
                    <div>
                        <span class="skill-tag">Regression</span>
                        <span class="skill-tag">Classification</span>
                        <span class="skill-tag">Clustering</span>
                        <span class="skill-tag">Predictive Analytics</span>
                        <span class="skill-tag">NLP</span>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h4>💾 Data Management & Cloud</h4>
                    <div>
                        <span class="skill-tag">MySQL</span>
                        <span class="skill-tag">MongoDB</span>
                        <span class="skill-tag">Firebase</span>
                        <span class="skill-tag">AWS</span>
                        <span class="skill-tag">Data Cleaning</span>
                        <span class="skill-tag">Data Wrangling</span>
                        <span class="skill-tag">Statistical Analysis</span>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h4>🌐 Web Development</h4>
                    <div>
                        <span class="skill-tag">Git</span>
                        <span class="skill-tag">GitHub</span>
                        <span class="skill-tag">Postman</span>
                        <span class="skill-tag">JIRA</span>
                        <span class="skill-tag">MERN Stack</span>
                        <span class="skill-tag">MongoDB</span>
                        <span class="skill-tag">ExpressJS</span>
                        <span class="skill-tag">ReactJS</span>
                        <span class="skill-tag">NodeJS</span>
                        <span class="skill-tag">TailwindCSS</span>
                        <span class="skill-tag">REST APIs</span>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h4>🛠️ Other Technologies</h4>
                    <div>
                        <span class="skill-tag">Docker (Basic)</span>
                        <span class="skill-tag">Terraform</span>
                    </div>
                </div>
            </div>
        `
    },

    experience: {
        title: 'Experience & Involvement',
        content: `
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-date">September 2023 - Present</div>
                    <h3 class="timeline-title">Information Technology - Student Assistant</h3>
                    <div class="timeline-company">Texas Tech University System – Communication Services, Lubbock, Texas</div>
                    <ul>
                        <li>Automated data processing workflows using Python & APIs, reducing IT workload by 95%</li>
                        <li>Built an AI-powered ticket classification model to analyze 5,000+ IT requests, cutting response times by 60%</li>
                        <li>Strengthened network security with anti-phishing strategies; reduced breach risk by 40% and improved CRM performance</li>
                    </ul>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">August 2023 - Present</div>
                    <h3 class="timeline-title">Tech Lead (Facilitator, "Mentor")</h3>
                    <div class="timeline-company">CodePath TTU</div>
                    <ul>
                        <li>Led MERN stack workshops, training 40+ students in industry-grade web development</li>
                        <li>Integrated AI and ML concepts into training, bridging academia-industry skill gaps</li>
                        <li>Made a full-fledged website <a href="https://codepathttu.org" target="_blank" style="color: var(--primary-cyan);">codepathttu.org</a> along with a CMS (Customer Management System)</li>
                    </ul>
                </div>
            </div>
        `
    },

    contact: {
        title: 'Let\'s Connect!',
        content: `
            <p style="text-align: center; font-size: 1.2rem; margin-bottom: 2rem;">
                I'm always excited to collaborate on innovative projects, discuss opportunities, or just chat about tech!
            </p>
            
            <div class="social-links">
                <a href="https://github.com/IamAryanDubey" target="_blank" class="social-link">
                    <span class="social-icon">🐙</span>
                    <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/thisisaryandubey/" target="_blank" class="social-link">
                    <span class="social-icon">💼</span>
                    <span>LinkedIn</span>
                </a>
                <a href="mailto:ardubey@ttu.edu" class="social-link">
                    <span class="social-icon">📧</span>
                    <span>ardubey@ttu.edu</span>
                </a>
            </div>
            
            <p style="text-align: center; margin-top: 2rem; color: rgba(255, 255, 255, 0.6);">
                📍 Lubbock, TX, 79401<br>
                📱 +1(806)7582024
            </p>
        `
    }
};

// ============================================
// MODAL FUNCTIONALITY
// ============================================
class ModalManager {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');
        this.modalClose = document.getElementById('modal-close');

        this.init();
    }

    init() {
        // Close modal on close button click
        this.modalClose.addEventListener('click', () => this.close());

        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(topic) {
        const content = modalContent[topic];
        if (!content) return;

        this.modalTitle.textContent = content.title;
        this.modalBody.innerHTML = content.content;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// TOPIC CARDS INTERACTION
// ============================================
class TopicCardsManager {
    constructor(modalManager) {
        this.modalManager = modalManager;
        this.cards = document.querySelectorAll('.topic-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            // 3D tilt effect on mouse move
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));

            // Open modal on click
            card.addEventListener('click', () => {
                const topic = card.getAttribute('data-topic');
                this.modalManager.open(topic);
                card.classList.add('active');
                setTimeout(() => card.classList.remove('active'), 300);
            });
        });
    }

    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.05)`;
    }

    resetTilt(card) {
        card.style.transform = '';
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('.topics-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe topic cards
    document.querySelectorAll('.topic-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ============================================
// AI GUIDE SYSTEM
// ============================================
class AIGuide {
    constructor() {
        this.chatWindow = document.getElementById('ai-chat');
        this.messagesContainer = document.getElementById('ai-messages');
        this.character = document.getElementById('ai-character');
        this.notification = document.getElementById('ai-notification');
        this.chatClose = document.getElementById('ai-chat-close');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');

        this.currentStoryStep = 0;
        this.totalStorySteps = 8;
        this.isTyping = false;

        this.story = [
            {
                message: "👋 Hey! I'm your AI guide. Let me tell you about Aryan's incredible journey in tech!",
                replies: [
                    { text: "Tell me more!", next: 1 },
                    { text: "Skip to highlights", next: 4 }
                ]
            },
            {
                message: "Aryan is a Computer Science student at Texas Tech University with an impressive 3.9 GPA. But what really sets him apart is his passion for turning data into intelligent solutions! 🎓",
                replies: [
                    { text: "What's his background?", next: 2 },
                    { text: "Show me his projects", next: 4 }
                ]
            },
            {
                message: "He's not just about academics! Aryan has won TWO major hackathons - HackTX 2024 and WeTX 2024. His projects have reduced IT workloads by 95% and improved system efficiency by 40%! 🏆",
                replies: [
                    { text: "That's impressive! What did he build?", next: 3 },
                    { text: "Tell me about his skills", next: 5 }
                ]
            },
            {
                message: "Let me show you his hackathon wins! Click on the Projects card to see TempTerra and FleetRank - both award-winning solutions that showcase his expertise in AI, cloud optimization, and real-time analytics. 🚀",
                action: () => this.highlightCard('projects'),
                replies: [
                    { text: "What technologies does he use?", next: 5 },
                    { text: "Tell me about his work experience", next: 6 }
                ]
            },
            {
                message: "Here's a quick overview: Aryan has built TempTerra (cloud resource optimization), FleetRank (real-time fleet analytics), DocMent (healthcare AI), and a Power Output Predictor. All solving real-world problems! 💡",
                action: () => this.highlightCard('projects'),
                replies: [
                    { text: "What's his tech stack?", next: 5 },
                    { text: "Where has he worked?", next: 6 }
                ]
            },
            {
                message: "Aryan's arsenal includes Python, SQL, Machine Learning, the MERN stack, AWS, and more! He's proficient in everything from data analytics to full-stack development. Check out the Skills card for the full breakdown! ⚡",
                action: () => this.highlightCard('skills'),
                replies: [
                    { text: "What about his experience?", next: 6 },
                    { text: "How can I contact him?", next: 7 }
                ]
            },
            {
                message: "Currently, Aryan works as an IT Student Assistant at Texas Tech, where he built an AI-powered ticket classification system. He's also a Tech Lead at CodePath, mentoring 40+ students and even built their full website! 💼",
                action: () => this.highlightCard('experience'),
                replies: [
                    { text: "How can I reach out?", next: 7 },
                    { text: "Tell me more about him", next: 0 }
                ]
            },
            {
                message: "Ready to connect? Aryan is actively looking for internships in data analytics and AI! You can reach him via GitHub, LinkedIn, or email. Click the Connect card to get in touch! 📬",
                action: () => this.highlightCard('contact'),
                replies: [
                    { text: "View his full story", action: () => this.showAllSections() },
                    { text: "Start over", next: 0 }
                ]
            }
        ];

        this.init();
    }

    init() {
        // Character click to toggle chat
        this.character.addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chat button
        this.chatClose.addEventListener('click', () => {
            this.closeChat();
        });

        // Show welcome hint on first visit (optional, dismissible)
        this.showWelcomeHintIfFirstVisit();
    }

    showWelcomeHintIfFirstVisit() {
        // Check if user has dismissed the welcome hint before
        const hasSeenWelcome = localStorage.getItem('ai-guide-welcome-seen');

        if (!hasSeenWelcome) {
            // Show welcome hint after a short delay
            setTimeout(() => {
                this.showWelcomeHint();
            }, 2000);
        }
    }

    showWelcomeHint() {
        // Create welcome hint bubble
        const hintBubble = document.createElement('div');
        hintBubble.className = 'ai-welcome-hint';
        hintBubble.innerHTML = `
            <div class="ai-welcome-content">
                <p>👋 Hi! Click me if you'd like a guided tour!</p>
                <button class="ai-welcome-dismiss" data-permanent="false">Got it</button>
                <button class="ai-welcome-dismiss" data-permanent="true">Don't show again</button>
            </div>
        `;

        // Add to AI guide container
        document.querySelector('.ai-guide-container').appendChild(hintBubble);

        // Fade in
        setTimeout(() => {
            hintBubble.classList.add('visible');
        }, 100);

        // Auto-hide after 10 seconds
        const autoHideTimeout = setTimeout(() => {
            this.hideWelcomeHint(hintBubble, false);
        }, 10000);

        // Handle dismiss buttons
        hintBubble.querySelectorAll('.ai-welcome-dismiss').forEach(btn => {
            btn.addEventListener('click', (e) => {
                clearTimeout(autoHideTimeout);
                const permanent = e.target.dataset.permanent === 'true';
                this.hideWelcomeHint(hintBubble, permanent);
            });
        });
    }

    hideWelcomeHint(hintBubble, permanent) {
        hintBubble.classList.remove('visible');

        if (permanent) {
            localStorage.setItem('ai-guide-welcome-seen', 'true');
        }

        setTimeout(() => {
            hintBubble.remove();
        }, 300);
    }

    startTour() {
        this.openChat();
        this.currentStoryStep = 0;
        this.messagesContainer.innerHTML = '';
        this.sendMessage(this.story[0].message, this.story[0].replies);
        this.updateProgress();
    }



    toggleChat() {
        if (this.chatWindow.classList.contains('active')) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatWindow.classList.add('active');
        this.notification.style.display = 'none';
    }

    closeChat() {
        this.chatWindow.classList.remove('active');
    }

    async sendMessage(text, replies = null, isUser = false) {
        if (this.isTyping) return;

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${isUser ? 'user' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = 'ai-message-avatar';
        avatar.textContent = isUser ? '👤' : '🤖';

        const content = document.createElement('div');
        content.className = 'ai-message-content';

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        this.messagesContainer.appendChild(messageDiv);

        if (isUser) {
            content.textContent = text;
        } else {
            // Typing indicator
            this.isTyping = true;
            const typingDiv = document.createElement('div');
            typingDiv.className = 'ai-typing';
            typingDiv.innerHTML = '<div class=\"ai-typing-dot\"></div><div class=\"ai-typing-dot\"></div><div class=\"ai-typing-dot\"></div>';
            content.appendChild(typingDiv);

            // Simulate typing delay
            await this.delay(1000);

            // Type out message
            typingDiv.remove();
            await this.typeText(content, text);
            this.isTyping = false;

            // Add quick replies if provided
            if (replies && replies.length > 0) {
                const repliesDiv = document.createElement('div');
                repliesDiv.className = 'ai-quick-replies';

                replies.forEach(reply => {
                    const button = document.createElement('button');
                    button.className = 'ai-quick-reply';
                    button.textContent = reply.text;
                    button.addEventListener('click', () => {
                        this.handleReply(reply);
                    });
                    repliesDiv.appendChild(button);
                });

                content.appendChild(repliesDiv);
            }
        }

        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async typeText(element, text) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.delay(20);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handleReply(reply) {
        // Send user message
        await this.sendMessage(reply.text, null, true);

        // Execute action if provided
        if (reply.action) {
            reply.action();
            return;
        }

        // Move to next story step
        if (reply.next !== undefined) {
            this.currentStoryStep = reply.next;
            const nextStep = this.story[reply.next];

            // Execute action if provided
            if (nextStep.action) {
                nextStep.action();
            }

            await this.delay(500);
            await this.sendMessage(nextStep.message, nextStep.replies);
            this.updateProgress();
        }
    }

    updateProgress() {
        const progress = Math.round((this.currentStoryStep / this.totalStorySteps) * 100);
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${progress}%`;
    }

    highlightCard(topic) {
        const card = document.querySelector(`[data-topic="${topic}"]`);
        if (card) {
            // Scroll to card
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add highlight effect
            card.style.transform = 'translateY(-15px) scale(1.1)';
            card.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.6), 0 0 40px rgba(118, 75, 162, 0.5)';

            // Remove highlight after 3 seconds
            setTimeout(() => {
                card.style.transform = '';
                card.style.boxShadow = '';
            }, 3000);
        }
    }

    showAllSections() {
        this.closeChat();
        document.querySelector('.topics-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// TYPING ANIMATION
// ============================================
class TypingAnimation {
    constructor(element, phrases, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
        this.element = element;
        this.phrases = phrases;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.currentPhraseIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.isPaused = false;
    }

    start() {
        this.type();
    }

    type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];

        if (this.isPaused) {
            setTimeout(() => {
                this.isPaused = false;
                this.type();
            }, this.pauseDuration);
            return;
        }

        if (!this.isDeleting) {
            // Typing
            if (this.currentText.length < currentPhrase.length) {
                this.currentText = currentPhrase.substring(0, this.currentText.length + 1);
                this.element.textContent = this.currentText;
                setTimeout(() => this.type(), this.typingSpeed);
            } else {
                // Finished typing, pause then start deleting
                this.isPaused = true;
                this.isDeleting = true;
                this.type();
            }
        } else {
            // Deleting
            if (this.currentText.length > 0) {
                this.currentText = currentPhrase.substring(0, this.currentText.length - 1);
                this.element.textContent = this.currentText;
                setTimeout(() => this.type(), this.deletingSpeed);
            } else {
                // Finished deleting, move to next phrase
                this.isDeleting = false;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
                setTimeout(() => this.type(), 500);
            }
        }
    }
}

// ============================================
// FIRST VISIT WELCOME SEQUENCE
// ============================================
class WelcomeSequence {
    constructor() {
        this.hasSeenWelcome = localStorage.getItem('portfolio-welcome-seen') === 'true';
    }

    shouldShow() {
        return !this.hasSeenWelcome;
    }

    async start() {
        if (!this.shouldShow()) return;

        // Wait for page to load
        await this.delay(1500);

        // Smooth scroll through sections
        await this.highlightSection('.hero', 2000);
        await this.delay(500);

        // Scroll to topics section
        document.querySelector('.topics-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
        await this.delay(1500);

        // Highlight each topic card briefly
        const cards = document.querySelectorAll('.topic-card');
        for (let i = 0; i < Math.min(3, cards.length); i++) {
            this.highlightCard(cards[i]);
            await this.delay(600);
        }

        // Scroll back to top
        await this.delay(1000);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Mark as seen
        localStorage.setItem('portfolio-welcome-seen', 'true');
    }

    async highlightSection(selector, duration) {
        const section = document.querySelector(selector);
        if (!section) return;

        section.style.transform = 'scale(1.02)';
        section.style.transition = 'transform 0.5s ease';

        await this.delay(duration);

        section.style.transform = '';
    }

    highlightCard(card) {
        const originalTransform = card.style.transform;
        const originalBoxShadow = card.style.boxShadow;

        card.style.transform = 'translateY(-10px) scale(1.05)';
        card.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.6)';

        setTimeout(() => {
            card.style.transform = originalTransform;
            card.style.boxShadow = originalBoxShadow;
        }, 500);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles-canvas');
    const particleSystem = new ParticleSystem(canvas);
    particleSystem.animate();

    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            'Data Analytics & AI Engineer',
            'Full-Stack Developer',
            'Problem Solver',
            'Machine Learning Enthusiast'
        ];
        const typingAnimation = new TypingAnimation(typingElement, phrases);
        typingAnimation.start();
    }

    // Initialize modal manager
    const modalManager = new ModalManager();

    // Initialize topic cards
    const topicCardsManager = new TopicCardsManager(modalManager);

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize navbar scroll effect
    initNavbarScroll();

    // Start welcome sequence for first-time visitors
    const welcomeSequence = new WelcomeSequence();
    welcomeSequence.start();
});
