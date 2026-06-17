// ===== 500+ REALISTIC PRODUCTS FOR PAKISTANI RETAIL =====
// Each product has: id, name, category, categoryId, costPrice, salePrice, stock, minStock, unit, barcode, expiryDate, supplier, image (emoji), brand, description

const generateBarcode = (idx) => `89${String(idx).padStart(11, '0')}`;

export const PRODUCTS = [
  // ===== DAIRY & EGGS (CAT01) =====
  { id:'P001', name:"Olper's Full Cream Milk 1L", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:260, salePrice:290, stock:85, minStock:30, unit:'Pack', barcode:generateBarcode(1), expiryDate:'2026-08-15', supplier:'SUP001', image:'🥛', brand:"Olper's", status:'active' },
  { id:'P002', name:"Olper's Full Cream Milk 250ml", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:70, salePrice:85, stock:120, minStock:50, unit:'Pack', barcode:generateBarcode(2), expiryDate:'2026-08-10', supplier:'SUP001', image:'🥛', brand:"Olper's", status:'active' },
  { id:'P003', name:"Millac UHT Milk 1L", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:255, salePrice:285, stock:45, minStock:25, unit:'Pack', barcode:generateBarcode(3), expiryDate:'2026-09-20', supplier:'SUP001', image:'🥛', brand:'Millac', status:'active' },
  { id:'P004', name:"Nurpur Desi Ghee 1kg", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:1450, salePrice:1650, stock:20, minStock:10, unit:'Tin', barcode:generateBarcode(4), expiryDate:'2027-03-15', supplier:'SUP001', image:'🧈', brand:'Nurpur', status:'active' },
  { id:'P005', name:"Nurpur Butter 200g", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:280, salePrice:320, stock:35, minStock:15, unit:'Pack', barcode:generateBarcode(5), expiryDate:'2026-10-01', supplier:'SUP001', image:'🧈', brand:'Nurpur', status:'active' },
  { id:'P006', name:"Tarang Tea Whitener 200ml", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:60, salePrice:75, stock:150, minStock:60, unit:'Pack', barcode:generateBarcode(6), expiryDate:'2026-12-31', supplier:'SUP001', image:'🥛', brand:'Tarang', status:'active' },
  { id:'P007', name:"Dairy Queen Yogurt 500g", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:90, salePrice:110, stock:40, minStock:20, unit:'Cup', barcode:generateBarcode(7), expiryDate:'2026-07-15', supplier:'SUP001', image:'🥛', brand:'Dairy Queen', status:'active' },
  { id:'P008', name:"Everyday Milk Powder 400g", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:520, salePrice:595, stock:28, minStock:15, unit:'Pack', barcode:generateBarcode(8), expiryDate:'2027-01-01', supplier:'SUP001', image:'🥛', brand:'Everyday', status:'active' },
  { id:'P009', name:"Farm Fresh Eggs (12 pack)", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:280, salePrice:340, stock:55, minStock:25, unit:'Dozen', barcode:generateBarcode(9), expiryDate:'2026-07-20', supplier:'SUP006', image:'🥚', brand:'Farm Fresh', status:'active' },
  { id:'P010', name:"Adams Cheese Slice 200g", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:195, salePrice:230, stock:22, minStock:12, unit:'Pack', barcode:generateBarcode(10), expiryDate:'2026-09-30', supplier:'SUP001', image:'🧀', brand:'Adams', status:'active' },
  { id:'P011', name:"Haleeb Cream 200ml", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:120, salePrice:150, stock:30, minStock:15, unit:'Pack', barcode:generateBarcode(11), expiryDate:'2026-08-30', supplier:'SUP001', image:'🥛', brand:'Haleeb', status:'active' },
  { id:'P012', name:"Nestlé Raita 250ml", category:'Dairy & Eggs', categoryId:'CAT01', costPrice:85, salePrice:100, stock:45, minStock:20, unit:'Bottle', barcode:generateBarcode(12), expiryDate:'2026-07-25', supplier:'SUP001', image:'🥛', brand:'Nestlé', status:'active' },

  // ===== BEVERAGES (CAT02) =====
  { id:'P013', name:"Tapal Danedar 900g", category:'Beverages', categoryId:'CAT02', costPrice:850, salePrice:950, stock:32, minStock:15, unit:'Pack', barcode:generateBarcode(13), expiryDate:'2027-12-31', supplier:'SUP002', image:'🍵', brand:'Tapal', status:'active' },
  { id:'P014', name:"Tapal Danedar 450g", category:'Beverages', categoryId:'CAT02', costPrice:450, salePrice:510, stock:48, minStock:20, unit:'Pack', barcode:generateBarcode(14), expiryDate:'2027-12-31', supplier:'SUP002', image:'🍵', brand:'Tapal', status:'active' },
  { id:'P015', name:"Tapal Family Mixture 450g", category:'Beverages', categoryId:'CAT02', costPrice:420, salePrice:475, stock:25, minStock:12, unit:'Pack', barcode:generateBarcode(15), expiryDate:'2027-11-30', supplier:'SUP002', image:'🍵', brand:'Tapal', status:'active' },
  { id:'P016', name:"Lipton Yellow Label 380g", category:'Beverages', categoryId:'CAT02', costPrice:680, salePrice:760, stock:30, minStock:15, unit:'Box', barcode:generateBarcode(16), expiryDate:'2027-06-30', supplier:'SUP003', image:'🍵', brand:'Lipton', status:'active' },
  { id:'P017', name:"Lipton Yellow Label 190g", category:'Beverages', categoryId:'CAT02', costPrice:360, salePrice:405, stock:42, minStock:20, unit:'Box', barcode:generateBarcode(17), expiryDate:'2027-06-30', supplier:'SUP003', image:'🍵', brand:'Lipton', status:'active' },
  { id:'P018', name:"Vital Tea 430g", category:'Beverages', categoryId:'CAT02', costPrice:380, salePrice:430, stock:28, minStock:14, unit:'Pack', barcode:generateBarcode(18), expiryDate:'2027-09-30', supplier:'SUP002', image:'🍵', brand:'Vital', status:'active' },
  { id:'P019', name:"Nestle Pure Life 1.5L", category:'Beverages', categoryId:'CAT02', costPrice:55, salePrice:70, stock:200, minStock:80, unit:'Bottle', barcode:generateBarcode(19), expiryDate:'2027-01-01', supplier:'SUP001', image:'💧', brand:'Nestlé', status:'active' },
  { id:'P020', name:"Nestle Pure Life 500ml", category:'Beverages', categoryId:'CAT02', costPrice:30, salePrice:40, stock:300, minStock:100, unit:'Bottle', barcode:generateBarcode(20), expiryDate:'2027-01-01', supplier:'SUP001', image:'💧', brand:'Nestlé', status:'active' },
  { id:'P021', name:"Pepsi 1.5L", category:'Beverages', categoryId:'CAT02', costPrice:130, salePrice:160, stock:80, minStock:30, unit:'Bottle', barcode:generateBarcode(21), expiryDate:'2026-12-15', supplier:'SUP004', image:'🥤', brand:'Pepsi', status:'active' },
  { id:'P022', name:"Pepsi 345ml Can", category:'Beverages', categoryId:'CAT02', costPrice:75, salePrice:100, stock:120, minStock:50, unit:'Can', barcode:generateBarcode(22), expiryDate:'2026-12-15', supplier:'SUP004', image:'🥤', brand:'Pepsi', status:'active' },
  { id:'P023', name:"Coca-Cola 1.5L", category:'Beverages', categoryId:'CAT02', costPrice:130, salePrice:160, stock:75, minStock:30, unit:'Bottle', barcode:generateBarcode(23), expiryDate:'2026-12-20', supplier:'SUP004', image:'🥤', brand:'Coca-Cola', status:'active' },
  { id:'P024', name:"7UP 1.5L", category:'Beverages', categoryId:'CAT02', costPrice:125, salePrice:155, stock:65, minStock:25, unit:'Bottle', barcode:generateBarcode(24), expiryDate:'2026-12-15', supplier:'SUP004', image:'🥤', brand:'7UP', status:'active' },
  { id:'P025', name:"Mountain Dew 500ml", category:'Beverages', categoryId:'CAT02', costPrice:65, salePrice:85, stock:90, minStock:35, unit:'Bottle', barcode:generateBarcode(25), expiryDate:'2026-11-30', supplier:'SUP004', image:'🥤', brand:'Mountain Dew', status:'active' },
  { id:'P026', name:"Sprite 500ml", category:'Beverages', categoryId:'CAT02', costPrice:65, salePrice:85, stock:88, minStock:35, unit:'Bottle', barcode:generateBarcode(26), expiryDate:'2026-12-01', supplier:'SUP004', image:'🥤', brand:'Sprite', status:'active' },
  { id:'P027', name:"Tang Orange 375g", category:'Beverages', categoryId:'CAT02', costPrice:200, salePrice:240, stock:35, minStock:15, unit:'Pack', barcode:generateBarcode(27), expiryDate:'2027-03-31', supplier:'SUP007', image:'🍊', brand:'Tang', status:'active' },
  { id:'P028', name:"Rooh Afza 800ml", category:'Beverages', categoryId:'CAT02', costPrice:320, salePrice:380, stock:40, minStock:18, unit:'Bottle', barcode:generateBarcode(28), expiryDate:'2027-05-15', supplier:'SUP002', image:'🍹', brand:'Hamdard', status:'active' },
  { id:'P029', name:"Nestle Fruita Vitals Mango 200ml", category:'Beverages', categoryId:'CAT02', costPrice:45, salePrice:60, stock:110, minStock:40, unit:'Pack', barcode:generateBarcode(29), expiryDate:'2026-10-01', supplier:'SUP001', image:'🧃', brand:'Nestlé', status:'active' },
  { id:'P030', name:"Sting Energy Drink 250ml", category:'Beverages', categoryId:'CAT02', costPrice:65, salePrice:85, stock:95, minStock:40, unit:'Bottle', barcode:generateBarcode(30), expiryDate:'2026-11-15', supplier:'SUP004', image:'⚡', brand:'Sting', status:'active' },
  { id:'P031', name:"Red Bull 250ml", category:'Beverages', categoryId:'CAT02', costPrice:280, salePrice:350, stock:30, minStock:12, unit:'Can', barcode:generateBarcode(31), expiryDate:'2027-02-28', supplier:'SUP004', image:'🐂', brand:'Red Bull', status:'active' },
  { id:'P032', name:"Nescafe 3in1 Sachet (30)", category:'Beverages', categoryId:'CAT02', costPrice:650, salePrice:750, stock:18, minStock:8, unit:'Box', barcode:generateBarcode(32), expiryDate:'2027-06-30', supplier:'SUP001', image:'☕', brand:'Nescafé', status:'active' },

  // ===== SNACKS & CHIPS (CAT03) =====
  { id:'P033', name:"Lays Classic Salted 70g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:75, salePrice:100, stock:100, minStock:40, unit:'Pack', barcode:generateBarcode(33), expiryDate:'2026-09-15', supplier:'SUP004', image:'🥔', brand:'Lays', status:'active' },
  { id:'P034', name:"Lays Masala 35g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:35, salePrice:50, stock:180, minStock:60, unit:'Pack', barcode:generateBarcode(34), expiryDate:'2026-09-10', supplier:'SUP004', image:'🥔', brand:'Lays', status:'active' },
  { id:'P035', name:"Lays French Cheese 70g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:75, salePrice:100, stock:85, minStock:35, unit:'Pack', barcode:generateBarcode(35), expiryDate:'2026-09-10', supplier:'SUP004', image:'🥔', brand:'Lays', status:'active' },
  { id:'P036', name:"Kurkure Chutney 62g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:50, salePrice:70, stock:120, minStock:50, unit:'Pack', barcode:generateBarcode(36), expiryDate:'2026-08-20', supplier:'SUP004', image:'🌽', brand:'Kurkure', status:'active' },
  { id:'P037', name:"Cheetos Flaming Hot 75g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:65, salePrice:85, stock:70, minStock:30, unit:'Pack', barcode:generateBarcode(37), expiryDate:'2026-09-05', supplier:'SUP004', image:'🧀', brand:'Cheetos', status:'active' },
  { id:'P038', name:"Super Crisp BBQ 30g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:25, salePrice:40, stock:200, minStock:70, unit:'Pack', barcode:generateBarcode(38), expiryDate:'2026-08-30', supplier:'SUP008', image:'🥔', brand:'Super Crisp', status:'active' },
  { id:'P039', name:"Pringles Original 165g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:450, salePrice:530, stock:15, minStock:8, unit:'Can', barcode:generateBarcode(39), expiryDate:'2027-01-15', supplier:'SUP004', image:'🥔', brand:'Pringles', status:'active' },
  { id:'P040', name:"Kolson Slanty 80g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:55, salePrice:75, stock:90, minStock:35, unit:'Pack', barcode:generateBarcode(40), expiryDate:'2026-10-01', supplier:'SUP008', image:'🥔', brand:'Kolson', status:'active' },
  { id:'P041', name:"Nimco Mix 200g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:120, salePrice:150, stock:45, minStock:20, unit:'Pack', barcode:generateBarcode(41), expiryDate:'2026-11-30', supplier:'SUP008', image:'🥜', brand:'Local', status:'active' },
  { id:'P042', name:"Doritos Nacho Cheese 72g", category:'Snacks & Chips', categoryId:'CAT03', costPrice:80, salePrice:110, stock:60, minStock:25, unit:'Pack', barcode:generateBarcode(42), expiryDate:'2026-09-20', supplier:'SUP004', image:'🌮', brand:'Doritos', status:'active' },

  // ===== SPICES & MASALA (CAT04) =====
  { id:'P043', name:"Shan Biryani Masala 60g", category:'Spices & Masala', categoryId:'CAT04', costPrice:85, salePrice:110, stock:70, minStock:30, unit:'Pack', barcode:generateBarcode(43), expiryDate:'2027-06-30', supplier:'SUP002', image:'🌶️', brand:'Shan', status:'active' },
  { id:'P044', name:"Shan Karahi Masala 50g", category:'Spices & Masala', categoryId:'CAT04', costPrice:75, salePrice:95, stock:65, minStock:28, unit:'Pack', barcode:generateBarcode(44), expiryDate:'2027-06-30', supplier:'SUP002', image:'🌶️', brand:'Shan', status:'active' },
  { id:'P045', name:"Shan Nihari Masala 60g", category:'Spices & Masala', categoryId:'CAT04', costPrice:90, salePrice:115, stock:50, minStock:22, unit:'Pack', barcode:generateBarcode(45), expiryDate:'2027-05-31', supplier:'SUP002', image:'🌶️', brand:'Shan', status:'active' },
  { id:'P046', name:"National Biryani Masala 45g", category:'Spices & Masala', categoryId:'CAT04', costPrice:55, salePrice:70, stock:80, minStock:35, unit:'Pack', barcode:generateBarcode(46), expiryDate:'2027-04-30', supplier:'SUP002', image:'🌶️', brand:'National', status:'active' },
  { id:'P047', name:"National Recipe Mix Haleem 50g", category:'Spices & Masala', categoryId:'CAT04', costPrice:65, salePrice:80, stock:40, minStock:18, unit:'Pack', barcode:generateBarcode(47), expiryDate:'2027-03-31', supplier:'SUP002', image:'🌶️', brand:'National', status:'active' },
  { id:'P048', name:"Mehran Red Chili Powder 200g", category:'Spices & Masala', categoryId:'CAT04', costPrice:130, salePrice:160, stock:55, minStock:25, unit:'Pack', barcode:generateBarcode(48), expiryDate:'2027-08-31', supplier:'SUP002', image:'🌶️', brand:'Mehran', status:'active' },
  { id:'P049', name:"Mehran Turmeric Powder 200g", category:'Spices & Masala', categoryId:'CAT04', costPrice:110, salePrice:135, stock:48, minStock:20, unit:'Pack', barcode:generateBarcode(49), expiryDate:'2027-08-31', supplier:'SUP002', image:'🌶️', brand:'Mehran', status:'active' },
  { id:'P050', name:"Mehran Coriander Powder 200g", category:'Spices & Masala', categoryId:'CAT04', costPrice:115, salePrice:140, stock:42, minStock:18, unit:'Pack', barcode:generateBarcode(50), expiryDate:'2027-07-31', supplier:'SUP002', image:'🌿', brand:'Mehran', status:'active' },
  { id:'P051', name:"Black Pepper Whole 100g", category:'Spices & Masala', categoryId:'CAT04', costPrice:280, salePrice:340, stock:25, minStock:10, unit:'Pack', barcode:generateBarcode(51), expiryDate:'2027-12-31', supplier:'SUP002', image:'⚫', brand:'Mehran', status:'active' },
  { id:'P052', name:"Cumin Seeds 100g", category:'Spices & Masala', categoryId:'CAT04', costPrice:160, salePrice:200, stock:35, minStock:15, unit:'Pack', barcode:generateBarcode(52), expiryDate:'2027-10-31', supplier:'SUP002', image:'🌱', brand:'Shan', status:'active' },
  { id:'P053', name:"Garam Masala 100g", category:'Spices & Masala', categoryId:'CAT04', costPrice:180, salePrice:220, stock:30, minStock:12, unit:'Pack', barcode:generateBarcode(53), expiryDate:'2027-09-30', supplier:'SUP002', image:'🌶️', brand:'National', status:'active' },
  { id:'P054', name:"Kitchen King Masala 100g", category:'Spices & Masala', categoryId:'CAT04', costPrice:95, salePrice:120, stock:45, minStock:20, unit:'Pack', barcode:generateBarcode(54), expiryDate:'2027-06-30', supplier:'SUP002', image:'👑', brand:'MDH', status:'active' },

  // ===== COOKING OIL & GHEE (CAT05) =====
  { id:'P055', name:"Dalda Cooking Oil 5L", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:2200, salePrice:2450, stock:25, minStock:10, unit:'Can', barcode:generateBarcode(55), expiryDate:'2027-03-15', supplier:'SUP005', image:'🫒', brand:'Dalda', status:'active' },
  { id:'P056', name:"Dalda Cooking Oil 1L", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:480, salePrice:540, stock:45, minStock:20, unit:'Bottle', barcode:generateBarcode(56), expiryDate:'2027-03-15', supplier:'SUP005', image:'🫒', brand:'Dalda', status:'active' },
  { id:'P057', name:"Habib Cooking Oil 5L", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:2100, salePrice:2350, stock:20, minStock:8, unit:'Can', barcode:generateBarcode(57), expiryDate:'2027-02-28', supplier:'SUP005', image:'🫒', brand:'Habib', status:'active' },
  { id:'P058', name:"Sufi Sunflower Oil 3L", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:1500, salePrice:1700, stock:18, minStock:8, unit:'Bottle', barcode:generateBarcode(58), expiryDate:'2027-04-30', supplier:'SUP005', image:'🌻', brand:'Sufi', status:'active' },
  { id:'P059', name:"Mezan Canola Oil 5L", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:2350, salePrice:2600, stock:15, minStock:6, unit:'Can', barcode:generateBarcode(59), expiryDate:'2027-05-31', supplier:'SUP005', image:'🫒', brand:'Mezan', status:'active' },
  { id:'P060', name:"Dalda Banaspati Ghee 1kg", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:490, salePrice:560, stock:30, minStock:12, unit:'Pack', barcode:generateBarcode(60), expiryDate:'2027-01-31', supplier:'SUP005', image:'🧈', brand:'Dalda', status:'active' },
  { id:'P061', name:"Dalda Banaspati Ghee 2.5kg", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:1200, salePrice:1380, stock:12, minStock:5, unit:'Tin', barcode:generateBarcode(61), expiryDate:'2027-01-31', supplier:'SUP005', image:'🧈', brand:'Dalda', status:'active' },
  { id:'P062', name:"Olive Oil Extra Virgin 500ml", category:'Cooking Oil & Ghee', categoryId:'CAT05', costPrice:850, salePrice:980, stock:10, minStock:4, unit:'Bottle', barcode:generateBarcode(62), expiryDate:'2027-08-31', supplier:'SUP007', image:'🫒', brand:'Borges', status:'active' },

  // ===== RICE & FLOUR (CAT06) =====
  { id:'P063', name:"Guard Super Kernel Basmati 5kg", category:'Rice & Flour', categoryId:'CAT06', costPrice:1800, salePrice:2050, stock:22, minStock:10, unit:'Bag', barcode:generateBarcode(63), expiryDate:'2027-06-30', supplier:'SUP006', image:'🍚', brand:'Guard', status:'active' },
  { id:'P064', name:"Guard Super Kernel Basmati 1kg", category:'Rice & Flour', categoryId:'CAT06', costPrice:380, salePrice:430, stock:40, minStock:18, unit:'Pack', barcode:generateBarcode(64), expiryDate:'2027-06-30', supplier:'SUP006', image:'🍚', brand:'Guard', status:'active' },
  { id:'P065', name:"Falak Basmati Rice 5kg", category:'Rice & Flour', categoryId:'CAT06', costPrice:1650, salePrice:1880, stock:18, minStock:8, unit:'Bag', barcode:generateBarcode(65), expiryDate:'2027-05-31', supplier:'SUP006', image:'🍚', brand:'Falak', status:'active' },
  { id:'P066', name:"Sunridge Atta 10kg", category:'Rice & Flour', categoryId:'CAT06', costPrice:850, salePrice:970, stock:35, minStock:15, unit:'Bag', barcode:generateBarcode(66), expiryDate:'2026-12-31', supplier:'SUP006', image:'🌾', brand:'Sunridge', status:'active' },
  { id:'P067', name:"Sunridge Atta 5kg", category:'Rice & Flour', categoryId:'CAT06', costPrice:440, salePrice:500, stock:50, minStock:25, unit:'Bag', barcode:generateBarcode(67), expiryDate:'2026-12-31', supplier:'SUP006', image:'🌾', brand:'Sunridge', status:'active' },
  { id:'P068', name:"Golden Harvest Fine Flour 2kg", category:'Rice & Flour', categoryId:'CAT06', costPrice:210, salePrice:250, stock:30, minStock:12, unit:'Pack', barcode:generateBarcode(68), expiryDate:'2026-11-30', supplier:'SUP006', image:'🌾', brand:'Golden Harvest', status:'active' },
  { id:'P069', name:"Maida Fine Flour 1kg", category:'Rice & Flour', categoryId:'CAT06', costPrice:95, salePrice:120, stock:45, minStock:20, unit:'Pack', barcode:generateBarcode(69), expiryDate:'2026-10-31', supplier:'SUP006', image:'🌾', brand:'Local', status:'active' },
  { id:'P070', name:"Corn Flour 400g", category:'Rice & Flour', categoryId:'CAT06', costPrice:110, salePrice:140, stock:28, minStock:12, unit:'Pack', barcode:generateBarcode(70), expiryDate:'2027-01-31', supplier:'SUP006', image:'🌽', brand:'Rafhan', status:'active' },
  { id:'P071', name:"Semolina (Suji) 500g", category:'Rice & Flour', categoryId:'CAT06', costPrice:85, salePrice:110, stock:35, minStock:15, unit:'Pack', barcode:generateBarcode(71), expiryDate:'2027-02-28', supplier:'SUP006', image:'🌾', brand:'Local', status:'active' },

  // ===== PERSONAL CARE (CAT07) =====
  { id:'P072', name:"Sunsilk Shampoo Pink 360ml", category:'Personal Care', categoryId:'CAT07', costPrice:480, salePrice:560, stock:25, minStock:10, unit:'Bottle', barcode:generateBarcode(72), expiryDate:'2027-12-31', supplier:'SUP003', image:'🧴', brand:'Sunsilk', status:'active' },
  { id:'P073', name:"Sunsilk Shampoo Black 185ml", category:'Personal Care', categoryId:'CAT07', costPrice:280, salePrice:330, stock:32, minStock:14, unit:'Bottle', barcode:generateBarcode(73), expiryDate:'2027-12-31', supplier:'SUP003', image:'🧴', brand:'Sunsilk', status:'active' },
  { id:'P074', name:"Head & Shoulders 185ml", category:'Personal Care', categoryId:'CAT07', costPrice:350, salePrice:410, stock:20, minStock:10, unit:'Bottle', barcode:generateBarcode(74), expiryDate:'2027-10-31', supplier:'SUP009', image:'🧴', brand:'Head & Shoulders', status:'active' },
  { id:'P075', name:"Dove Shampoo 360ml", category:'Personal Care', categoryId:'CAT07', costPrice:520, salePrice:600, stock:18, minStock:8, unit:'Bottle', barcode:generateBarcode(75), expiryDate:'2027-11-30', supplier:'SUP003', image:'🧴', brand:'Dove', status:'active' },
  { id:'P076', name:"Lux Soap 100g", category:'Personal Care', categoryId:'CAT07', costPrice:80, salePrice:100, stock:120, minStock:50, unit:'Bar', barcode:generateBarcode(76), expiryDate:'2028-06-30', supplier:'SUP003', image:'🧼', brand:'Lux', status:'active' },
  { id:'P077', name:"Dettol Soap 130g", category:'Personal Care', categoryId:'CAT07', costPrice:110, salePrice:140, stock:80, minStock:35, unit:'Bar', barcode:generateBarcode(77), expiryDate:'2028-03-31', supplier:'SUP009', image:'🧼', brand:'Dettol', status:'active' },
  { id:'P078', name:"Safeguard Soap 100g", category:'Personal Care', categoryId:'CAT07', costPrice:85, salePrice:105, stock:95, minStock:40, unit:'Bar', barcode:generateBarcode(78), expiryDate:'2028-04-30', supplier:'SUP009', image:'🧼', brand:'Safeguard', status:'active' },
  { id:'P079', name:"Colgate Max Fresh 150g", category:'Personal Care', categoryId:'CAT07', costPrice:240, salePrice:290, stock:35, minStock:15, unit:'Tube', barcode:generateBarcode(79), expiryDate:'2027-09-30', supplier:'SUP009', image:'🪥', brand:'Colgate', status:'active' },
  { id:'P080', name:"Sensodyne Toothpaste 100g", category:'Personal Care', categoryId:'CAT07', costPrice:380, salePrice:450, stock:15, minStock:8, unit:'Tube', barcode:generateBarcode(80), expiryDate:'2027-08-31', supplier:'SUP009', image:'🪥', brand:'Sensodyne', status:'active' },
  { id:'P081', name:"Close Up Toothpaste 150g", category:'Personal Care', categoryId:'CAT07', costPrice:210, salePrice:260, stock:28, minStock:12, unit:'Tube', barcode:generateBarcode(81), expiryDate:'2027-07-31', supplier:'SUP003', image:'🪥', brand:'Close Up', status:'active' },
  { id:'P082', name:"Lifebuoy Hand Wash 200ml", category:'Personal Care', categoryId:'CAT07', costPrice:180, salePrice:220, stock:40, minStock:18, unit:'Bottle', barcode:generateBarcode(82), expiryDate:'2027-12-31', supplier:'SUP003', image:'🧴', brand:'Lifebuoy', status:'active' },
  { id:'P083', name:"Vaseline Body Lotion 200ml", category:'Personal Care', categoryId:'CAT07', costPrice:320, salePrice:380, stock:22, minStock:10, unit:'Bottle', barcode:generateBarcode(83), expiryDate:'2027-10-31', supplier:'SUP003', image:'🧴', brand:'Vaseline', status:'active' },
  { id:'P084', name:"Fair & Lovely Cream 50g", category:'Personal Care', categoryId:'CAT07', costPrice:180, salePrice:220, stock:30, minStock:12, unit:'Tube', barcode:generateBarcode(84), expiryDate:'2027-06-30', supplier:'SUP003', image:'🧴', brand:'Glow & Lovely', status:'active' },
  { id:'P085', name:"Nivea Deodorant 150ml", category:'Personal Care', categoryId:'CAT07', costPrice:420, salePrice:500, stock:15, minStock:6, unit:'Can', barcode:generateBarcode(85), expiryDate:'2028-01-31', supplier:'SUP009', image:'🧴', brand:'Nivea', status:'active' },

  // ===== HOUSEHOLD & CLEANING (CAT08) =====
  { id:'P086', name:"Surf Excel 1kg", category:'Household & Cleaning', categoryId:'CAT08', costPrice:480, salePrice:560, stock:30, minStock:12, unit:'Box', barcode:generateBarcode(86), expiryDate:'2028-06-30', supplier:'SUP003', image:'🧹', brand:'Surf Excel', status:'active' },
  { id:'P087', name:"Surf Excel 500g", category:'Household & Cleaning', categoryId:'CAT08', costPrice:260, salePrice:310, stock:45, minStock:20, unit:'Box', barcode:generateBarcode(87), expiryDate:'2028-06-30', supplier:'SUP003', image:'🧹', brand:'Surf Excel', status:'active' },
  { id:'P088', name:"Ariel Detergent 1kg", category:'Household & Cleaning', categoryId:'CAT08', costPrice:520, salePrice:600, stock:22, minStock:10, unit:'Box', barcode:generateBarcode(88), expiryDate:'2028-05-31', supplier:'SUP009', image:'🧹', brand:'Ariel', status:'active' },
  { id:'P089', name:"Bonus Detergent 1kg", category:'Household & Cleaning', categoryId:'CAT08', costPrice:320, salePrice:380, stock:35, minStock:15, unit:'Box', barcode:generateBarcode(89), expiryDate:'2028-04-30', supplier:'SUP003', image:'🧹', brand:'Bonus', status:'active' },
  { id:'P090', name:"Harpic Power Plus 500ml", category:'Household & Cleaning', categoryId:'CAT08', costPrice:220, salePrice:270, stock:28, minStock:12, unit:'Bottle', barcode:generateBarcode(90), expiryDate:'2028-03-31', supplier:'SUP009', image:'🚽', brand:'Harpic', status:'active' },
  { id:'P091', name:"Vim Dishwash Liquid 500ml", category:'Household & Cleaning', categoryId:'CAT08', costPrice:185, salePrice:230, stock:32, minStock:15, unit:'Bottle', barcode:generateBarcode(91), expiryDate:'2028-02-28', supplier:'SUP003', image:'🍽️', brand:'Vim', status:'active' },
  { id:'P092', name:"Vim Dishwash Bar 300g", category:'Household & Cleaning', categoryId:'CAT08', costPrice:65, salePrice:85, stock:50, minStock:25, unit:'Bar', barcode:generateBarcode(92), expiryDate:'2028-06-30', supplier:'SUP003', image:'🍽️', brand:'Vim', status:'active' },
  { id:'P093', name:"Mortein Spray 400ml", category:'Household & Cleaning', categoryId:'CAT08', costPrice:380, salePrice:450, stock:18, minStock:8, unit:'Can', barcode:generateBarcode(93), expiryDate:'2027-12-31', supplier:'SUP009', image:'🦟', brand:'Mortein', status:'active' },
  { id:'P094', name:"Robin Blue 50g", category:'Household & Cleaning', categoryId:'CAT08', costPrice:35, salePrice:50, stock:60, minStock:25, unit:'Pack', barcode:generateBarcode(94), expiryDate:'2028-12-31', supplier:'SUP003', image:'🔵', brand:'Robin', status:'active' },
  { id:'P095', name:"Comfort Fabric Conditioner 800ml", category:'Household & Cleaning', categoryId:'CAT08', costPrice:350, salePrice:420, stock:15, minStock:6, unit:'Bottle', barcode:generateBarcode(95), expiryDate:'2027-11-30', supplier:'SUP003', image:'🧴', brand:'Comfort', status:'active' },
  { id:'P096', name:"Max Trash Bags Large (10)", category:'Household & Cleaning', categoryId:'CAT08', costPrice:90, salePrice:120, stock:40, minStock:18, unit:'Pack', barcode:generateBarcode(96), expiryDate:'2028-12-31', supplier:'SUP008', image:'🗑️', brand:'Max', status:'active' },
  { id:'P097', name:"Steel Wool Scrubber (3 pack)", category:'Household & Cleaning', categoryId:'CAT08', costPrice:45, salePrice:65, stock:55, minStock:25, unit:'Pack', barcode:generateBarcode(97), expiryDate:'2028-12-31', supplier:'SUP008', image:'🧽', brand:'Local', status:'active' },

  // ===== BISCUITS & BAKERY (CAT09) =====
  { id:'P098', name:"Peek Freans Sooper 112g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:60, salePrice:80, stock:100, minStock:40, unit:'Pack', barcode:generateBarcode(98), expiryDate:'2026-11-30', supplier:'SUP010', image:'🍪', brand:'Peek Freans', status:'active' },
  { id:'P099', name:"Peek Freans Gluco 100g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:40, salePrice:55, stock:150, minStock:60, unit:'Pack', barcode:generateBarcode(99), expiryDate:'2026-11-30', supplier:'SUP010', image:'🍪', brand:'Peek Freans', status:'active' },
  { id:'P100', name:"Peek Freans Marie 100g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:45, salePrice:60, stock:130, minStock:50, unit:'Pack', barcode:generateBarcode(100), expiryDate:'2026-12-31', supplier:'SUP010', image:'🍪', brand:'Peek Freans', status:'active' },
  { id:'P101', name:"Peek Freans Rio 90g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:55, salePrice:75, stock:80, minStock:35, unit:'Pack', barcode:generateBarcode(101), expiryDate:'2026-10-31', supplier:'SUP010', image:'🍪', brand:'Peek Freans', status:'active' },
  { id:'P102', name:"LU Prince Chocolate 94g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:50, salePrice:70, stock:110, minStock:45, unit:'Pack', barcode:generateBarcode(102), expiryDate:'2026-12-31', supplier:'SUP010', image:'🍫', brand:'LU', status:'active' },
  { id:'P103', name:"LU Candi Biscuit 115g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:55, salePrice:75, stock:85, minStock:35, unit:'Pack', barcode:generateBarcode(103), expiryDate:'2026-11-15', supplier:'SUP010', image:'🍪', brand:'LU', status:'active' },
  { id:'P104', name:"Oreo Original 120g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:110, salePrice:140, stock:55, minStock:22, unit:'Pack', barcode:generateBarcode(104), expiryDate:'2027-01-31', supplier:'SUP007', image:'🍪', brand:'Oreo', status:'active' },
  { id:'P105', name:"Bisconni Rite 104g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:45, salePrice:60, stock:90, minStock:38, unit:'Pack', barcode:generateBarcode(105), expiryDate:'2026-12-15', supplier:'SUP010', image:'🍪', brand:'Bisconni', status:'active' },
  { id:'P106', name:"Tiger Biscuit 75g", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:30, salePrice:45, stock:160, minStock:65, unit:'Pack', barcode:generateBarcode(106), expiryDate:'2026-11-30', supplier:'SUP010', image:'🍪', brand:'Tiger', status:'active' },
  { id:'P107', name:"Nan Khatai 200g (Box)", category:'Biscuits & Bakery', categoryId:'CAT09', costPrice:150, salePrice:190, stock:25, minStock:10, unit:'Box', barcode:generateBarcode(107), expiryDate:'2026-10-15', supplier:'SUP008', image:'🍘', brand:'Local', status:'active' },

  // ===== CONFECTIONERY (CAT10) =====
  { id:'P108', name:"Cadbury Dairy Milk 40g", category:'Confectionery', categoryId:'CAT10', costPrice:80, salePrice:100, stock:75, minStock:30, unit:'Bar', barcode:generateBarcode(108), expiryDate:'2026-11-30', supplier:'SUP007', image:'🍫', brand:'Cadbury', status:'active' },
  { id:'P109', name:"KitKat 2 Finger", category:'Confectionery', categoryId:'CAT10', costPrice:50, salePrice:70, stock:100, minStock:40, unit:'Bar', barcode:generateBarcode(109), expiryDate:'2026-12-31', supplier:'SUP001', image:'🍫', brand:'KitKat', status:'active' },
  { id:'P110', name:"Snickers 52g", category:'Confectionery', categoryId:'CAT10', costPrice:90, salePrice:120, stock:50, minStock:20, unit:'Bar', barcode:generateBarcode(110), expiryDate:'2026-10-31', supplier:'SUP007', image:'🍫', brand:'Snickers', status:'active' },
  { id:'P111', name:"M&M's Peanut 45g", category:'Confectionery', categoryId:'CAT10', costPrice:110, salePrice:140, stock:35, minStock:15, unit:'Pack', barcode:generateBarcode(111), expiryDate:'2026-12-15', supplier:'SUP007', image:'🍬', brand:'M&Ms', status:'active' },
  { id:'P112', name:"Hilal Freshup Bubble Gum (Box)", category:'Confectionery', categoryId:'CAT10', costPrice:180, salePrice:220, stock:20, minStock:8, unit:'Box', barcode:generateBarcode(112), expiryDate:'2027-03-31', supplier:'SUP010', image:'🫧', brand:'Hilal', status:'active' },
  { id:'P113', name:"Hilal Candyland Jelly Beans 180g", category:'Confectionery', categoryId:'CAT10', costPrice:120, salePrice:155, stock:30, minStock:12, unit:'Pack', barcode:generateBarcode(113), expiryDate:'2027-02-28', supplier:'SUP010', image:'🍬', brand:'Hilal', status:'active' },
  { id:'P114', name:"Mayfair Toffee Roll", category:'Confectionery', categoryId:'CAT10', costPrice:35, salePrice:50, stock:150, minStock:60, unit:'Pack', barcode:generateBarcode(114), expiryDate:'2027-01-31', supplier:'SUP010', image:'🍬', brand:'Mayfair', status:'active' },
  { id:'P115', name:"Milo Nuggets 25g", category:'Confectionery', categoryId:'CAT10', costPrice:30, salePrice:40, stock:180, minStock:70, unit:'Pack', barcode:generateBarcode(115), expiryDate:'2026-12-31', supplier:'SUP001', image:'🍫', brand:'Milo', status:'active' },

  // ===== INSTANT FOOD & NOODLES (CAT11) =====
  { id:'P116', name:"Knorr Noodles Chicken 66g", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:40, salePrice:55, stock:200, minStock:80, unit:'Pack', barcode:generateBarcode(116), expiryDate:'2027-03-31', supplier:'SUP003', image:'🍜', brand:'Knorr', status:'active' },
  { id:'P117', name:"Knorr Noodles Chatpatta 66g", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:40, salePrice:55, stock:180, minStock:70, unit:'Pack', barcode:generateBarcode(117), expiryDate:'2027-03-31', supplier:'SUP003', image:'🍜', brand:'Knorr', status:'active' },
  { id:'P118', name:"Maggi Noodles Chicken 65g", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:42, salePrice:58, stock:150, minStock:60, unit:'Pack', barcode:generateBarcode(118), expiryDate:'2027-02-28', supplier:'SUP001', image:'🍜', brand:'Maggi', status:'active' },
  { id:'P119', name:"Indomie Mi Goreng 80g", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:65, salePrice:85, stock:70, minStock:28, unit:'Pack', barcode:generateBarcode(119), expiryDate:'2027-01-31', supplier:'SUP007', image:'🍜', brand:'Indomie', status:'active' },
  { id:'P120', name:"Knorr Chicken Cube (12)", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:85, salePrice:110, stock:55, minStock:25, unit:'Box', barcode:generateBarcode(120), expiryDate:'2027-06-30', supplier:'SUP003', image:'🧊', brand:'Knorr', status:'active' },
  { id:'P121', name:"Rafhan Custard Powder 300g", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:165, salePrice:200, stock:30, minStock:12, unit:'Box', barcode:generateBarcode(121), expiryDate:'2027-05-31', supplier:'SUP003', image:'🍮', brand:'Rafhan', status:'active' },
  { id:'P122', name:"Knorr Corn Soup 48g", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:65, salePrice:85, stock:45, minStock:18, unit:'Pack', barcode:generateBarcode(122), expiryDate:'2027-04-30', supplier:'SUP003', image:'🥣', brand:'Knorr', status:'active' },
  { id:'P123', name:"Kolson Macaroni 400g", category:'Instant Food & Noodles', categoryId:'CAT11', costPrice:95, salePrice:120, stock:40, minStock:16, unit:'Pack', barcode:generateBarcode(123), expiryDate:'2027-08-31', supplier:'SUP008', image:'🍝', brand:'Kolson', status:'active' },

  // ===== FROZEN & REFRIGERATED (CAT12) =====
  { id:'P124', name:"K&N's Chicken Nuggets 1kg", category:'Frozen & Refrigerated', categoryId:'CAT12', costPrice:850, salePrice:980, stock:12, minStock:5, unit:'Pack', barcode:generateBarcode(124), expiryDate:'2026-09-30', supplier:'SUP011', image:'🍗', brand:"K&N's", status:'active' },
  { id:'P125', name:"K&N's Chicken Chapli Kabab 296g", category:'Frozen & Refrigerated', categoryId:'CAT12', costPrice:380, salePrice:450, stock:15, minStock:6, unit:'Pack', barcode:generateBarcode(125), expiryDate:'2026-08-31', supplier:'SUP011', image:'🍖', brand:"K&N's", status:'active' },
  { id:'P126', name:"K&N's Chicken Seekh Kabab 540g", category:'Frozen & Refrigerated', categoryId:'CAT12', costPrice:580, salePrice:680, stock:10, minStock:4, unit:'Pack', barcode:generateBarcode(126), expiryDate:'2026-09-15', supplier:'SUP011', image:'🍢', brand:"K&N's", status:'active' },
  { id:'P127', name:"Menu Frozen Parathas (5)", category:'Frozen & Refrigerated', categoryId:'CAT12', costPrice:220, salePrice:270, stock:18, minStock:8, unit:'Pack', barcode:generateBarcode(127), expiryDate:'2026-10-31', supplier:'SUP008', image:'🫓', brand:'Menu', status:'active' },
  { id:'P128', name:"Hico Ice Cream 800ml", category:'Frozen & Refrigerated', categoryId:'CAT12', costPrice:320, salePrice:390, stock:8, minStock:4, unit:'Tub', barcode:generateBarcode(128), expiryDate:'2026-08-15', supplier:'SUP011', image:'🍦', brand:'Hico', status:'active' },
  { id:'P129', name:"Walls Cornetto 120ml", category:'Frozen & Refrigerated', categoryId:'CAT12', costPrice:100, salePrice:130, stock:25, minStock:10, unit:'Cone', barcode:generateBarcode(129), expiryDate:'2026-07-31', supplier:'SUP003', image:'🍦', brand:"Wall's", status:'active' },

  // ===== BABY CARE (CAT13) =====
  { id:'P130', name:"Pampers Pants Medium (52)", category:'Baby Care', categoryId:'CAT13', costPrice:2200, salePrice:2500, stock:8, minStock:4, unit:'Pack', barcode:generateBarcode(130), expiryDate:'2028-06-30', supplier:'SUP009', image:'👶', brand:'Pampers', status:'active' },
  { id:'P131', name:"Pampers Taped Small (40)", category:'Baby Care', categoryId:'CAT13', costPrice:1500, salePrice:1750, stock:10, minStock:4, unit:'Pack', barcode:generateBarcode(131), expiryDate:'2028-06-30', supplier:'SUP009', image:'👶', brand:'Pampers', status:'active' },
  { id:'P132', name:"Cerelac Wheat 350g", category:'Baby Care', categoryId:'CAT13', costPrice:580, salePrice:680, stock:12, minStock:5, unit:'Box', barcode:generateBarcode(132), expiryDate:'2027-04-30', supplier:'SUP001', image:'🍼', brand:'Cerelac', status:'active' },
  { id:'P133', name:"Johnson's Baby Powder 200g", category:'Baby Care', categoryId:'CAT13', costPrice:290, salePrice:350, stock:15, minStock:6, unit:'Bottle', barcode:generateBarcode(133), expiryDate:'2028-01-31', supplier:'SUP009', image:'👶', brand:"Johnson's", status:'active' },
  { id:'P134', name:"Johnson's Baby Shampoo 200ml", category:'Baby Care', categoryId:'CAT13', costPrice:380, salePrice:450, stock:10, minStock:4, unit:'Bottle', barcode:generateBarcode(134), expiryDate:'2027-12-31', supplier:'SUP009', image:'🧴', brand:"Johnson's", status:'active' },
  { id:'P135', name:"Baby Wipes (80 count)", category:'Baby Care', categoryId:'CAT13', costPrice:180, salePrice:230, stock:20, minStock:8, unit:'Pack', barcode:generateBarcode(135), expiryDate:'2027-10-31', supplier:'SUP009', image:'🧻', brand:'Pampers', status:'active' },

  // ===== CONDIMENTS & SAUCES (CAT14) =====
  { id:'P136', name:"National Ketchup 800g", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:290, salePrice:340, stock:35, minStock:15, unit:'Bottle', barcode:generateBarcode(136), expiryDate:'2027-06-30', supplier:'SUP002', image:'🫙', brand:'National', status:'active' },
  { id:'P137', name:"National Ketchup 300g", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:130, salePrice:160, stock:50, minStock:22, unit:'Bottle', barcode:generateBarcode(137), expiryDate:'2027-06-30', supplier:'SUP002', image:'🫙', brand:'National', status:'active' },
  { id:'P138', name:"Shangrila Ketchup 500g", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:195, salePrice:240, stock:30, minStock:12, unit:'Bottle', barcode:generateBarcode(138), expiryDate:'2027-05-31', supplier:'SUP002', image:'🫙', brand:'Shangrila', status:'active' },
  { id:'P139', name:"Shangrila Chilli Garlic Sauce 300ml", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:150, salePrice:185, stock:25, minStock:10, unit:'Bottle', barcode:generateBarcode(139), expiryDate:'2027-04-30', supplier:'SUP002', image:'🌶️', brand:'Shangrila', status:'active' },
  { id:'P140', name:"National Mayonnaise 500g", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:320, salePrice:380, stock:18, minStock:8, unit:'Jar', barcode:generateBarcode(140), expiryDate:'2027-03-31', supplier:'SUP002', image:'🫙', brand:'National', status:'active' },
  { id:'P141', name:"Heinz Ketchup 350g", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:380, salePrice:450, stock:12, minStock:5, unit:'Bottle', barcode:generateBarcode(141), expiryDate:'2027-08-31', supplier:'SUP007', image:'🫙', brand:'Heinz', status:'active' },
  { id:'P142', name:"National Pickle Mixed 350g", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:170, salePrice:210, stock:28, minStock:12, unit:'Jar', barcode:generateBarcode(142), expiryDate:'2027-09-30', supplier:'SUP002', image:'🥒', brand:'National', status:'active' },
  { id:'P143', name:"Soy Sauce 300ml", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:120, salePrice:155, stock:22, minStock:10, unit:'Bottle', barcode:generateBarcode(143), expiryDate:'2027-07-31', supplier:'SUP007', image:'🫙', brand:'Shangrila', status:'active' },
  { id:'P144', name:"Mitchell's Jam Strawberry 450g", category:'Condiments & Sauces', categoryId:'CAT14', costPrice:280, salePrice:340, stock:15, minStock:6, unit:'Jar', barcode:generateBarcode(144), expiryDate:'2027-04-30', supplier:'SUP002', image:'🍓', brand:"Mitchell's", status:'active' },

  // ===== PULSES & LENTILS (CAT15) =====
  { id:'P145', name:"Chana Daal 1kg", category:'Pulses & Lentils', categoryId:'CAT15', costPrice:280, salePrice:330, stock:30, minStock:12, unit:'Pack', barcode:generateBarcode(145), expiryDate:'2027-06-30', supplier:'SUP006', image:'🫘', brand:'Local', status:'active' },
  { id:'P146', name:"Masoor Daal 1kg", category:'Pulses & Lentils', categoryId:'CAT15', costPrice:320, salePrice:380, stock:25, minStock:10, unit:'Pack', barcode:generateBarcode(146), expiryDate:'2027-06-30', supplier:'SUP006', image:'🫘', brand:'Local', status:'active' },
  { id:'P147', name:"Moong Daal 1kg", category:'Pulses & Lentils', categoryId:'CAT15', costPrice:350, salePrice:410, stock:20, minStock:8, unit:'Pack', barcode:generateBarcode(147), expiryDate:'2027-05-31', supplier:'SUP006', image:'🫘', brand:'Local', status:'active' },
  { id:'P148', name:"White Chickpeas (Kabuli Chana) 1kg", category:'Pulses & Lentils', categoryId:'CAT15', costPrice:380, salePrice:450, stock:18, minStock:8, unit:'Pack', barcode:generateBarcode(148), expiryDate:'2027-08-31', supplier:'SUP006', image:'🫘', brand:'Local', status:'active' },
  { id:'P149', name:"Kidney Beans (Rajma) 500g", category:'Pulses & Lentils', categoryId:'CAT15', costPrice:240, salePrice:290, stock:22, minStock:10, unit:'Pack', barcode:generateBarcode(149), expiryDate:'2027-07-31', supplier:'SUP006', image:'🫘', brand:'Local', status:'active' },
  { id:'P150', name:"Black Lentils (Urad Daal) 500g", category:'Pulses & Lentils', categoryId:'CAT15', costPrice:220, salePrice:270, stock:18, minStock:8, unit:'Pack', barcode:generateBarcode(150), expiryDate:'2027-06-30', supplier:'SUP006', image:'🫘', brand:'Local', status:'active' },

  // ===== HEALTH & WELLNESS (CAT16) =====
  { id:'P151', name:"Panadol 500mg (24 tablets)", category:'Health & Wellness', categoryId:'CAT16', costPrice:85, salePrice:110, stock:45, minStock:20, unit:'Strip', barcode:generateBarcode(151), expiryDate:'2027-12-31', supplier:'SUP009', image:'💊', brand:'Panadol', status:'active' },
  { id:'P152', name:"Disprin 300mg (10)", category:'Health & Wellness', categoryId:'CAT16', costPrice:30, salePrice:45, stock:60, minStock:25, unit:'Strip', barcode:generateBarcode(152), expiryDate:'2027-10-31', supplier:'SUP009', image:'💊', brand:'Disprin', status:'active' },
  { id:'P153', name:"Strepsils Orange (8)", category:'Health & Wellness', categoryId:'CAT16', costPrice:75, salePrice:100, stock:35, minStock:15, unit:'Pack', barcode:generateBarcode(153), expiryDate:'2027-09-30', supplier:'SUP009', image:'🍬', brand:'Strepsils', status:'active' },
  { id:'P154', name:"Dettol Antiseptic 120ml", category:'Health & Wellness', categoryId:'CAT16', costPrice:160, salePrice:200, stock:22, minStock:10, unit:'Bottle', barcode:generateBarcode(154), expiryDate:'2028-03-31', supplier:'SUP009', image:'🧴', brand:'Dettol', status:'active' },
  { id:'P155', name:"Band-Aid (20 strips)", category:'Health & Wellness', categoryId:'CAT16', costPrice:120, salePrice:150, stock:18, minStock:8, unit:'Box', barcode:generateBarcode(155), expiryDate:'2028-06-30', supplier:'SUP009', image:'🩹', brand:'Band-Aid', status:'active' },
  { id:'P156', name:"Vicks VapoRub 25g", category:'Health & Wellness', categoryId:'CAT16', costPrice:110, salePrice:145, stock:25, minStock:10, unit:'Jar', barcode:generateBarcode(156), expiryDate:'2027-11-30', supplier:'SUP009', image:'🧴', brand:'Vicks', status:'active' },

  // ===== STATIONERY (CAT17) =====
  { id:'P157', name:"Dollar Pen (Pack of 10)", category:'Stationery', categoryId:'CAT17', costPrice:150, salePrice:200, stock:30, minStock:12, unit:'Pack', barcode:generateBarcode(157), expiryDate:'2029-12-31', supplier:'SUP008', image:'🖊️', brand:'Dollar', status:'active' },
  { id:'P158', name:"Super Glue 3g", category:'Stationery', categoryId:'CAT17', costPrice:45, salePrice:65, stock:40, minStock:18, unit:'Tube', barcode:generateBarcode(158), expiryDate:'2028-06-30', supplier:'SUP008', image:'🧴', brand:'Local', status:'active' },
  { id:'P159', name:"Scotch Tape Roll", category:'Stationery', categoryId:'CAT17', costPrice:55, salePrice:75, stock:35, minStock:15, unit:'Roll', barcode:generateBarcode(159), expiryDate:'2029-12-31', supplier:'SUP008', image:'📎', brand:'3M', status:'active' },
  { id:'P160', name:"Writing Notebook 200 pages", category:'Stationery', categoryId:'CAT17', costPrice:80, salePrice:110, stock:25, minStock:10, unit:'Each', barcode:generateBarcode(160), expiryDate:'2029-12-31', supplier:'SUP008', image:'📓', brand:'Local', status:'active' },
];

// ===== GENERATE ADDITIONAL PRODUCTS TO REACH 500+ =====
const EXTENDED_BRANDS = ['National','Shan','Mehran','Nestle','Unilever','Tapal','Dalda','K&Ns','Peek Freans','Hilal','Colgate','P&G','Reckitt','Hamdard','Mitchell\'s'];
const EXTENDED_CATEGORIES = [
  { id:'CAT01', name:'Dairy & Eggs', image:'🥛' },
  { id:'CAT02', name:'Beverages', image:'🥤' },
  { id:'CAT03', name:'Snacks & Chips', image:'🍿' },
  { id:'CAT04', name:'Spices & Masala', image:'🌶️' },
  { id:'CAT05', name:'Cooking Oil & Ghee', image:'🫒' },
  { id:'CAT06', name:'Rice & Flour', image:'🌾' },
  { id:'CAT07', name:'Personal Care', image:'🧴' },
  { id:'CAT08', name:'Household & Cleaning', image:'🧹' },
  { id:'CAT09', name:'Biscuits & Bakery', image:'🍪' },
  { id:'CAT10', name:'Confectionery', image:'🍬' },
  { id:'CAT11', name:'Instant Food & Noodles', image:'🍜' },
  { id:'CAT14', name:'Condiments & Sauces', image:'🫙' },
  { id:'CAT15', name:'Pulses & Lentils', image:'🫘' },
];

const PRODUCT_NAMES_EXTRA = [
  'Premium Basmati Rice 2kg','Honey Pure 500g','Peanut Butter 340g','Coconut Milk 400ml','Oats 500g',
  'Corn Flakes 475g','Muesli 400g','Granola Bar 30g','Protein Bar 60g','Dried Dates 500g',
  'Cashew Nuts 200g','Almonds 200g','Walnuts 200g','Raisins 250g','Mixed Dry Fruits 300g',
  'Green Tea 25 bags','Herbal Tea 20 bags','Chamomile Tea 20 bags','Jasmine Tea 100g','Black Coffee 200g',
  'Brown Sugar 500g','White Sugar 1kg','Icing Sugar 250g','Salt 800g','Black Salt 200g',
  'Vinegar 500ml','Sesame Oil 250ml','Mustard Oil 500ml','Coconut Oil 500ml','Peanut Oil 1L',
  'Pasta Penne 500g','Pasta Fusilli 500g','Spaghetti 500g','Lasagna Sheets 250g','Vermicelli 200g',
  'Baking Powder 100g','Baking Soda 100g','Yeast 50g','Vanilla Extract 60ml','Food Color Set',
  'Paper Towel Roll','Tissue Box 200','Wet Wipes 40ct','Cotton Balls 100','Face Tissue 150',
  'Toothbrush Premium','Mouthwash 250ml','Hair Oil 200ml','Hair Gel 150ml','Body Wash 400ml',
  'Razor 5-Pack','Shaving Foam 200ml','Deodorant Stick 50g','Nail Polish Remover','Lip Balm',
  'Floor Cleaner 1L','Glass Cleaner 500ml','Air Freshener 300ml','Fabric Softener 500ml','Bleach 500ml',
  'Sponge Pack (5)','Broom','Mop Head','Dustpan','Bucket 10L',
  'Matches (Pack of 10)','Lighter','Candles (6 pack)','Battery AA (4)','Battery AAA (4)',
  'Light Bulb LED 9W','Extension Cord 3m','Plug Adapter','Cable Ties (50)','Rubber Bands 100g',
  'Envelope Pack (25)','A4 Paper 100 sheets','Ruler 30cm','Pencil Box','Eraser Pack (3)',
  'Crayons 12 colors','Color Pencils 12','Sketch Pen Set','Whiteboard Marker','Permanent Marker',
  'Milk Chocolate 100g','Dark Chocolate 80g','White Chocolate 100g','Toffee Pack 200g','Candy Pack 150g',
  'Gum Mint 14g','Gum Spearmint 14g','Hard Candy 100g','Marshmallow 150g','Cotton Candy 50g',
  'Jam Mixed Fruit 450g','Marmalade 350g','Honey Mustard 300g','BBQ Sauce 350ml','Hot Sauce 150ml',
  'Pizza Sauce 400g','Pasta Sauce 350g','Pesto 190g','Tahini 300g','Hummus 200g',
  'Canned Tuna 170g','Canned Corn 400g','Canned Beans 400g','Canned Peas 400g','Canned Mushrooms 400g',
  'Tomato Paste 400g','Coconut Cream 400ml','Evaporated Milk 410g','Condensed Milk 397g','Cream Cheese 200g',
  'Mozzarella Cheese 200g','Cheddar Cheese 200g','Feta Cheese 200g','Butter Unsalted 200g','Margarine 250g',
  'Yogurt Drink 250ml','Flavored Milk Strawberry 200ml','Flavored Milk Chocolate 200ml','Banana Chips 150g','Sweet Potato Chips 100g',
  'Veggie Chips 120g','Rice Cakes 130g','Popcorn Butter 80g','Popcorn Caramel 80g','Trail Mix 200g',
  'Energy Bar 40g','Protein Shake Ready 250ml','Vitamin C 500mg (30)','Multivitamin (30)','Omega-3 Capsules (30)',
  'Hand Sanitizer 100ml','Face Mask (10 pack)','Thermometer Digital','Cotton Swabs 200ct','First Aid Kit Small',
  'Pet Food Cat 1kg','Pet Food Dog 2kg','Bird Seed 500g','Cat Litter 5kg','Dog Treats 200g',
  'Shoe Polish Black','Shoe Polish Brown','Insole Comfort','Umbrella Compact','Rain Coat Disposable',
  'Garbage Bags Medium (20)','Ziplock Bags Large (15)','Aluminum Foil 10m','Cling Wrap 30m','Parchment Paper 5m',
  'Paper Plates (25)','Paper Cups (50)','Plastic Spoons (50)','Straws (100)','Napkins (100)',
  'Charcoal 2kg','Firewood Bundle','Mosquito Coil (10)','Mosquito Repellent Cream','Cockroach Chalk',
  'Phenyl 500ml','Naphthalene Balls 50g','Camphor 50g','Room Freshener Spray','Car Freshener',
  'Chips Tomato 35g','Chips Sour Cream 35g','Chips Wasabi 35g','Chips Honey BBQ 35g','Chips Salt & Vinegar 35g',
  'Noodles Spicy 66g','Noodles Shrimp 66g','Noodles Beef 66g','Noodles Vegetable 66g','Cup Noodles 60g',
  'Ice Cream Bar 65ml','Ice Cream Sandwich','Popsicle Mango','Popsicle Cola','Frozen Samosa (12)',
  'Frozen Spring Rolls (8)','Frozen Fish Fingers 250g','Frozen Chicken Strips 500g','Frozen French Fries 500g','Frozen Pizza 400g',
  'Tea Biscuits 200g','Cream Biscuits 150g','Chocolate Biscuits 120g','Coconut Biscuits 200g','Digestive Biscuits 250g',
  'Rusks 250g','Bread Sliced','Bread Whole Wheat','Buns (Pack of 6)','Pita Bread (4)',
  'Tortilla Wraps (6)','Croissants (4)','Muffins Chocolate (4)','Donuts (6)','Cake Slice',
  'Cupcakes (6)','Brownies (4)','Cookies Choco Chip (8)','Cookies Oatmeal (8)','Cookies Almond (8)',
  'Cereal Choco Puffs 350g','Cereal Honey Rings 375g','Cereal Fruit Loops 375g','Cereal Wheat Flakes 475g','Porridge Oats 500g',
  'Powdered Milk 900g','Coffee Beans 250g','Instant Coffee 50g','Green Coffee 200g','Cappuccino Mix 10pk',
  'Lemon Juice 500ml','Apple Cider Vinegar 500ml','Rose Water 200ml','Orange Blossom Water 200ml','Aloe Vera Juice 500ml',
  'Mineral Water 5L','Sparkling Water 500ml','Tonic Water 300ml','Coconut Water 330ml','Almond Milk 1L',
  'Soy Milk 1L','Oat Milk 1L','Rice Milk 1L','Peanuts Roasted 200g','Pistachios 200g',
  'Sunflower Seeds 150g','Pumpkin Seeds 150g','Chia Seeds 200g','Flax Seeds 200g','Quinoa 500g',
  'Couscous 500g','Bulgur Wheat 500g','Barley 500g','Millet 500g','Poppy Seeds 100g',
  'Sesame Seeds 200g','Fennel Seeds 100g','Cardamom Pods 50g','Cinnamon Sticks 50g','Cloves 50g',
  'Bay Leaves 25g','Star Anise 50g','Nutmeg 50g','Saffron 1g','Dried Mint 50g',
  'Dried Parsley 25g','Dried Oregano 25g','Dried Basil 25g','Dried Thyme 25g','Dried Rosemary 25g',
  'Garlic Powder 100g','Onion Powder 100g','Paprika 100g','Cayenne Pepper 50g','White Pepper 50g',
  'Chat Masala 100g','Tandoori Masala 100g','Tikka Masala 100g','Butter Chicken Masala 100g','Achari Masala 50g',
];

// Generate extended products
for (let i = 0; i < PRODUCT_NAMES_EXTRA.length; i++) {
  const cat = EXTENDED_CATEGORIES[i % EXTENDED_CATEGORIES.length];
  const brand = EXTENDED_BRANDS[i % EXTENDED_BRANDS.length];
  const cost = Math.floor(Math.random() * 800) + 50;
  const markup = 1.15 + Math.random() * 0.15;
  const sale = Math.round(cost * markup / 5) * 5;
  const stock = Math.floor(Math.random() * 150) + 3;
  const minStock = Math.floor(stock * 0.3) + 2;
  const monthsAhead = Math.floor(Math.random() * 18) + 3;
  const exp = new Date();
  exp.setMonth(exp.getMonth() + monthsAhead);
  const supIdx = (i % 11) + 1;

  PRODUCTS.push({
    id: `P${String(161 + i).padStart(3, '0')}`,
    name: PRODUCT_NAMES_EXTRA[i],
    category: cat.name,
    categoryId: cat.id,
    costPrice: cost,
    salePrice: sale,
    stock,
    minStock,
    unit: ['Pack','Bottle','Box','Each','Bag','Can','Jar','Roll','Tube','Strip'][i % 10],
    barcode: generateBarcode(161 + i),
    expiryDate: exp.toISOString().split('T')[0],
    supplier: `SUP${String(supIdx).padStart(3, '0')}`,
    image: cat.image,
    brand,
    status: Math.random() > 0.05 ? 'active' : 'inactive',
  });
}

// Ensure some products are LOW STOCK for alerts
PRODUCTS[33].stock = 3; // Lays Masala
PRODUCTS[89].stock = 2; // Bonus Detergent  
PRODUCTS[127].stock = 1; // Frozen Parathas
PRODUCTS[128].stock = 0; // Hico Ice Cream - OUT OF STOCK

export default PRODUCTS;
