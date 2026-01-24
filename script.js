// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCq4W4KzOc3UPkxv-_tobyS4BNyaTgYjlw",
    authDomain: "checkname-smte.firebaseapp.com",
    databaseURL: "https://checkname-smte-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "checkname-smte",
    storageBucket: "checkname-smte.firebasestorage.app",
    messagingSenderId: "493575535452",
    appId: "1:493575535452:web:e4598e75cf58005952df99"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// 2. ข้อมูลสมาชิก (30 คน)
const students = [
    { fullname: "นายรัตนโกสินทร์ สาดแสง", nickname: "สิงโต" },
    { fullname: "นายธัญวิน อร่ามวงศ์วิทย์", nickname: "อะฟิฟ" },
    { fullname: "นายกันตภณ เพชรพูล", nickname: "เซียมซี" },
    { fullname: "นายวิชัย หลีหมัด", nickname: "รุก" },
    { fullname: "นายกิตติพัทธ์ แช่ลิ่ม", nickname: "น็อต" },
    { fullname: "นายธีรัตม์ ทองชูช่วย", nickname: "เท็น" },
    { fullname: "นายศิระศิลป์ เบ็ญหยีหมาน", nickname: "อิลญีน" },
    { fullname: "นายแสงอรุณ ไพโรจน์", nickname: "ฟีโน่" },
    { fullname: "นายอธิวัชร์ เภอโส๊ะ", nickname: "ธาม" },
    { fullname: "นายภานุพัฒน์ หลังปูเต๊ะ", nickname: "ไก่มีน" },
    { fullname: "นายฐาปณวัชร์ แช่วุ่น", nickname: "วัชร์" },
    { fullname: "นายฐาปณวิชญ์ แช่วุ่น", nickname: "วิชญ์" },
    { fullname: "นายธีระพิชัย ศุภณัฏฐ์ปทุม", nickname: "หมิง" },
    { fullname: "นายอัฟฟาน หลีเส็ม", nickname: "อัฟฟาน" },
    { fullname: "นางสาวธนัสถา แช่เจ่", nickname: "เม่ย" },
    { fullname: "นางสาวหนึ่งฤทัย รัตนอุดม", nickname: "มี่" },
    { fullname: "นางสาวธมน ชาลีเปรี่ยม", nickname: "ธมน" },
    { fullname: "นางสาวปัณณิกา มัณฑะนานนท์", nickname: "ปัน" },
    { fullname: "นางสาวนภาศิริ อาทรวิริยากุล", nickname: "นภา" },
    { fullname: "นางสาวพิมพ์นานา เกียรติเสนกุล", nickname: "นานา" },
    { fullname: "นางสาวธัญวรัตน์ รัตนกาญจน์", nickname: "ยิม" },
    { fullname: "นางสาวฐิติวรดา หมานหมัด", nickname: "โมจิ" },
    { fullname: "นางสาวนิจิตตา พิพัฒน์นิธิกุลชัย", nickname: "ชมพู่" },
    { fullname: "นางสาวอรสา กิ้มลั่น", nickname: "มิลล์" },
    { fullname: "นางสาวรัญชิดา หมานหนับ", nickname: "ชิดา" },
    { fullname: "นางสาวกานต์สิรี สูขมิ่ง", nickname: "ปาน" },
    { fullname: "นางสาวลลนา สังข์แก้ว", nickname: "ตอง" },
    { fullname: "นางสาวธัญญรัตน์ เส้งนนท์", nickname: "เทียน" },
    { fullname: "นางสาวภูริชญา โสะบิลเมาะ", nickname: "นานะ" },
    { fullname: "นางสาวกัญญาภัทร แสงรักษ์", nickname: "ด้า" }
];

const HASHED_PASSWORD = "ed8b00d9c766c03570a1a0a7e4d52c3d";

