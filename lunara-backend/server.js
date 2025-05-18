// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const ORDERS_FILE = './orders.json';

// 1) Cho phép CORS và parse JSON body
app.use(cors());
app.use(bodyParser.json());

// 2) Nếu chưa có file orders.json thì tạo mới, chứa mảng rỗng
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
}

// 3) Định nghĩa route nhận đơn hàng
app.post('/api/orders', (req, res) => {
  const order = req.body;

  // Kiểm tra dữ liệu đơn hàng
  if (!order.customer || !order.items || !order.items.length) {
    return res.status(400).json({ error: 'Dữ liệu đơn hàng không hợp lệ.' });
  }

  // Gán ID và thời gian tạo
  order.id = Date.now();
  order.createdAt = new Date().toISOString();

  // Đọc file orders.json, thêm đơn mới, rồi ghi lại
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

  // Trả về cho client biết mã đơn
  res.json({ orderId: order.id });
});

// 4) Route lấy danh sách đơn (dùng để test)
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  res.json(orders);
});

// 5) Khởi động server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
