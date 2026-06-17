import { BrowserRouter as Router } from "react-router-dom";
//فعال کردن قابلیت تغییر صحفه بدون ریفرش مروگر
import AppLayout from "./layouts/AppLayout";
// وارد کردن قالب اصلی برنامه ( مثل هیدر فوتر و نمایش صفحات)
function App() {
  // فقط مسیر هارا اندازه گیری میکنه
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
// خروجی برنامه آماده رندر شدن.