// --- ฟังก์ชันช่วยเหลือ ---
function getSafeName(name) {
    return name.replace(/[.#$[\]]/g, "");
}

function getStudentNo(fullNameWithNickname) {
    const index = students.findIndex(s => `${s.fullname} (${s.nickname})` === fullNameWithNickname);
    return index !== -1 ? index + 1 : 30;
}

// --- การทำงานเมื่อโหลดหน้าเว็บ ---
window.onload = function () {
    renderMemberList(); // สร้างตารางเช็คชื่อ (Admin)
    renderIndividualGrid(); // สร้างรายชื่อเรียงลงมา (Dashboard)

    if (document.getElementById('workDate')) {
        document.getElementById('workDate').valueAsDate = new Date();
    }

    listenToFirebase();

    // เพิ่มบรรทัดนี้: เพื่อให้เปิดหน้า "มาบ่อย" ทันทีที่เข้าเว็บ
    switchDashboardTab('top');
};

// --- ฟังก์ชัน Dashboard Tab ---
function switchDashboardTab(tabName) {
    // ปิดทุก section
    document.querySelectorAll('.dash-section').forEach(sec => {
        sec.style.display = 'none';
    });

    // แสดงเฉพาะ section ที่เลือก พร้อม Animation
    const targetSection = document.getElementById('dash-' + tabName);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // สลับสถานะปุ่ม
    const buttons = ['btn-show-top', 'btn-show-absent', 'btn-show-history', 'btn-show-individual'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('active-tab');
    });

    const targetBtn = document.getElementById('btn-show-' + tabName);
    if (targetBtn) targetBtn.classList.add('active-tab');

    // ถ้าเปิดหน้าประวัติรายบุคคล ให้รีโหลดรายชื่อเพื่อรัน Animation ใหม่
    if (tabName === 'individual') {
        renderIndividualGrid();
    }
}

// --- ฟังก์ชันแสดงรายชื่อรายบุคคล (ลบเลขที่ออกแล้ว) ---
function renderIndividualGrid() {
    const listContainer = document.getElementById('individualMemberList');
    if (!listContainer) return;

    listContainer.innerHTML = students.map((std, index) => `
        <button class="btn-name-row" 
                style="animation-delay: ${index * 0.03}s" 
                onclick="showIndividualHistory('${std.fullname} (${std.nickname})')">
            <span class="st-no">${index + 1}</span>
            <span class="name">${std.fullname} (${std.nickname})</span>
            <span style="margin-left: auto; color: #3498db;">❯</span>
        </button>
    `).join('');
}

// --- ฟังก์ชันปิด Modal เมื่อคลิกพื้นหลัง ---
window.addEventListener('click', function (event) {
    const individualModal = document.getElementById('individualModal');
    const summaryModal = document.getElementById('summaryModal');

    if (event.target === individualModal) {
        individualModal.style.display = "none";
    }
    if (event.target === summaryModal) {
        summaryModal.style.display = "none";
    }
});

// --- ฟังก์ชันเปิด Popup ประวัติรายคน ---
async function showIndividualHistory(fullName) {
    const modal = document.getElementById('individualModal');
    const nameHeader = document.getElementById('selectedName');
    const tableBody = document.getElementById('individualTableBody');
    nameHeader.innerText = fullName;
    tableBody.innerHTML = '<tr><td colspan="2">กำลังโหลดประวัติ...</td></tr>';
    modal.style.display = "block";
    try {
        const snapshot = await db.ref('attendance').once('value');
        const data = snapshot.val();
        let historyHtml = '';
        let hasData = false;
        if (data) {
            const dates = Object.keys(data).sort((a, b) => b.localeCompare(a));
            const safeName = getSafeName(fullName);
            dates.forEach(date => {
                if (data[date][safeName]) {
                    hasData = true;
                    const status = data[date][safeName].status;
                    const color = status === 'ขาดงาน' ? '#e74c3c' : '#27ae60';
                    historyHtml += `
                        <tr>
                            <td>${date}</td>
                            <td style="color: ${color}; font-weight:bold;">${status}</td>
                        </tr>`;
                }
            });
        }
        tableBody.innerHTML = hasData ? historyHtml : '<tr><td colspan="2">ไม่พบประวัติการทำงาน</td></tr>';
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="2">เกิดข้อผิดพลาด</td></tr>';
    }
}

function closeIndividualModal() {
    document.getElementById('individualModal').style.display = "none";
}

function listenToFirebase() {
    db.ref('attendance').on('value', (snapshot) => {
        const data = snapshot.val();
        const allData = [];
        if (data) {
            Object.keys(data).forEach(date => {
                Object.keys(data[date]).forEach(name => {
                    allData.push({ date, name, status: data[date][name].status });
                });
            });
        }
        const filterDateInput = document.getElementById('filterDate');
        const filterDate = filterDateInput ? filterDateInput.value : "";
        const displayData = filterDate ? allData.filter(i => i.date === filterDate) : allData;
        renderUserTable(displayData);
        renderAdminTable(displayData);
        updateRanking(allData);
    });
}

// --- Admin Logic ---
function renderMemberList() {
    const list = document.getElementById('memberList');
    if (!list) return;
    list.innerHTML = students.map((std, index) => `
        <tr>
            <td>${index + 1}</td>
            <td class="name-cell">${std.fullname} (${std.nickname})</td>
            <td>
                <select class="status-select">
                    <option value="มาทำงาน">✅ มาทำงาน</option>
                    <option value="ขาดงาน">❌ ไม่มาทำงานทำเปรต</option>
                </select>
            </td>
        </tr>
    `).join('');
}

async function saveAttendance() {
    const date = document.getElementById('workDate').value;
    const rows = document.querySelectorAll('#memberList tr');
    if (!date) return alert("⚠️ กรุณาเลือกวันที่");
    const snapshot = await db.ref('attendance/' + date).once('value');
    if (snapshot.exists()) {
        alert(`❌ วันที่ ${date} มีข้อมูลอยู่แล้ว`);
        return;
    }
    const updates = {};
    students.forEach((std) => {
        const fullName = `${std.fullname} (${std.nickname})`;
        const safeName = getSafeName(fullName);
        const row = Array.from(rows).find(r => r.querySelector('.name-cell').innerText === fullName);
        const status = row ? row.querySelector('.status-select').value : "ขาดงาน";
        updates[safeName] = { status: status, timestamp: firebase.database.ServerValue.TIMESTAMP };
    });
    await db.ref('attendance/' + date).set(updates);
    alert("✅ บันทึกสำเร็จ!");
    switchAdminTab('edit');
}

function switchAdminTab(tabName) {
    const sectionCheckin = document.getElementById('section-checkin');
    const sectionEdit = document.getElementById('section-edit');
    if (tabName === 'checkin') {
        sectionCheckin.style.display = 'block';
        sectionEdit.style.display = 'none';
        document.getElementById('btn-tab-checkin').classList.add('active-tab');
        document.getElementById('btn-tab-edit').classList.remove('active-tab');
    } else {
        sectionCheckin.style.display = 'none';
        sectionEdit.style.display = 'block';
        document.getElementById('btn-tab-edit').classList.add('active-tab');
        document.getElementById('btn-tab-checkin').classList.remove('active-tab');
    }
}

function enterAdminMode() {
    let inputPass = prompt("🔐 รหัสผ่านแอดมิน :");
    if (!inputPass) return;
    const inputHash = CryptoJS.MD5(inputPass.trim()).toString();
    if (inputHash === HASHED_PASSWORD) {
        document.getElementById('page-dashboard').classList.remove('active');
        document.getElementById('page-admin').classList.add('active');
        switchAdminTab('checkin');
    } else { alert("❌ รหัสไม่ถูกต้อง!"); }
}

function exitAdminMode() {
    document.getElementById('page-admin').classList.remove('active');
    document.getElementById('page-dashboard').classList.add('active');
}

function renderUserTable(data) {
    const body = document.getElementById('summaryBody');
    if (!body) return;
    const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date) || getStudentNo(a.name) - getStudentNo(b.name));
    body.innerHTML = sorted.map(item => `
        <tr>
            <td>${item.date}</td>
            <td>${getStudentNo(item.name)}. ${item.name}</td>
            <td style="color: ${item.status === 'ขาดงาน' ? '#e74c3c' : '#27ae60'}; font-weight:bold;">${item.status}</td>
        </tr>`).join('') || '<tr><td colspan="3">ไม่มีข้อมูล</td></tr>';
}

