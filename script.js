const firebaseConfig = {
    apiKey: "AIzaSyCq4W4KzOc3UPkxv-_tobyS4BNyaTgYjlw",
    authDomain: "checkname-smte.firebaseapp.com",
    databaseURL: "https://checkname-smte-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "checkname-smte",
    storageBucket: "checkname-smte.firebasestorage.app",
    messagingSenderId: "493575535452",
    appId: "1:493575535452:web:e4598e75cf58005952df99"
};

// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 1. ข้อมูลสมาชิก
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
    { fullname: "นางสาวกัญญาภัทร แแสงรักษ์", nickname: "ด้า" }
];

const HASHED_PASSWORD = "ed8b00d9c766c03570a1a0a7e4d52c3d";

function checkAuth() {
    let inputPass = prompt("🔐 กรุณาใส่รหัสผ่าน :");
    if (inputPass === null) return false;

    // ตัดช่องว่างหน้าหลัง
    inputPass = inputPass.trim();

    // ตรวจสอบ Library
    if (typeof CryptoJS === 'undefined') {
        alert("❌ ไม่พบ Library CryptoJS กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
        return false;
    }

    const inputHash = CryptoJS.MD5(inputPass).toString();

    // แสดงใน Console เพื่อเช็ค (กด F12 ดูได้)
    console.log("Input:", inputPass);
    console.log("Hash:", inputHash);

    if (inputHash === HASHED_PASSWORD) {
        return true;
    } else {
        alert("❌ รหัสไม่ถูกต้อง!");
        return false;
    }
}

// 3. ฟังก์ชันการทำงาน
window.onload = function () {
    renderMemberList();
    document.getElementById('workDate').valueAsDate = new Date();
    loadSummary();
};

function renderMemberList() {
    const list = document.getElementById('memberList');
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

function saveAttendance() {
    if (!checkAuth()) return;
    const date = document.getElementById('workDate').value;
    const rows = document.querySelectorAll('#memberList tr');
    let data = JSON.parse(localStorage.getItem('groupAttendance')) || [];
    if (!date) { alert("กรุณาเลือกวันที่"); return; }

    rows.forEach(row => {
        const name = row.querySelector('.name-cell').innerText;
        const status = row.querySelector('.status-select').value;
        data.push({ date, name, status });
    });

    localStorage.setItem('groupAttendance', JSON.stringify(data));
    alert("✅ บันทึกสำเร็จ!");
    loadSummary();
}

function loadSummary() {
    const data = JSON.parse(localStorage.getItem('groupAttendance')) || [];
    const filterDate = document.getElementById('filterDate') ? document.getElementById('filterDate').value : "";
    const summaryBody = document.getElementById('summaryBody');
    let filteredData = filterDate ? data.filter(item => item.date === filterDate) : data;
    const displayData = [...filteredData].reverse();

    if (displayData.length === 0) {
        summaryBody.innerHTML = `<tr><td colspan="5">ไม่มีข้อมูล</td></tr>`;
    } else {
        summaryBody.innerHTML = displayData.map((item) => {
            const actualIndex = data.findIndex(d => d.date === item.date && d.name === item.name);
            return `
                <tr id="row-${actualIndex}">
                    <td>${item.date}</td>
                    <td class="name-cell">${item.name}</td>
                    <td class="status-cell" style="color: ${item.status === 'ขาดงาน' ? 'red' : 'green'}">
                        ${item.status}
                    </td>
                    <td><button onclick="editRow(${actualIndex}, '${item.status}')">✏️ แก้ไข</button></td>
                    <td><button onclick="deleteRow(${actualIndex})">🗑️</button></td>
                </tr>
            `;
        }).join('');
    }
    updateRanking(data);
}

function editRow(index, currentStatus) {
    if (!checkAuth()) return;
    const row = document.getElementById(`row-${index}`);
    const statusCell = row.querySelector('.status-cell');
    statusCell.innerHTML = `
        <select id="edit-select-${index}" onchange="updateStatus(${index})" style="padding:5px;">
            <option value="มาทำงาน" ${currentStatus === 'มาทำงาน' ? 'selected' : ''}>✅ มาทำงาน</option>
            <option value="ขาดงาน" ${currentStatus === 'ขาดงาน' ? 'selected' : ''}>❌ ขาดงาน</option>
        </select>
    `;
}

function updateStatus(index) {
    let data = JSON.parse(localStorage.getItem('groupAttendance'));
    data[index].status = document.getElementById(`edit-select-${index}`).value;
    localStorage.setItem('groupAttendance', JSON.stringify(data));
    loadSummary();
}

function deleteRow(index) {
    if (!checkAuth()) return;
    let data = JSON.parse(localStorage.getItem('groupAttendance'));
    data.splice(index, 1);
    localStorage.setItem('groupAttendance', JSON.stringify(data));
    loadSummary();
}

function clearData() {
    if (!checkAuth()) return;
    if (confirm("ล้างข้อมูลทั้งหมด?")) {
        localStorage.removeItem('groupAttendance');
        loadSummary();
    }
}

function resetFilter() {
    if (document.getElementById('filterDate')) {
        document.getElementById('filterDate').value = "";
        loadSummary();
    }
}

function updateRanking(data) {
    const stats = {};
    students.forEach(s => stats[`${s.fullname} (${s.nickname})`] = { attend: 0, absent: 0 });
    data.forEach(item => {
        if (stats[item.name]) {
            if (item.status === "มาทำงาน") stats[item.name].attend++;
            if (item.status === "ขาดงาน") stats[item.name].absent++;
        }
    });
    const rankingArray = Object.keys(stats).map(key => ({ name: key, attend: stats[key].attend, absent: stats[key].absent }));
    document.getElementById('topWorkers').innerHTML = [...rankingArray].sort((a, b) => b.attend - a.attend).map((s, i) => `<li><span>${i + 1}. ${s.name}</span> <span class="count-badge">${s.attend} ครั้ง</span></li>`).join('');
    document.getElementById('topAbsentees').innerHTML = [...rankingArray].sort((a, b) => b.absent - a.absent).map((s, i) => `<li><span>${i + 1}. ${s.name}</span> <span class="count-badge" style="background:red;">${s.absent} ครั้ง</span></li>`).join('');
}