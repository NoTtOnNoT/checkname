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

// ... ส่วน firebaseConfig และ students คงเดิม ...

// 3. ฟังก์ชันการทำงาน
window.onload = function () {
    renderMemberList();
    document.getElementById('workDate').valueAsDate = new Date();
    // เปลี่ยนจาก loadSummary() เป็น listenToFirebase() เพื่อดึงข้อมูลแบบ Real-time
    listenToFirebase();
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

// แก้ไขฟังก์ชันบันทึก: ส่งขึ้น Firebase
function saveAttendance() {
    if (!checkAuth()) return;
    const date = document.getElementById('workDate').value;
    const rows = document.querySelectorAll('#memberList tr');
    if (!date) { alert("กรุณาเลือกวันที่"); return; }

    // เตรียมข้อมูลเพื่อส่งขึ้น Firebase
    rows.forEach(row => {
        const name = row.querySelector('.name-cell').innerText;
        const status = row.querySelector('.status-select').value;

        // บันทึกลงเส้นทาง attendance/วันที่/ชื่อ
        // ใช้ .replace เพื่อป้องกันชื่อที่มีตัวอักขระพิเศษที่ Firebase ไม่รองรับ
        const safeName = name.replace(/[.#$[\]]/g, "");
        db.ref('attendance/' + date + '/' + safeName).set({
            status: status
        });
    });

    alert("✅ บันทึกข้อมูลเข้าเซิร์ฟเวอร์เรียบร้อย!");
}

// ฟังก์ชันใหม่: คอยฟังข้อมูลจาก Firebase (ถ้าเครื่องไหนบันทึก ทุกเครื่องจะเปลี่ยนตามทันที)
function listenToFirebase() {
    db.ref('attendance').on('value', (snapshot) => {
        const data = snapshot.val();
        const displayList = [];

        if (data) {
            // แปลงโครงสร้าง Firebase (Object) ให้เป็น Array เพื่อใช้แสดงผล
            Object.keys(data).forEach(date => {
                Object.keys(data[date]).forEach(name => {
                    displayList.push({
                        date: date,
                        name: name,
                        status: data[date][name].status
                    });
                });
            });
        }

        // นำข้อมูลที่ได้ไปแสดงผล
        renderSummaryTable(displayList);
        updateRanking(displayList);
    });
}

function renderSummaryTable(allData) {
    const filterDate = document.getElementById('filterDate') ? document.getElementById('filterDate').value : "";
    const summaryBody = document.getElementById('summaryBody');

    let filteredData = filterDate ? allData.filter(item => item.date === filterDate) : allData;
    const displayData = [...filteredData].reverse();

    if (displayData.length === 0) {
        summaryBody.innerHTML = `<tr><td colspan="5">ไม่มีข้อมูล</td></tr>`;
    } else {
        summaryBody.innerHTML = displayData.map((item) => `
            <tr>
                <td>${item.date}</td>
                <td class="name-cell">${item.name}</td>
                <td class="status-cell" style="color: ${item.status === 'ขาดงาน' ? 'red' : 'green'}">
                    ${item.status}
                </td>
                <td><button onclick="editOnline('${item.date}', '${item.name}', '${item.status}')">✏️ แก้ไข</button></td>
                <td><button onclick="deleteOnline('${item.date}', '${item.name}')">🗑️</button></td>
            </tr>
        `).join('');
    }
}

// ฟังก์ชันลบข้อมูลบน Firebase
function deleteOnline(date, name) {
    if (!checkAuth()) return;
    if (confirm("ลบข้อมูลของ " + name + " วันที่ " + date + "?")) {
        db.ref('attendance/' + date + '/' + name).remove();
    }
}

// ฟังก์ชันแก้ไขข้อมูลบน Firebase
function editOnline(date, name, currentStatus) {
    if (!checkAuth()) return;
    const newStatus = currentStatus === "มาทำงาน" ? "ขาดงาน" : "มาทำงาน";
    db.ref('attendance/' + date + '/' + name).update({
        status: newStatus
    });
}

function clearData() {
    if (!checkAuth()) return;
    if (confirm("⚠️ ล้างข้อมูลทั้งหมดในฐานข้อมูลออนไลน์?")) {
        db.ref('attendance').remove();
    }
}

// ฟังก์ชัน updateRanking และอื่นๆ ใช้ชุดเดิมได้เลย แต่เปลี่ยนตัวรับข้อมูลจาก localStorage เป็น data จาก Firebase

// ฟังก์ชันล้างตัวกรอง (Reset Filter)
function resetFilter() {
    const filterInput = document.getElementById('filterDate');
    if (filterInput) {
        filterInput.value = "";
        // เมื่อล้างค่า ให้ดึงข้อมูลมาแสดงใหม่ทั้งหมด
        listenToFirebase();
    }
}

// ฟังก์ชันสรุปอันดับ (Ranking) แบบ Real-time
function updateRanking(allData) {
    const stats = {};

    // ตั้งค่าเริ่มต้นให้ทุกคนเป็น 0
    students.forEach(s => {
        const key = `${s.fullname} (${s.nickname})`;
        stats[key] = { attend: 0, absent: 0 };
    });

    // นับคะแนนจากข้อมูล Firebase
    allData.forEach(item => {
        if (stats[item.name]) {
            if (item.status === "มาทำงาน") {
                stats[item.name].attend++;
            } else if (item.status === "ขาดงาน") {
                stats[item.name].absent++;
            }
        }
    });

    // แปลงเป็น Array เพื่อเรียงลำดับ
    const rankingArray = Object.keys(stats).map(key => ({
        name: key,
        attend: stats[key].attend,
        absent: stats[key].absent
    }));

    // 1. เรียงอันดับคนมาบ่อย (มาก -> น้อย)
    const topWorkersHTML = [...rankingArray]
        .sort((a, b) => b.attend - a.attend)
        .map((s, i) => `
            <li>
                <span>${i + 1}. ${s.name}</span>
                <span class="count-badge">${s.attend} ครั้ง</span>
            </li>
        `).join('');

    // 2. เรียงอันดับคนขาดบ่อย (มาก -> น้อย)
    const topAbsenteesHTML = [...rankingArray]
        .sort((a, b) => b.absent - a.absent)
        .filter(s => s.absent > 0) // แสดงเฉพาะคนที่มีสถิติขาด
        .map((s, i) => `
            <li>
                <span>${i + 1}. ${s.name}</span>
                <span class="count-badge" style="background: #e74c3c;">${s.absent} ครั้ง</span>
            </li>
        `).join('');

    // นำไปใส่ใน HTML
    const topWorkersEl = document.getElementById('topWorkers');
    const topAbsenteesEl = document.getElementById('topAbsentees');

    if (topWorkersEl) topWorkersEl.innerHTML = topWorkersHTML;
    if (topAbsenteesEl) topAbsenteesEl.innerHTML = topAbsenteesHTML || "<li>ไม่มีข้อมูลการขาดงาน</li>";
}