function renderAdminTable(data) {
    const body = document.getElementById('adminSummaryBody');
    if (!body) return;
    const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date) || getStudentNo(a.name) - getStudentNo(b.name));
    body.innerHTML = sorted.map(item => {
        const safeName = getSafeName(item.name);
        return `<tr>
            <td>${item.date}</td>
            <td>${getStudentNo(item.name)}. ${item.name}</td>
            <td style="color:${item.status === 'ขาดงาน' ? '#e74c3c' : '#27ae60'}">${item.status}</td>
            <td><button onclick="editOnline('${item.date}','${safeName}','${item.status}')">✏️</button></td>
            <td><button onclick="deleteOnline('${item.date}','${safeName}')">🗑️</button></td>
        </tr>`;
    }).join('') || '<tr><td colspan="5">ไม่มีข้อมูล</td></tr>';
}

function editOnline(date, safeName, currentStatus) {
    const nextStatus = (currentStatus === "มาทำงาน") ? "ขาดงาน" : "มาทำงาน";
    if (confirm(`เปลี่ยนเป็น ${nextStatus}?`)) {
        db.ref(`attendance/${date}/${safeName}`).update({ status: nextStatus });
    }
}

function deleteOnline(date, safeName) {
    if (confirm(`ลบข้อมูลนี้?`)) db.ref(`attendance/${date}/${safeName}`).remove();
}

