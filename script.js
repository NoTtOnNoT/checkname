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
    document.querySelectorAll('.dash-section').forEach(sec => sec.style.display = 'none');
    const buttons = ['btn-show-top', 'btn-show-absent', 'btn-show-history', 'btn-show-individual'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('active-tab');
    });
    const targetSection = document.getElementById('dash-' + tabName);
    const targetBtn = document.getElementById('btn-show-' + tabName);
    if (targetSection) targetSection.style.display = 'block';
    if (targetBtn) targetBtn.classList.add('active-tab');
}

// --- ฟังก์ชันแสดงรายชื่อรายบุคคล (ลบเลขที่ออกแล้ว) ---
function renderIndividualGrid() {
    const listContainer = document.getElementById('individualMemberList');
    if (!listContainer) return;

    listContainer.innerHTML = students.map((std) => `
        <button class="btn-name-row" onclick="showIndividualHistory('${std.fullname} (${std.nickname})')">
            <span class="name">${std.fullname} (${std.nickname})</span>
            <span style="margin-left: auto; color: #ccc;">❯</span>
        </button>
    `).join('');
}

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

function resetFilter() {
    document.getElementById('filterDate').value = "";
    listenToFirebase();
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