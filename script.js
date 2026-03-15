// Sample student data
const studentsData = [
    { id: 1, name: "ด.ช. กิตติพงษ์ ใจดี" },
    { id: 2, name: "ด.ญ. จิตตราภรณ์ มานะ" },
    { id: 3, name: "ด.ช. ชวกร รักเรียน" },
    { id: 4, name: "ด.ญ. ณิชากานต์ สนุกดี" },
    { id: 5, name: "ด.ช. ธนภูมิ เก่งกล้า" },
    { id: 6, name: "ด.ญ. นันทวัน ปัญญา" },
    { id: 7, name: "ด.ช. ปฐพี มั่นคง" },
    { id: 8, name: "ด.ญ. พรประวีณ์ เลิศล้ำ" },
    { id: 9, name: "ด.ช. ภูมิพัฒน์ ศรีสุข" },
    { id: 10, name: "ด.ญ. วรรณวนัช ผ่องใส" },
    { id: 11, name: "ด.ช. สหรัฐ ไทยแท้" },
    { id: 12, name: "ด.ญ. อนันตญา เพิ่มพูน" },
    { id: 13, name: "ด.ช. ธนากร แซ่ตั้ง" },
    { id: 14, name: "ด.ญ. กัญญารัตน์ สีสวย" },
    { id: 15, name: "ด.ช. วุฒิชัย พร้อมใจ" }
];

// State management
let attendance = JSON.parse(localStorage.getItem('attendance_p4_science')) || {};
const currentDate = new Date();

// DOM Elements
const studentList = document.getElementById('student-list');
const presentCount = document.getElementById('present-count');
const absentCount = document.getElementById('absent-count');
const lateCount = document.getElementById('late-count');
const totalCount = document.getElementById('total-count');
const dateDisplay = document.getElementById('current-date');
const timeDisplay = document.getElementById('current-time');
const searchInput = document.getElementById('student-search');
const exportBtn = document.getElementById('export-btn');

// Initialize
function init() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderStudents(studentsData);
    updateStats();
    
    searchInput.addEventListener('input', handleSearch);
    exportBtn.addEventListener('click', exportToCSV);
}

function updateDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('th-TH', options);
    timeDisplay.textContent = now.toLocaleTimeString('th-TH');
}

function renderStudents(data) {
    studentList.innerHTML = '';
    data.forEach(student => {
        const tr = document.createElement('tr');
        const status = attendance[student.id] || null;
        
        tr.innerHTML = `
            <td style="font-weight: bold; color: #4f46e5;">${student.id}</td>
            <td>${student.name}</td>
            <td>
                <div class="status-btns">
                    <button class="status-btn btn-present ${status === 'present' ? 'active' : ''}" onclick="toggleStatus(${student.id}, 'present')">มาเรียน</button>
                    <button class="status-btn btn-absent ${status === 'absent' ? 'active' : ''}" onclick="toggleStatus(${student.id}, 'absent')">ขาดเรียน</button>
                    <button class="status-btn btn-late ${status === 'late' ? 'active' : ''}" onclick="toggleStatus(${student.id}, 'late')">สาย</button>
                </div>
            </td>
        `;
        studentList.appendChild(tr);
    });
}

window.toggleStatus = (studentId, status) => {
    if (attendance[studentId] === status) {
        delete attendance[studentId];
    } else {
        attendance[studentId] = status;
    }
    
    saveToStorage();
    renderStudents(filterData());
    updateStats();
};

function filterData() {
    const query = searchInput.value.toLowerCase();
    return studentsData.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.id.toString().includes(query)
    );
}

function handleSearch() {
    renderStudents(filterData());
}

function updateStats() {
    const values = Object.values(attendance);
    presentCount.textContent = values.filter(v => v === 'present').length;
    absentCount.textContent = values.filter(v => v === 'absent').length;
    lateCount.textContent = values.filter(v => v === 'late').length;
    totalCount.textContent = studentsData.length;
}

function saveToStorage() {
    localStorage.setItem('attendance_p4_science', JSON.stringify(attendance));
}

function exportToCSV() {
    let csv = "\uFEFF"; // BOM for Thai characters
    csv += "เลขที่,ชื่อ-นามสกุล,สถานะ\n";
    
    studentsData.forEach(student => {
        const status = attendance[student.id] || "ไม่ได้เช็ค";
        const statusThai = status === 'present' ? 'มาเรียน' : (status === 'absent' ? 'ขาดเรียน' : (status === 'late' ? 'สาย' : 'ไม่ได้เช็ค'));
        csv += `${student.id},${student.name},${statusThai}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_science_p4_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

init();