function clearData() {
    if (confirm("⚠️ คุณแน่ใจว่าจะล้างฐานข้อมูลทั้งหมด?")) {
        let confirmPass = prompt("🔐 กรุณาใส่รหัสผ่านแอดมินเพื่อยืนยัน:");
        if (confirmPass === null) return;
        const confirmHash = CryptoJS.MD5(confirmPass.trim()).toString();
        if (confirmHash === HASHED_PASSWORD) {
            db.ref('attendance').remove()
                .then(() => { alert("🗑️ ล้างฐานข้อมูลสำเร็จ"); })
                .catch((error) => { alert("❌ เกิดข้อผิดพลาด: " + error.message); });
        } else { alert("❌ รหัสไม่ถูกต้อง!"); }
    }
}

// --- ปรับปรุงส่วน Ranking (เพิ่มเลขลำดับหน้าชื่อ) ---
function updateRanking(allData) {
    const stats = {};
    students.forEach(s => stats[`${s.fullname} (${s.nickname})`] = { attend: 0, absent: 0 });
    allData.forEach(item => { if (stats[item.name]) item.status === "มาทำงาน" ? stats[item.name].attend++ : stats[item.name].absent++; });

    const rankArr = Object.keys(stats).map(key => ({ name: key, ...stats[key] }));

    const renderList = (arr, type) => arr
        .filter(s => s[type] > 0)
        .sort((a, b) => b[type] - a[type])
        .map((s, i) => `
        <li>
            <div class="rank-left">
                <span class="rank-number">${i + 1}.</span> 
                <span class="rank-name">${s.name}</span>
            </div>
            <span class="count-badge">${s[type]} ครั้ง</span>
        </li>`).join('');

    document.getElementById('topWorkers').innerHTML = renderList(rankArr, 'attend') || '<li>ยังไม่มีข้อมูล</li>';
    document.getElementById('topAbsentees').innerHTML = renderList(rankArr, 'absent') || '<li>ยังไม่มีข้อมูล</li>';
}

window.onclick = function (event) {
    const modal = document.getElementById('individualModal');
    if (event.target == modal) closeIndividualModal();
}

// --- ฟังก์ชันแสดงสรุปรายวันแบบ Popup ---
// --- เพิ่มฟังก์ชันเพื่อให้รายชื่อค่อยๆ วิ่งขึ้นมา (Animation) ---
function renderIndividualGrid() {
    const listContainer = document.getElementById('individualMemberList');
    if (!listContainer) return;

    listContainer.innerHTML = students.map((std, index) => `
        <button class="btn-name-row" 
                style="animation-delay: ${index * 0.03}s" 
                onclick="showIndividualHistory('${std.fullname} (${std.nickname})')">
            <span class="st-no">${index + 1}</span>
            <span class="name">${std.fullname} (${std.nickname})</span>
            <span style="margin-left: auto; color: #3498db;">❯</span>
        </button>
    `).join('');
}

// --- ฟังก์ชันปิด Modal เมื่อคลิกพื้นหลัง ---
window.addEventListener('click', function (event) {
    const individualModal = document.getElementById('individualModal');
    const summaryModal = document.getElementById('summaryModal');

    if (event.target === individualModal) {
        individualModal.style.display = "none";
    }
    if (event.target === summaryModal) {
        summaryModal.style.display = "none";
    }
});

