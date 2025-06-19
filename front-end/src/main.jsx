import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import i18n from './i18n.js';  // ตรวจสอบว่าไฟล์นี้ตั้งค่า i18n ถูกต้อง
import './styles.css';
import { BrowserRouter } from 'react-router-dom';

// สร้าง root element สำหรับการ render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
