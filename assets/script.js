(function() {
            // ---------- DATA ----------
            const coursesLibrary = [
                { id:"algos", title:"Data Structures & Algorithms", img:"https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600", duration:"10 weeks", level:"foundational", shortDesc:"Master arrays, trees, graphs, dynamic programming.", fullDesc:"Deep dive into fundamental data structures and algorithms. Complexity analysis, sorting, graph traversals, DP. Hands-on LeetCode style projects.", tasks:["Implement merge sort & quicksort","Solve 7 graph problems","Build custom hashmap","DP: knapsack & LCS"], assessment:"Quiz + Final: Shortest path visualizer", syllabus:"Week 1-4: Arrays & Trees | Week 5-8: Graphs & DP" },
                { id:"os", title:"Operating Systems", img:"https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600", duration:"12 weeks", level:"advanced", shortDesc:"Processes, concurrency, memory, file systems.", fullDesc:"Process scheduling, threads, synchronization, memory management, file systems, I/O. Build a mini-shell and concurrency simulator.", tasks:["CPU scheduling simulator","Multi-threaded producer-consumer","Mini shell in C","Page replacement algorithms"], assessment:"Midterm + Final: File system prototype", syllabus:"Weeks 1-4: Processes & Threads | Weeks 5-8: Memory Management | Weeks 9-12: File Systems" },
                { id:"networks", title:"Computer Networks", img:"https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600", duration:"8 weeks", level:"intermediate", shortDesc:"TCP/IP, sockets, HTTP, network security.", fullDesc:"Socket programming, HTTP/3, DNS, routing, Wireshark analysis, network security basics.", tasks:["Packet analysis","Basic HTTP server","Chat app using websockets","Configure routing"], assessment:"Quiz + Socket programming project", syllabus:"Week 1-2: Application Layer | Week 3-4: Transport | Week 5-8: Network & Security" },
                { id:"dbms", title:"Database Systems", img:"https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&w=600", duration:"9 weeks", level:"intermediate", shortDesc:"SQL, indexing, ACID, NoSQL, optimization.", fullDesc:"Advanced SQL, normalization, indexing, transactions, NoSQL. Build a full-stack inventory system.", tasks:["ER diagram & normalization","10 complex SQL queries","Index performance analysis","Inventory system with PostgreSQL"], assessment:"SQL exam + Capstone: Library Management System", syllabus:"Weeks 1-4: SQL & Relational Model | Weeks 5-9: Optimization & NoSQL" },
                { id:"theory", title:"Theory of Computation", img:"https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=600", duration:"7 weeks", level:"theoretical", shortDesc:"Automata, Turing machines, P vs NP.", fullDesc:"DFA, NFA, regular expressions, context-free grammars, Turing machines, decidability, complexity.", tasks:["DFA/NFA design","PDA construction","Turing machine simulation","Reduction proof"], assessment:"Final exam + Complexity theory essay", syllabus:"Weeks 1-3: Automata | Weeks 4-5: CFL & PDA | Weeks 6-7: Turing & Complexity" },
                { id:"ai", title:"Artificial Intelligence", img:"https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600", duration:"10 weeks", level:"advanced", shortDesc:"Search, neural nets, game agents.", fullDesc:"A* search, minimax, knowledge representation, neural networks basics, ethical AI. Build game agents.", tasks:["A* for puzzle","Perceptron training","Tic-tac-toe AI","Mini chess engine"], assessment:"AI quiz + Game AI project", syllabus:"Weeks 1-3: Search | Weeks 4-6: Game AI | Weeks 7-10: ML Intro" }
            ];
            coursesLibrary.forEach(c => {
                c.lessonDescs = c.tasks.map((t, i) => `In this lesson, we dive deep into "${t}". You will learn the theoretical foundations and practical implementation techniques. ${c.title} is a crucial subject, and mastering this lesson will build your confidence. Complete the hands-on exercise to solidify your understanding.`);
            });

            let completedCourses = JSON.parse(localStorage.getItem('codecanvas_completed')) || {};
            let enrolledCourses = JSON.parse(localStorage.getItem('codecanvas_enrolled')) || {};
            let lessonProgress = JSON.parse(localStorage.getItem('codecanvas_lessons')) || {};
            let userProfile = JSON.parse(localStorage.getItem('codecanvas_user')) || { name: 'Learner', email: 'learner@codecanvas.edu' };
            let recentCourses = JSON.parse(localStorage.getItem('codecanvas_recent')) || [];

            function saveState() {
                localStorage.setItem('codecanvas_completed', JSON.stringify(completedCourses));
                localStorage.setItem('codecanvas_enrolled', JSON.stringify(enrolledCourses));
                localStorage.setItem('codecanvas_lessons', JSON.stringify(lessonProgress));
                localStorage.setItem('codecanvas_user', JSON.stringify(userProfile));
                localStorage.setItem('codecanvas_recent', JSON.stringify(recentCourses));
            }

            function showToast(msg, type = 'success') {
                const container = document.getElementById('toastContainer');
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${msg}`;
                container.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }

            function navigateTo(page, data) {
                let url = 'index.html';
                if (page === 'home') url = 'index.html';
                else if (page === 'courses' || page === 'subjectDetail' || page === 'lessonDetail') url = 'courses.html';
                else if (page === 'dashboard') url = 'dashboard.html';
                else if (page === 'admin') url = 'admin.html';
                else if (page === 'login') url = 'login.html';
                else if (page === 'contact') url = 'contact.html';

                let currentFile = window.location.pathname.split('/').pop();
                if (!currentFile || currentFile === '/') currentFile = 'index.html';

                if (url !== currentFile) {
                    if (data) localStorage.setItem('navData', JSON.stringify({page, data}));
                    else localStorage.removeItem('navData');
                    window.location.href = url;
                    return;
                }

                localStorage.removeItem('navData');

                document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
                let targetId = 'page' + page.charAt(0).toUpperCase() + page.slice(1);
                if (page === 'subjectDetail' && data && data.courseId) {
                    targetId = 'pageSubjectDetail';
                    renderSubjectDetail(data.courseId);
                } else if (page === 'lessonDetail' && data && data.courseId !== undefined && data.lessonIndex !== undefined) {
                    targetId = 'pageLessonDetail';
                    renderLessonDetail(data.courseId, data.lessonIndex);
                } else if (page === 'login') {
                    targetId = 'pageLogin';
                } else if (page === 'contact') {
                    targetId = 'pageContact';
                }
                const target = document.getElementById(targetId);
                if (target) target.classList.add('active');
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
                if (activeLink) activeLink.classList.add('active');
                document.getElementById('mobileMenu')?.classList.remove('show');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (page === 'courses') renderCourses('coursesContainerFull', 'courseSearchInputFull', 'categoryFilterFull', 'sortFilterFull');
                if (page === 'dashboard') updateDashboard();
                if (page === 'admin') renderAdminCourses();
                if (page === 'login' && document.getElementById('loginFirstName')) {
                    document.getElementById('loginFirstName').value = '';
                    document.getElementById('loginLastName').value = '';
                    document.getElementById('loginMobile').value = '';
                    document.getElementById('loginEmail').value = '';
                }
            }

            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = document.getElementById('themeIcon');
            function setTheme(mode) {
                document.documentElement.setAttribute('data-theme', mode);
                localStorage.setItem('codecanvas_theme', mode);
                themeIcon.className = mode === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            themeToggle?.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                setTheme(current === 'dark' ? 'light' : 'dark');
            });
            setTheme(localStorage.getItem('codecanvas_theme') || 'light');

            window.addEventListener('load', () => {
                setTimeout(() => {
                    document.getElementById('loadingScreen')?.classList.add('hidden');
                }, 600);
            });

            function renderCourses(gridId, searchId, catId, sortId) {
                const grid = document.getElementById(gridId);
                if (!grid) return;
                const searchTerm = document.getElementById(searchId)?.value.toLowerCase() || '';
                const category = document.getElementById(catId)?.value || 'all';
                const sort = document.getElementById(sortId)?.value || 'default';
                let filtered = coursesLibrary.filter(c => {
                    return (c.title.toLowerCase().includes(searchTerm) || c.shortDesc.toLowerCase().includes(searchTerm)) && (category === 'all' || c.level === category);
                });
                if (sort === 'duration-asc') filtered.sort((a,b) => parseInt(a.duration) - parseInt(b.duration));
                if (sort === 'duration-desc') filtered.sort((a,b) => parseInt(b.duration) - parseInt(a.duration));
                if (sort === 'level') {
                    const order = { foundational:1, intermediate:2, advanced:3, theoretical:4 };
                    filtered.sort((a,b) => (order[a.level]||0) - (order[b.level]||0));
                }
                const noResults = document.getElementById(gridId === 'coursesContainer' ? 'noResults' : 'noResultsFull');
                if (!filtered.length) {
                    grid.innerHTML = '';
                    if (noResults) noResults.style.display = 'block';
                    return;
                }
                if (noResults) noResults.style.display = 'none';
                grid.innerHTML = filtered.map(course => {
                    const enrolled = enrolledCourses[course.id];
                    const prog = enrolled ? (enrolled.progress || 0) : 0;
                    const stars = Math.floor(Math.random() * 2) + 4;
                    return `<div class="course-card" data-id="${course.id}">
                        <img class="course-img" src="${course.img}" loading="lazy" alt="${course.title}">
                        <div class="course-content">
                            <div class="course-title">${course.title}</div>
                            <div class="course-meta"><span><i class="far fa-clock"></i> ${course.duration}</span><span><i class="fas fa-signal"></i> ${course.level}</span></div>
                            <div class="course-rating">${'★'.repeat(stars)}${'☆'.repeat(5-stars)} <small>(${Math.floor(Math.random()*200)+100})</small></div>
                            <div class="course-desc">${course.shortDesc}</div>
                            ${enrolled ? `<div class="progress-bar"><div class="progress-fill" style="width:${prog}%"></div></div><small>${prog}% complete</small>` : ''}
                            <div class="course-footer">
                                <button class="btn-enroll ${enrolled ? 'enrolled' : ''}" data-id="${course.id}">${enrolled ? 'Continue' : 'Enroll Now'}</button>
                            </div>
                        </div>
                    </div>`;
                }).join('');
                attachCourseCardEvents(grid);
            }

            function attachCourseCardEvents(grid) {
                grid.querySelectorAll('.course-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        if (e.target.closest('button')) return;
                        const id = card.dataset.id;
                        addRecent(id);
                        navigateTo('subjectDetail', {courseId: id});
                    });
                });
                grid.querySelectorAll('.btn-enroll').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const id = btn.dataset.id;
                        toggleEnroll(id, btn);
                        navigateTo('subjectDetail', {courseId: id});
                    });
                });
            }

            function initSearchListeners() {
                ['courseSearchInput','courseSearchInputFull'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('input', () => {
                        const gridId = id.includes('Full') ? 'coursesContainerFull' : 'coursesContainer';
                        const searchId = id;
                        const catId = id.includes('Full') ? 'categoryFilterFull' : 'categoryFilter';
                        const sortId = id.includes('Full') ? 'sortFilterFull' : 'sortFilter';
                        renderCourses(gridId, searchId, catId, sortId);
                    });
                });
                ['categoryFilter','categoryFilterFull','sortFilter','sortFilterFull'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('change', () => {
                        const isFull = id.includes('Full');
                        renderCourses(isFull ? 'coursesContainerFull' : 'coursesContainer', isFull ? 'courseSearchInputFull' : 'courseSearchInput', isFull ? 'categoryFilterFull' : 'categoryFilter', isFull ? 'sortFilterFull' : 'sortFilter');
                    });
                });
            }

            function toggleEnroll(id, btn) {
                if (!enrolledCourses[id]) {
                    enrolledCourses[id] = { progress: 0, enrolledAt: Date.now() };
                    saveState();
                    if (btn) {
                        btn.textContent = 'Continue';
                        btn.classList.add('enrolled');
                    }
                    showToast('Enrolled successfully! Start learning.');
                    addRecent(id);
                    updateDashboard();
                    renderAllVisibleCourses();
                }
            }

            function addRecent(id) {
                recentCourses = recentCourses.filter(r => r !== id);
                recentCourses.unshift(id);
                if (recentCourses.length > 5) recentCourses.pop();
                saveState();
            }

            function renderAllVisibleCourses() {
                if (document.getElementById('coursesContainer')) renderCourses('coursesContainer', 'courseSearchInput', 'categoryFilter', 'sortFilter');
                if (document.getElementById('coursesContainerFull')) renderCourses('coursesContainerFull', 'courseSearchInputFull', 'categoryFilterFull', 'sortFilterFull');
            }

            function renderSubjectDetail(courseId) {
                const course = coursesLibrary.find(c => c.id === courseId);
                if (!course) return;
                document.getElementById('subjectBreadcrumb').innerHTML = `<a href="#" onclick="navigateTo('home')">Home</a> / <a href="#" onclick="navigateTo('courses')">Courses</a> / <span>${course.title}</span>`;
                const enrolled = enrolledCourses[courseId];
                const taskImages = [
                    'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=100',
                    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100',
                    'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=100',
                    'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=100'
                ];
                let html = `<button class="btn-back" onclick="navigateTo('courses')"><i class="fas fa-arrow-left"></i> Back to Courses</button>
                    <div style="display:flex; gap:2rem; align-items:flex-start; flex-wrap:wrap; margin-bottom:2rem;">
                        <div style="flex:1; min-width:280px;">
                            <h2 style="font-size:2.2rem;">${course.title}</h2>
                            <div class="course-meta"><span><i class="far fa-clock"></i> ${course.duration}</span><span><i class="fas fa-signal"></i> ${course.level}</span></div>
                            <p style="font-size:1.05rem; margin:1rem 0;">${course.fullDesc}</p>
                        </div>
                        <div style="flex-shrink:0;">
                            <img src="${course.img}" alt="${course.title}" style="width:200px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                        </div>
                    </div>
                    <div style="background:var(--bg-secondary); border-radius:20px; padding:1.8rem; margin:1.5rem 0; border:1px solid var(--border);">
                        <h3 style="display:flex; align-items:center; gap:0.5rem;"><i class="fas fa-tasks" style="color:var(--primary);"></i> Tasks & Assessments</h3>
                        <div class="task-grid">
                            ${course.tasks.map((task, idx) => `
                                <div class="task-item">
                                    <img src="${taskImages[idx % taskImages.length]}" class="task-thumb" alt="task icon">
                                    <span style="flex:1; font-weight:500;">✓ ${task}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border);">
                            <p><strong>📋 Assessment:</strong> ${course.assessment}</p>
                            <p><strong>📖 Syllabus:</strong> ${course.syllabus}</p>
                        </div>
                    </div>
                    <h4 style="display:flex; align-items:center; gap:0.5rem; margin:1.8rem 0 1rem;"><i class="fas fa-book-open" style="color:var(--primary);"></i> Lessons</h4>
                    <ul class="subject-lesson-list">
                        ${course.tasks.map((task, i) => {
                            const lessonImg = `https://images.pexels.com/photos/${[270404,1181263,3861972,577585][i%4]}/pexels-photo-${[270404,1181263,3861972,577585][i%4]}.jpeg?auto=compress&cs=tinysrgb&w=80`;
                            return `<li class="subject-lesson-item" onclick="navigateTo('lessonDetail', {courseId:'${courseId}', lessonIndex:${i}})">
                                <img src="${lessonImg}" class="lesson-thumb" alt="lesson">
                                <div style="flex:1;">
                                    <strong>Lesson ${i+1}</strong>
                                    <span style="display:block; font-size:0.95rem;">${task}</span>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </li>`;
                        }).join('')}
                    </ul>
                    <div class="enroll-section">
                        <div>
                            ${!enrolled ? 
                                `<h3 style="margin:0;">Ready to dive in?</h3><p style="margin:0.3rem 0;">Enroll now and start building real projects.</p>` :
                                `<h3 style="margin:0;">Continue your journey</h3><p style="margin:0.3rem 0;">Progress: ${enrolled.progress || 0}% complete</p>`
                            }
                        </div>
                        ${!enrolled ? 
                            `<button class="btn-primary-lg" id="subjectEnrollBtn"><i class="fas fa-rocket"></i> Enroll Now</button>` :
                            `<span style="font-size:1.5rem; color:var(--accent);"><i class="fas fa-check-circle"></i> Enrolled</span>`
                        }
                    </div>`;
                document.getElementById('subjectDetailContent').innerHTML = html;
                const enrollBtn = document.getElementById('subjectEnrollBtn');
                if (enrollBtn) {
                    enrollBtn.onclick = () => {
                        toggleEnroll(courseId);
                        navigateTo('subjectDetail', {courseId});
                    };
                }
            }

            function renderLessonDetail(courseId, lessonIndex) {
                const course = coursesLibrary.find(c => c.id === courseId);
                if (!course) return;
                const task = course.tasks[lessonIndex];
                const desc = course.lessonDescs[lessonIndex] || `Detailed description of lesson ${lessonIndex+1}.`;
                document.getElementById('lessonBreadcrumb').innerHTML = `<a href="#" onclick="navigateTo('home')">Home</a> / <a href="#" onclick="navigateTo('courses')">Courses</a> / <a href="#" onclick="navigateTo('subjectDetail', {courseId:'${courseId}'})">${course.title}</a> / <span>Lesson ${lessonIndex+1}</span>`;
                document.getElementById('lessonDetailContent').innerHTML = `
                    <button class="btn-back" onclick="navigateTo('subjectDetail', {courseId:'${courseId}'})"><i class="fas fa-arrow-left"></i> Back to ${course.title}</button>
                    <h2>Lesson ${lessonIndex+1}: ${task}</h2>
                    <p><strong>Subject:</strong> ${course.title}</p>
                    <div class="lesson-detail-content">
                        <p>${desc}</p>
                        <p>This lesson is part of the ${course.title} curriculum. Mastering it will bring you one step closer to completing the course and earning your certificate.</p>
                    </div>
                    <button class="btn-outline-lg" onclick="markLessonComplete('${courseId}', ${lessonIndex})">Mark as Complete</button>
                `;
            }

            function markLessonComplete(courseId, lessonIndex) {
                if (!lessonProgress[courseId]) lessonProgress[courseId] = { current: lessonIndex, completed: [] };
                if (!lessonProgress[courseId].completed.includes(lessonIndex)) {
                    lessonProgress[courseId].completed.push(lessonIndex);
                    if (enrolledCourses[courseId]) {
                        const total = coursesLibrary.find(c=>c.id===courseId)?.tasks.length || 5;
                        enrolledCourses[courseId].progress = Math.round((lessonProgress[courseId].completed.length / total) * 100);
                    }
                    saveState();
                    showToast('Lesson marked complete!');
                    updateDashboard();
                    renderAllVisibleCourses();
                }
            }

            function updateDashboard() {
                if (!document.getElementById('dashName')) return;
                document.getElementById('dashName').textContent = userProfile.name;
                document.getElementById('dashEmail').textContent = userProfile.email;
                const enrolledCount = Object.keys(enrolledCourses).length;
                const completedCount = Object.values(completedCourses).filter(Boolean).length;
                document.getElementById('dashEnrolled').textContent = enrolledCount;
                document.getElementById('dashCompleted').textContent = completedCount;
                document.getElementById('dashBadges').textContent = Math.min(completedCount, 4);
                document.getElementById('dashEnrolled2').textContent = enrolledCount;
                document.getElementById('dashCompleted2').textContent = completedCount;
                document.getElementById('dashBadges2').textContent = Math.min(completedCount, 4);
                renderEnrolledList();
                renderRecentList();
                renderCertificates();
                renderBadges();
            }

            function renderEnrolledList() {
                const container = document.getElementById('enrolledCoursesList');
                if (!container) return;
                const enrolledIds = Object.keys(enrolledCourses);
                if (!enrolledIds.length) {
                    container.innerHTML = '<p class="empty-state">No enrolled courses yet. <a href="#" onclick="navigateTo(\'courses\')">Browse courses</a></p>';
                    return;
                }
                container.innerHTML = enrolledIds.map(id => {
                    const course = coursesLibrary.find(c => c.id === id);
                    if (!course) return '';
                    const prog = enrolledCourses[id].progress || 0;
                    return `<div class="course-card" onclick="navigateTo('subjectDetail', {courseId:'${id}'})"><img class="course-img" src="${course.img}" loading="lazy"><div class="course-content"><h4>${course.title}</h4><div class="progress-bar"><div class="progress-fill" style="width:${prog}%"></div></div><small>${prog}% complete</small></div></div>`;
                }).join('');
            }

            function renderRecentList() {
                const container = document.getElementById('recentCoursesList');
                if (!container) return;
                if (!recentCourses.length) {
                    container.innerHTML = '<p class="empty-state">No recently viewed courses.</p>';
                    return;
                }
                container.innerHTML = recentCourses.map(id => {
                    const course = coursesLibrary.find(c => c.id === id);
                    if (!course) return '';
                    return `<div class="course-card" onclick="navigateTo('subjectDetail', {courseId:'${id}'})"><img class="course-img" src="${course.img}" loading="lazy"><div class="course-content"><h4>${course.title}</h4></div></div>`;
                }).join('');
            }

            function renderCertificates() {
                const container = document.getElementById('certificatesList');
                if (!container) return;
                const certs = Object.keys(completedCourses).filter(id => completedCourses[id]);
                if (!certs.length) {
                    container.innerHTML = '<p class="empty-state">Complete courses to earn certificates.</p>';
                    return;
                }
                container.innerHTML = certs.map(id => {
                    const course = coursesLibrary.find(c => c.id === id);
                    return `<div><i class="fas fa-certificate" style="color:var(--accent);"></i> ${course.title} <button class="btn-outline-sm" onclick="showToast('PDF download demo')">Download</button></div>`;
                }).join('');
            }

            function renderBadges() {
                const grid = document.getElementById('badgesGrid');
                if (!grid) return;
                const completedCount = Object.values(completedCourses).filter(Boolean).length;
                const badges = [
                    { icon:'fa-star', name:'Quick Starter', req:1 },
                    { icon:'fa-fire', name:'Streak Master', req:2 },
                    { icon:'fa-trophy', name:'Course Champion', req:3 },
                    { icon:'fa-gem', name:'Perfect Score', req:4 }
                ];
                grid.innerHTML = badges.map(b => `
                    <div class="badge-card ${completedCount >= b.req ? '' : 'locked'}">
                        <i class="fas ${b.icon}"></i><span>${b.name}</span><small>${b.req} course${b.req>1?'s':''}</small>
                    </div>
                `).join('');
            }

            function renderAdminCourses() {
                const list = document.getElementById('adminCourseList');
                if (!list) return;
                list.innerHTML = coursesLibrary.map(c => `
                    <div class="admin-course-item">
                        <span>${c.title} (${c.level})</span>
                        <div>
                            <button class="btn-outline-sm" onclick="editAdminCourse('${c.id}')" style="margin-right:0.5rem;">Edit</button>
                            <button class="btn-outline-sm" onclick="deleteAdminCourse('${c.id}')">Delete</button>
                        </div>
                    </div>
                `).join('');
                document.getElementById('adminAddForm').style.display = 'none';
            }

            window.editAdminCourse = function(id) {
                const course = coursesLibrary.find(c => c.id === id);
                if (!course) return;
                document.getElementById('adminCourseTitle').value = course.title;
                document.getElementById('adminCourseImg').value = course.img;
                document.getElementById('adminCourseDuration').value = course.duration;
                document.getElementById('adminCourseLevel').value = course.level;
                document.getElementById('adminCourseDesc').value = course.shortDesc;
                document.getElementById('adminAddForm').style.display = 'block';
                document.getElementById('saveAdminCourse').dataset.editId = id;
            };

            window.deleteAdminCourse = function(id) {
                const idx = coursesLibrary.findIndex(c => c.id === id);
                if (idx > -1) coursesLibrary.splice(idx, 1);
                renderAdminCourses();
                renderAllVisibleCourses();
                showToast('Course deleted (demo).');
            };

            document.getElementById('addCourseBtn')?.addEventListener('click', () => {
                document.getElementById('adminAddForm').style.display = 'block';
                document.getElementById('saveAdminCourse').dataset.editId = '';
                document.getElementById('adminCourseTitle').value = '';
                document.getElementById('adminCourseImg').value = '';
                document.getElementById('adminCourseDuration').value = '';
                document.getElementById('adminCourseLevel').value = 'foundational';
                document.getElementById('adminCourseDesc').value = '';
            });
            document.getElementById('cancelAdminCourse')?.addEventListener('click', () => {
                document.getElementById('adminAddForm').style.display = 'none';
            });
            document.getElementById('saveAdminCourse')?.addEventListener('click', function() {
                const title = document.getElementById('adminCourseTitle').value;
                const img = document.getElementById('adminCourseImg').value;
                const duration = document.getElementById('adminCourseDuration').value;
                const level = document.getElementById('adminCourseLevel').value;
                const desc = document.getElementById('adminCourseDesc').value;
                const editId = this.dataset.editId;
                if (editId) {
                    const course = coursesLibrary.find(c => c.id === editId);
                    if (course) {
                        course.title = title;
                        course.img = img;
                        course.duration = duration;
                        course.level = level;
                        course.shortDesc = desc;
                    }
                } else {
                    coursesLibrary.push({
                        id: 'c' + Date.now(),
                        title,
                        img,
                        duration,
                        level,
                        shortDesc: desc,
                        fullDesc: 'New course description.',
                        tasks: ['Task 1'],
                        assessment: 'Quiz',
                        syllabus: 'TBD'
                    });
                }
                renderAdminCourses();
                renderAllVisibleCourses();
                document.getElementById('adminAddForm').style.display = 'none';
                showToast('Course saved (demo).');
            });

            // Login
            document.getElementById('submitLoginBtn')?.addEventListener('click', () => {
                const fname = document.getElementById('loginFirstName').value.trim();
                const lname = document.getElementById('loginLastName').value.trim();
                const mobile = document.getElementById('loginMobile').value.trim();
                const email = document.getElementById('loginEmail').value.trim();
                if (!fname || !lname || !mobile || !email) { showToast('Please fill all fields.', 'error'); return; }
                userProfile.name = fname + ' ' + lname;
                userProfile.email = email;
                userProfile.mobile = mobile;
                saveState();
                updateDashboard();
                if (document.getElementById('navLoginBtn')) document.getElementById('navLoginBtn').style.display = 'none';
                if (document.getElementById('navUserGreeting')) {
                    document.getElementById('navUserGreeting').style.display = 'inline';
                    document.getElementById('navUserGreeting').textContent = 'Hi, ' + fname;
                }
                showToast('Welcome, ' + fname + '!');
                navigateTo('home');
                if (document.getElementById('loginFirstName')) {
                    document.getElementById('loginFirstName').value = '';
                    document.getElementById('loginLastName').value = '';
                    document.getElementById('loginMobile').value = '';
                    document.getElementById('loginEmail').value = '';
                }
            });

            // Contact Modal functions
            window.openContactModal = function() {
                document.getElementById('contactModalOverlay').style.display = 'flex';
            };
            window.closeContactModal = function() {
                document.getElementById('contactModalOverlay').style.display = 'none';
                // Clear fields on close
                document.getElementById('contactFirstName').value = '';
                document.getElementById('contactLastName').value = '';
                document.getElementById('contactMobile').value = '';
                document.getElementById('contactEmail').value = '';
                document.getElementById('contactMessage').value = '';
            };
            document.getElementById('submitContactBtn')?.addEventListener('click', () => {
                const fname = document.getElementById('contactFirstName').value.trim();
                const lname = document.getElementById('contactLastName').value.trim();
                const mobile = document.getElementById('contactMobile').value.trim();
                const email = document.getElementById('contactEmail').value.trim();
                const message = document.getElementById('contactMessage').value.trim();
                if (!fname || !lname || !email || !message) { showToast('Please fill all required fields (*).', 'error'); return; }
                showToast('Thanks, ' + fname + '! We will get back to you soon.');
                closeContactModal();
            });
            document.getElementById('contactModalOverlay')?.addEventListener('click', function(e) {
                if (e.target === this) closeContactModal();
            });

            // Other global functions
            window.closeMobileMenu = function() { document.getElementById('mobileMenu')?.classList.remove('show'); };

            document.getElementById('mobileMenuBtn')?.addEventListener('click', () => { document.getElementById('mobileMenu').classList.toggle('show'); });
            document.getElementById('notificationBell')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('notificationDropdown').classList.toggle('show'); });
            document.addEventListener('click', () => { document.getElementById('notificationDropdown')?.classList.remove('show'); });
            document.getElementById('clearNotifications')?.addEventListener('click', () => { document.getElementById('notificationList').innerHTML = '<div class="notification-item">No new notifications</div>'; document.getElementById('notificationBadge').textContent = '0'; });
            document.getElementById('newsletterForm')?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Subscribed successfully!'); e.target.reset(); });
            document.querySelectorAll('.faq-question').forEach(btn => { btn.addEventListener('click', () => { const item = btn.parentElement; item.classList.toggle('active'); const icon = btn.querySelector('i'); if (icon) icon.className = item.classList.contains('active') ? 'fas fa-minus' : 'fas fa-plus'; }); });
            document.getElementById('backToTopBtn')?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
            window.addEventListener('scroll', () => { document.getElementById('backToTopBtn').style.display = window.scrollY > 500 ? 'block' : 'none'; });
            document.getElementById('profileSettingsForm')?.addEventListener('submit', (e) => { e.preventDefault(); userProfile.name = document.getElementById('settingName').value || userProfile.name; userProfile.email = document.getElementById('settingEmail').value || userProfile.email; saveState(); updateDashboard(); showToast('Profile updated!'); });
            document.querySelectorAll('.admin-tab-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active')); document.getElementById('adminTab' + (btn.dataset.adminTab === 'manageCourses' ? 'ManageCourses' : 'UserList')).classList.add('active'); }); });
            document.querySelectorAll('.sidebar-nav-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active')); document.getElementById('dashTab' + btn.dataset.dashTab.charAt(0).toUpperCase() + btn.dataset.dashTab.slice(1)).classList.add('active'); }); });
            const track = document.getElementById('testimonialsTrack');
            document.getElementById('testPrev')?.addEventListener('click', () => track.scrollBy({left:-320, behavior:'smooth'}));
            document.getElementById('testNext')?.addEventListener('click', () => track.scrollBy({left:320, behavior:'smooth'}));

            const counters = document.querySelectorAll('.counter');
            const counterObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { const el = entry.target; const target = +el.dataset.target; let count = 0; const speed = target / 50; const update = () => { if (count < target) { count += speed; el.textContent = Math.ceil(count); requestAnimationFrame(update); } else { el.textContent = target + (target === 4000 ? '+' : target === 100 ? '%' : '+'); } }; update(); counterObserver.unobserve(el); } }); }, { threshold: 0.5 });
            counters.forEach(c => counterObserver.observe(c));

            renderCourses('coursesContainer', 'courseSearchInput', 'categoryFilter', 'sortFilter');
            initSearchListeners();
            updateDashboard();

            if (userProfile.name !== 'Learner') {
                if (document.getElementById('navLoginBtn')) {
                    document.getElementById('navLoginBtn').style.display = 'none';
                    document.getElementById('navUserGreeting').style.display = 'inline';
                    document.getElementById('navUserGreeting').textContent = 'Hi, ' + userProfile.name.split(' ')[0];
                }
            }

            window.navigateTo = navigateTo;
            window.markLessonComplete = markLessonComplete;

            // Handle MPA state reload
            const navDataStr = localStorage.getItem('navData');
            if (navDataStr) {
                localStorage.removeItem('navData');
                try {
                    const navData = JSON.parse(navDataStr);
                    setTimeout(() => navigateTo(navData.page, navData.data), 50);
                } catch (e) {}
            } else {
                // If loaded without navData, ensure correct section is active based on file
                let currentFile = window.location.pathname.split('/').pop();
                if (!currentFile || currentFile === '/') currentFile = 'index.html';
                
                if (currentFile === 'courses.html') navigateTo('courses');
                else if (currentFile === 'dashboard.html') navigateTo('dashboard');
                else if (currentFile === 'admin.html') navigateTo('admin');
                else if (currentFile === 'login.html') navigateTo('login');
                else if (currentFile === 'contact.html') navigateTo('contact');
                else navigateTo('home');
            }
        })();