// --- ปรับปรุงฟังก์ชัน Dashboard Tab ให้ Smooth ขึ้น ---
function switchDashboardTab(tabName) {
    // ปิดทุก section
    document.querySelectorAll('.dash-section').forEach(sec => {
        sec.style.display = 'none';
    });

    // แสดงเฉพาะ section ที่เลือก พร้อม Animation
    const targetSection = document.getElementById('dash-' + tabName);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // สลับสถานะปุ่ม
    const buttons = ['btn-show-top', 'btn-show-absent', 'btn-show-history', 'btn-show-individual'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('active-tab');
    });

    const targetBtn = document.getElementById('btn-show-' + tabName);
    if (targetBtn) targetBtn.classList.add('active-tab');

    // ถ้าเปิดหน้าประวัติรายบุคคล ให้รีโหลดรายชื่อเพื่อรัน Animation ใหม่
    if (tabName === 'individual') {
        renderIndividualGrid();
    }
}

// --- ปรับปรุงหน้าตา Summary Popup ให้พรีเมียมขึ้น ---
// --- ฟังก์ชันแสดงสรุปรายวันแบบ Popup ---
async function showDailySummary() {
    const selectedDate = document.getElementById('filterDate').value;
    const modal = document.getElementById('summaryModal');
    const content = document.getElementById('summaryContent');

    if (!selectedDate) {
        alert("⚠️ กรุณาเลือกวันที่ต้องการสรุปก่อน");
        return;
    }

    content.innerHTML = '<div class="loader">กำลังคำนวณข้อมูล...</div>';
    modal.style.display = "flex";

    try {
        const snapshot = await db.ref('attendance/' + selectedDate).once('value');
        const data = snapshot.val();

        if (!data) {
            content.innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <p style="font-size: 3rem; margin: 0;">📅</p>
                    <p style="color:#7f8c8d;">วันที่ <b>${selectedDate}</b><br>ยังไม่มีข้อมูลการเช็คชื่อ</p>
                </div>`;
            return;
        }

        let total = 0, present = 0, absent = 0;
        let absentList = [];

        Object.keys(data).forEach(key => {
            total++;
            if (data[key].status === 'มาทำงาน') {
                present++;
            } else {
                absent++;
                absentList.push(key);
            }
        });

        const presentPercent = ((present / total) * 100).toFixed(0);

        // เก็บข้อมูลสรุปไว้ใน Object เพื่อใช้สำหรับฟังก์ชันแชร์
        const summaryData = {
            date: selectedDate,
            total: total,
            present: present,
            absent: absent,
            absentList: absentList
        };

        content.innerHTML = `
    <div id="captureArea" class="summary-card-capture" style="padding: 20px; background: white; border-radius: 20px;">
        <div style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align:center; box-shadow: 0 4px 10px rgba(52,152,219,0.3);">
            <span style="font-size: 0.8rem; opacity: 0.9;">สรุปข้อมูลประจำวันที่</span>
            <h3 style="margin: 5px 0; font-size: 1.3rem;">📅 ${selectedDate}</h3>
        </div>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 15px; margin-bottom: 20px; text-align:center; border: 1px solid #eee;">
            <span style="font-size: 0.9rem; color: #555;">อัตราการมาทำงาน</span>
            <h2 style="margin: 5px 0; color: #2c3e50;">${presentPercent}%</h2>
            <div style="width:100%; background:#ddd; height:8px; border-radius:10px; overflow:hidden;">
                <div style="width:${presentPercent}%; background:#27ae60; height:100%;"></div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom:20px;">
            <div style="background: #eafaf1; padding: 15px; border-radius: 15px; text-align: center; border-bottom: 4px solid #2ecc71;">
                <div style="font-size: 1.8rem; font-weight: bold; color: #27ae60;">${present}</div>
                <small style="color:#27ae60;">✅ มาทำงาน</small>
            </div>
            <div style="background: #fff5f5; padding: 15px; border-radius: 15px; text-align: center; border-bottom: 4px solid #e74c3c;">
                <div style="font-size: 1.8rem; font-weight: bold; color: #e74c3c;">${absent}</div>
                <small style="color:#e74c3c;">❌ ขาดงาน</small>
            </div>
        </div>

        ${absent > 0 ? `
            <div style="background: #fdf2f2; padding: 12px; border-radius: 12px; border: 1px solid #fadbd8;">
                <small style="color: #e74c3c; font-weight:bold;">🚩 รายชื่อคนขาดงาน (${absent} คน):</small>
                <div style="margin-top: 10px; font-size: 0.9rem; color: #c0392b; line-height: 1.8;">
                    ${absentList.map((name, index) => `
                        <div style="border-bottom: 1px dashed #fadbd8; padding: 2px 0;">
                            ${index + 1}. ${name}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : `<p style="text-align:center; color:#27ae60; font-weight:bold;">🎉 วันนี้มาครบทุกคน!</p>`}
        
        <div style="text-align: center; margin-top: 15px; color: #bdc3c7; font-size: 0.7rem;">
            Generated by CheckName SMTE
        </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px; width: 100%;">
        <button id="btnCapture" onclick="shareAsImage('${selectedDate}')" style="width:100%; padding:15px; border-radius:12px; border:none; background:#e67e22; color:white; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);">
            📸 แชร์เป็นรูปภาพ
        </button>
        <button onclick='shareSummary(${JSON.stringify(summaryData)})' style="width:100%; padding:10px; border-radius:12px; border:1px solid #ccc; background:white; color:#666; font-size:0.8rem; cursor:pointer;">
            แชร์เป็นข้อความ
        </button>
    </div>
`;

    } catch (error) {
        console.error(error);
        content.innerHTML = '<p style="color:red; text-align:center;">❌ เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
}

// --- ฟังก์ชันแชร์ข้อมูล ---
async function shareSummary(s) {
    const text = `📊 สรุปการมาทำงาน ม.4/1 \n📅 วันที่: ${s.date}\n------------------\n✅ มาทำงาน: ${s.present} คน\n❌ ขาดงาน: ${s.absent} คน\n${s.absent > 0 ? `🚩 รายชื่อคนขาด:\n${s.absentList.map((name, i) => (i + 1) + '. ' + name).join('\n')}` : '🎉 วันนี้มาครบทุกคน!'}\n------------------\nจากระบบเช็คชื่อ ม.4/1 \nhttps://smte18.vercel.app`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'สรุปการมาทำงาน',
                text: text
            });
        } catch (err) {
            console.log("Share cancelled or failed", err);
        }
    } else {
        // กรณี Browser ไม่รองรับการแชร์ (เช่น บนคอม) ให้คัดลอกข้อความแทน
        const tempElem = document.createElement('textarea');
        tempElem.value = text;
        document.body.appendChild(tempElem);
        tempElem.select();
        document.execCommand('copy');
        document.body.removeChild(tempElem);
        alert("📋 คัดลอกสรุปเป็นข้อความแล้ว! คุณสามารถกดวาง (Paste) ได้เลย");
    }
}

