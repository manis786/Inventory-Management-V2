// 30+ Customers with ledger data
export const CUSTOMERS = [
  { id:'C001', name:'Haji Amjad Ali', phone:'0300-1234567', email:'amjad@gmail.com', address:'House 12, Block C, Gulshan-e-Iqbal, Karachi', balance:18450, totalTransactions:86, totalSpent:245000, joinDate:'2024-01-15', isKhata:true, status:'active', avatar:'HA' },
  { id:'C002', name:'Kamran Sheikh', phone:'0321-9876543', email:'kamran.sheikh@hotmail.com', address:'Flat 4A, North Nazimabad, Karachi', balance:12800, totalTransactions:64, totalSpent:178000, joinDate:'2024-03-20', isKhata:true, status:'active', avatar:'KS' },
  { id:'C003', name:'Shagufta Begum', phone:'0311-5554321', email:'', address:'House 8, Liaquatabad, Karachi', balance:5920, totalTransactions:112, totalSpent:325000, joinDate:'2023-11-05', isKhata:true, status:'active', avatar:'SB' },
  { id:'C004', name:'Raheem Ahmed', phone:'0345-7771234', email:'raheem.a@gmail.com', address:'FB Area Block 15, Karachi', balance:0, totalTransactions:42, totalSpent:89000, joinDate:'2024-05-12', isKhata:false, status:'active', avatar:'RA' },
  { id:'C005', name:'Walk-In Customer', phone:'', email:'', address:'', balance:0, totalTransactions:0, totalSpent:0, joinDate:'', isKhata:false, status:'active', avatar:'WC' },
  { id:'C006', name:'Syed Asad Hussain', phone:'0333-2345678', email:'asad.hussain@yahoo.com', address:'House 22, Gulistan-e-Jauhar, Karachi', balance:8750, totalTransactions:55, totalSpent:156000, joinDate:'2024-02-10', isKhata:true, status:'active', avatar:'AH' },
  { id:'C007', name:'Fatima Bibi', phone:'0312-8765432', email:'', address:'Block 3, Buffer Zone, Karachi', balance:3200, totalTransactions:38, totalSpent:72000, joinDate:'2024-06-18', isKhata:true, status:'active', avatar:'FB' },
  { id:'C008', name:'Mohammad Saleem', phone:'0300-4567890', email:'saleem.m@gmail.com', address:'House 5, PECHS Block 6, Karachi', balance:0, totalTransactions:95, totalSpent:280000, joinDate:'2023-09-01', isKhata:false, status:'active', avatar:'MS' },
  { id:'C009', name:'Rubina Parveen', phone:'0321-1122334', email:'', address:'Flat 2B, Nazimabad No.4, Karachi', balance:15600, totalTransactions:48, totalSpent:142000, joinDate:'2024-04-22', isKhata:true, status:'active', avatar:'RP' },
  { id:'C010', name:'Tariq Mehmood', phone:'0345-5566778', email:'tariq.m@outlook.com', address:'House 18, Model Colony, Karachi', balance:0, totalTransactions:28, totalSpent:65000, joinDate:'2024-07-15', isKhata:false, status:'active', avatar:'TM' },
  { id:'C011', name:'Nazia Khan', phone:'0333-9988776', email:'nazia.k@gmail.com', address:'Block 14, Gulshan-e-Iqbal, Karachi', balance:7300, totalTransactions:72, totalSpent:198000, joinDate:'2023-12-10', isKhata:true, status:'active', avatar:'NK' },
  { id:'C012', name:'Abdul Rasheed', phone:'0300-3344556', email:'', address:'Orangi Town, Sector 11, Karachi', balance:22100, totalTransactions:35, totalSpent:95000, joinDate:'2024-08-05', isKhata:true, status:'active', avatar:'AR' },
  { id:'C013', name:'Saima Akram', phone:'0312-7766554', email:'saima.a@yahoo.com', address:'North Karachi, Sector 5L, Karachi', balance:0, totalTransactions:62, totalSpent:175000, joinDate:'2024-01-28', isKhata:false, status:'active', avatar:'SA' },
  { id:'C014', name:'Waseem Baig', phone:'0321-2233445', email:'waseem.b@gmail.com', address:'Malir, 15 No. Stop, Karachi', balance:4500, totalTransactions:41, totalSpent:108000, joinDate:'2024-05-30', isKhata:true, status:'active', avatar:'WB' },
  { id:'C015', name:'Bushra Siddiqui', phone:'0345-8877665', email:'', address:'Bahadurabad, Karachi', balance:0, totalTransactions:88, totalSpent:245000, joinDate:'2023-10-15', isKhata:false, status:'active', avatar:'BS' },
  { id:'C016', name:'Imran Qasim', phone:'0333-1144778', email:'imran.q@hotmail.com', address:'Korangi, Sector 35, Karachi', balance:9800, totalTransactions:32, totalSpent:78000, joinDate:'2024-09-12', isKhata:true, status:'active', avatar:'IQ' },
  { id:'C017', name:'Zainab Faisal', phone:'0300-6677889', email:'zainab.f@gmail.com', address:'DHA Phase 2, Karachi', balance:0, totalTransactions:105, totalSpent:420000, joinDate:'2023-08-20', isKhata:false, status:'active', avatar:'ZF' },
  { id:'C018', name:'Ghulam Mustafa', phone:'0312-9900112', email:'', address:'Landhi, Sector 36, Karachi', balance:6400, totalTransactions:27, totalSpent:62000, joinDate:'2024-10-08', isKhata:true, status:'active', avatar:'GM' },
  { id:'C019', name:'Asif Javed', phone:'0321-5544332', email:'asif.j@outlook.com', address:'Gulshan Block 13A, Karachi', balance:0, totalTransactions:52, totalSpent:148000, joinDate:'2024-03-05', isKhata:false, status:'active', avatar:'AJ' },
  { id:'C020', name:'Nasreen Akhtar', phone:'0345-2211009', email:'', address:'Nazimabad No.1, Karachi', balance:11250, totalTransactions:45, totalSpent:132000, joinDate:'2024-06-25', isKhata:true, status:'active', avatar:'NA' },
  { id:'C021', name:'Usman Ghani', phone:'0333-7788990', email:'usman.g@gmail.com', address:'Saddar, Karachi', balance:0, totalTransactions:38, totalSpent:95000, joinDate:'2024-07-30', isKhata:false, status:'active', avatar:'UG' },
  { id:'C022', name:'Perveen Sultana', phone:'0300-1133557', email:'', address:'Gulistan-e-Jauhar Block 12, Karachi', balance:3850, totalTransactions:22, totalSpent:48000, joinDate:'2025-01-15', isKhata:true, status:'active', avatar:'PS' },
  { id:'C023', name:'Zahid Khan', phone:'0312-4455667', email:'zahid.k@yahoo.com', address:'Surjani Town, Sector 3, Karachi', balance:0, totalTransactions:65, totalSpent:186000, joinDate:'2024-02-28', isKhata:false, status:'active', avatar:'ZK' },
  { id:'C024', name:'Sadia Noor', phone:'0321-8899001', email:'sadia.n@gmail.com', address:'PECHS Block 2, Karachi', balance:0, totalTransactions:78, totalSpent:265000, joinDate:'2023-11-20', isKhata:false, status:'active', avatar:'SN' },
  { id:'C025', name:'Akbar Ali', phone:'0345-3322110', email:'', address:'Shah Faisal Colony, Karachi', balance:16800, totalTransactions:30, totalSpent:82000, joinDate:'2024-11-05', isKhata:true, status:'active', avatar:'AA' },
  { id:'C026', name:'Mehnaz Qadir', phone:'0333-5566778', email:'mehnaz.q@hotmail.com', address:'Clifton Block 5, Karachi', balance:0, totalTransactions:42, totalSpent:190000, joinDate:'2024-04-10', isKhata:false, status:'active', avatar:'MQ' },
  { id:'C027', name:'Shahid Iqbal', phone:'0300-9988776', email:'shahid.i@gmail.com', address:'Korangi Creek, Karachi', balance:7200, totalTransactions:18, totalSpent:45000, joinDate:'2025-02-20', isKhata:true, status:'active', avatar:'SI' },
  { id:'C028', name:'Ayesha Malik', phone:'0312-2233440', email:'ayesha.m@yahoo.com', address:'DHA Phase 6, Karachi', balance:0, totalTransactions:92, totalSpent:380000, joinDate:'2023-07-15', isKhata:false, status:'active', avatar:'AM' },
  { id:'C029', name:'Bashir Ahmed', phone:'0321-7766550', email:'', address:'Gulistan Colony, Karachi', balance:5500, totalTransactions:55, totalSpent:165000, joinDate:'2024-01-08', isKhata:true, status:'active', avatar:'BA' },
  { id:'C030', name:'Rizwan Ahmed', phone:'0345-1100998', email:'rizwan.a@gmail.com', address:'North Nazimabad Block L, Karachi', balance:0, totalTransactions:35, totalSpent:98000, joinDate:'2024-08-18', isKhata:false, status:'active', avatar:'RA2' },
];

