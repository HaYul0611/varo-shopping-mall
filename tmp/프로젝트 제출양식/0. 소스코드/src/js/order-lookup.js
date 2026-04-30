document.addEventListener('DOMContentLoaded', () => {
  // 헤더/푸터 로드
  if (window.Components) {
    window.Components.init();
  }

  const form = document.getElementById('orderLookupForm');
  const resultBox = document.getElementById('lookupResult');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderNum = document.getElementById('orderNumber').value.trim();
      const orderPw = document.getElementById('orderPassword').value.trim();

      const orders = JSON.parse(localStorage.getItem('varo_orders') || '[]');
      const order = orders.find(o =>
        (o.orderNumber === orderNum || o.id == orderNum) &&
        o.guest_password === orderPw
      );

      if (order) {
        resultBox.style.display = 'block';
        document.getElementById('res-status').textContent = order.status || '주문완료';

        let prodName = '-';
        if (order.items && order.items.length > 0) {
          prodName = order.items[0].product_name || '주문 상품';
          if (order.items.length > 1) {
            prodName += ` 외 ${order.items.length - 1}건`;
          }
        } else if (order.product_name) {
          prodName = order.product_name;
        }

        document.getElementById('res-name').textContent = prodName;
        document.getElementById('res-amount').textContent = `${Number(order.finalAmount || order.totalAmount || 0).toLocaleString('ko-KR')}원`;

        const addr = order.shipping ? `${order.shipping.address} ${order.shipping.detail}` : '-';
        document.getElementById('res-address').textContent = addr;
      } else {
        alert('일치하는 주문 정보가 없습니다. 주문번호와 비밀번호를 다시 확인해주세요.');
        resultBox.style.display = 'none';
      }
    });
  }
});