async function shareAsImage(date) {
    const captureArea = document.getElementById('captureArea');
    const btn = document.getElementById('btnCapture');

    // แสดงสถานะว่ากำลังทำงาน
    const originalText = btn.innerHTML;
    btn.innerHTML = "⌛ กำลังเตรียมรูปภาพ...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(captureArea, {
            scale: 2, // เพิ่มความละเอียดภาพ
            backgroundColor: "#ffffff",
            useCORS: true
        });

        canvas.toBlob(async (blob) => {
            const file = new File([blob], `summary-${date}.png`, { type: 'image/png' });

            // ตรวจสอบว่าเครื่องรองรับการแชร์ไฟล์หรือไม่ (iOS/Android รองรับ)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `สรุปข้อมูลวันที่ ${date}`,
                });
            } else {
                // ถ้าแชร์ไม่ได้ (เช่น บนคอม) ให้ดาวน์โหลดแทน
                const link = document.createElement('a');
                link.download = `Summary-${date}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                alert("📋 ดาวน์โหลดรูปภาพลงเครื่องแล้ว (เบราว์เซอร์นี้ไม่รองรับการส่งไฟล์ภาพโดยตรง)");
            }

            // คืนค่าปุ่ม
            btn.innerHTML = originalText;
            btn.style.opacity = "1";
            btn.disabled = false;
        });
    } catch (err) {
        console.error(err);
        alert("❌ เกิดข้อผิดพลาดในการสร้างรูปภาพ");
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- ฟังก์ชันสำหรับสร้างรูปภาพจากสรุปและแชร์ ---
async function shareSummaryAsImage() {
    const summaryCard = document.querySelector('.summary-card-capture');
    if (!summaryCard) return;

    try {
        // เปลี่ยนปุ่มเป็นสถานะกำลังโหลด
        const shareBtn = document.getElementById('shareImgBtn');
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = "⌛ กำลังสร้างรูปภาพ...";
        shareBtn.disabled = true;

        // แปลง HTML เป็น Canvas
        const canvas = await html2canvas(summaryCard, {
            backgroundColor: "#ffffff",
            scale: 2, // เพิ่มความชัดของรูป
            logging: false,
            useCORS: true
        });

        // แปลง Canvas เป็น Blob (ไฟล์ภาพ)
        canvas.toBlob(async (blob) => {
            const file = new File([blob], `summary-${window.currentSummary.date}.png`, { type: 'image/png' });

            // ตรวจสอบว่า Browser รองรับการแชร์ไฟล์หรือไม่
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'สรุปการมาทำงาน',
                        text: `สรุปการมาทำงานวันที่ ${window.currentSummary.date}`
                    });
                } catch (err) {
                    console.error("Share failed:", err);
                }
            } else {
                // ถ้าแชร์ไม่ได้ (เช่นบนคอม) ให้ทำการดาวน์โหลดรูปแทน
                const link = document.createElement('a');
                link.download = `summary-${window.currentSummary.date}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                alert("📋 ระบบดาวน์โหลดรูปภาพลงเครื่องให้แล้ว เนื่องจากเบราว์เซอร์นี้ไม่รองรับการแชร์ไฟล์โดยตรง");
            }

            // คืนค่าปุ่ม
            shareBtn.innerHTML = originalText;
            shareBtn.disabled = false;
        }, 'image/png');

    } catch (error) {
        console.error("Error creating image:", error);
        alert("❌ ไม่สามารถสร้างรูปภาพได้");
    }
}