// Khata (Credit) Ledger entries
export const KHATA_LEDGER = {
  'C001': [
    { date:'2026-06-13', invoiceId:'TXN-001', description:'Grocery Bundle (Milk, Tea, Spices)', amount:4545, type:'debit' },
    { date:'2026-06-11', invoiceId:'TXN-006', description:'Household Items & Snacks', amount:3200, type:'debit' },
    { date:'2026-06-08', invoiceId:'PMT-001', description:'Payment Received (Cash)', amount:5000, type:'credit' },
    { date:'2026-06-05', invoiceId:'TXN-REF-01', description:'Monthly Grocery Pack', amount:8500, type:'debit' },
    { date:'2026-06-01', invoiceId:'PMT-002', description:'Payment Received (JazzCash)', amount:3000, type:'credit' },
    { date:'2026-05-28', invoiceId:'TXN-REF-02', description:'Cooking Oil & Rice', amount:6200, type:'debit' },
    { date:'2026-05-20', invoiceId:'PMT-003', description:'Partial Payment', amount:4000, type:'credit' },
    { date:'2026-05-15', invoiceId:'TXN-REF-03', description:'Baby Products & Personal Care', amount:5800, type:'debit' },
    { date:'2026-05-10', invoiceId:'PMT-004', description:'Payment Received (Bank)', amount:2500, type:'credit' },
    { date:'2026-05-01', invoiceId:'TXN-REF-04', description:'Beverages & Snacks', amount:4705, type:'debit' },
  ],
  'C002': [
    { date:'2026-06-12', invoiceId:'TXN-003', description:'Cooking Oil, Biryani Masala, Rice', amount:5800, type:'debit' },
    { date:'2026-06-05', invoiceId:'TXN-REF-05', description:'Household Items Bundle', amount:3200, type:'debit' },
    { date:'2026-06-01', invoiceId:'PMT-005', description:'Payment Received (Cash)', amount:4000, type:'credit' },
    { date:'2026-05-25', invoiceId:'TXN-REF-06', description:'Snacks & Beverages', amount:4500, type:'debit' },
    { date:'2026-05-18', invoiceId:'PMT-006', description:'Payment Received', amount:3000, type:'credit' },
    { date:'2026-05-10', invoiceId:'TXN-REF-07', description:'Monthly Essentials', amount:6100, type:'debit' },
  ],
  'C003': [
    { date:'2026-06-09', invoiceId:'TXN-REF-08', description:'Personal Care Products', amount:2920, type:'debit' },
    { date:'2026-06-02', invoiceId:'PMT-007', description:'Payment Received', amount:2000, type:'credit' },
    { date:'2026-05-28', invoiceId:'TXN-REF-09', description:'Baby Care & Dairy', amount:4500, type:'debit' },
    { date:'2026-05-15', invoiceId:'PMT-008', description:'Payment Received (EasyPaisa)', amount:3500, type:'credit' },
    { date:'2026-05-05', invoiceId:'TXN-REF-10', description:'Kitchen Essentials', amount:4000, type:'debit' },
  ],
};

export const getCustomerById = (id) => CUSTOMERS.find(c => c.id === id);
export const getTotalReceivables = () => CUSTOMERS.reduce((sum, c) => sum + c.balance, 0);
export const getKhataCustomers = () => CUSTOMERS.filter(c => c.isKhata && c.balance > 0);