// ฟังก์ชันปิด Modal
function closeSummaryModal() {
    document.getElementById('summaryModal').style.display = "none";
}

function updateDateDropdown(data) {
    const filterSelect = document.getElementById('filterDate');
    if (!filterSelect) return;

    const currentValue = filterSelect.value;
    const availableDates = Object.keys(data).sort((a, b) => b.localeCompare(a));

    // เปลี่ยนคำอธิบายในตัวเลือกแรกให้สื่อถึงการ "ดูทั้งหมด"
    let options = '<option value="">📅 แสดงประวัติทั้งหมด</option>';

    availableDates.forEach(date => {
        options += `<option value="${date}">วันที่ ${date}</option>`;
    });

    filterSelect.innerHTML = options;

    if (currentValue && availableDates.includes(currentValue)) {
        filterSelect.value = currentValue;
    }
}

// แก้ไขฟังก์ชันรีเซ็ต (เผื่อเรียกใช้จากที่อื่น)
function resetFilter() {
    const filterSelect = document.getElementById('filterDate');
    if (filterSelect) {
        filterSelect.value = ""; // กลับไปที่ "แสดงประวัติทั้งหมด"
        listenToFirebase(); // สั่งอัปเดตตาราง
    }
}

// แก้ไขฟังก์ชัน listenToFirebase เดิมเล็กน้อยเพื่อให้เรียกใช้ Dropdown
function listenToFirebase() {
    db.ref('attendance').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            renderUserTable([]);
            renderAdminTable([]);
            updateRanking([]);
            return;
        }

        // --- เพิ่มบรรทัดนี้เพื่ออัปเดตรายการวันที่ให้เลือก ---
        updateDateDropdown(data);

        const allData = [];
        Object.keys(data).forEach(date => {
            Object.keys(data[date]).forEach(name => {
                allData.push({ date, name, status: data[date][name].status });
            });
        });

        const filterSelect = document.getElementById('filterDate');
        const filterDate = filterSelect ? filterSelect.value : "";

        const displayData = filterDate ? allData.filter(i => i.date === filterDate) : allData;

        renderUserTable(displayData);
        renderAdminTable(displayData);
        updateRanking(allData);
    });
}