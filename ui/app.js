const RULES = Object.freeze({
    festivalRate: 0.10,
    memberRate: 0.05,
    memberCap: 100,
    convenienceFee: 20,
    gstRate: 0.18
});
const API_URL = 'http://localhost:8081/api/calculate';

const currency = amount => `₹${amount.toFixed(2)}`;
const money = amount => Math.round((amount + Number.EPSILON) * 100) / 100;
const rows = [...document.querySelectorAll('.tier-row')];
const memberToggle = document.querySelector('#member-toggle');

function collectBooking() {
    let ticketCount = 0;
    let baseAmount = 0;
    const lineItems = [];
    let unavailableSelection = false;
    const form = new URLSearchParams();
    form.set('member', memberToggle.checked);

    rows.forEach(row => {
        const key = row.dataset.tier;
        const quantity = Math.max(0, Number(row.querySelector('.quantity-input').value) || 0);
        const price = Math.max(0, Number(row.querySelector('.price-input').value) || 0);
        const available = row.querySelector('.availability-input').checked;
        const tier = row.querySelector('.tier-name strong').textContent;
        form.set(`${key}Quantity`, quantity);
        form.set(`${key}Price`, price.toFixed(2));
        form.set(`${key}Available`, available);
        row.classList.toggle('sold-out', !available);
        ticketCount += quantity;
        if (quantity > 0 && !available) unavailableSelection = true;
        if (quantity > 0) {
            const amount = quantity * price;
            baseAmount += amount;
            lineItems.push({ tier, quantity, amount });
        }
    });

    return { form, ticketCount, baseAmount, lineItems, unavailableSelection };
}

function renderBill(values) {
    const { ticketCount, lineItems, unavailableSelection } = values;
    const festivalDiscount = values.festivalDiscount ?? money(values.baseAmount * RULES.festivalRate);
    const memberDiscount = values.memberDiscount ?? (memberToggle.checked ? Math.min(money((values.baseAmount - festivalDiscount) * RULES.memberRate), RULES.memberCap) : 0);
    const convenienceFee = values.convenienceFee ?? ticketCount * RULES.convenienceFee;
    const gst = values.gst ?? money((values.baseAmount - festivalDiscount - memberDiscount + convenienceFee) * RULES.gstRate);
    const finalTotal = values.finalAmount ?? money(values.baseAmount - festivalDiscount - memberDiscount + convenienceFee + gst);

    document.querySelector('#ticket-count').textContent = `${ticketCount} ticket${ticketCount === 1 ? '' : 's'}`;
    document.querySelector('#line-items').innerHTML = lineItems.map(item => `<div class="line-item"><span>${item.tier} × ${item.quantity}</span><span>${currency(item.amount)}</span></div>`).join('');
    document.querySelector('#bill-message').textContent = unavailableSelection ? 'Unavailable tier selected' : ticketCount ? 'Ready for review' : 'Add tickets to begin';
    document.querySelector('#base-amount').textContent = currency(values.baseAmount);
    document.querySelector('#festival-discount').textContent = `-${currency(festivalDiscount)}`;
    document.querySelector('#member-discount').textContent = `-${currency(memberDiscount)}`;
    document.querySelector('#convenience-fee').textContent = currency(convenienceFee);
    document.querySelector('#gst').textContent = currency(gst);
    document.querySelector('#final-total').textContent = unavailableSelection ? 'Unavailable' : currency(finalTotal);
}

let requestNumber = 0;
async function update() {
    const booking = collectBooking();
    const festivalDiscount = money(booking.baseAmount * RULES.festivalRate);
    const afterFestival = booking.baseAmount - festivalDiscount;
    const memberDiscount = memberToggle.checked ? Math.min(money(afterFestival * RULES.memberRate), RULES.memberCap) : 0;
    const convenienceFee = booking.ticketCount * RULES.convenienceFee;
    const gst = money((afterFestival - memberDiscount + convenienceFee) * RULES.gstRate);
    const finalAmount = money(afterFestival - memberDiscount + convenienceFee + gst);
    renderBill({ ...booking, festivalDiscount, memberDiscount, convenienceFee, gst, finalAmount });

    const currentRequest = ++requestNumber;
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: booking.form });
        if (!response.ok) throw new Error('API rejected booking');
        const serverBill = await response.json();
        if (currentRequest !== requestNumber) return;
        document.querySelector('#api-status').innerHTML = '<span class="status-dot"></span>API connected';
        renderBill({ ...booking, ...serverBill, lineItems: booking.lineItems });
    } catch (error) {
        document.querySelector('#api-status').innerHTML = '<span class="status-dot"></span>Local preview';
    }
}

document.querySelectorAll('input').forEach(input => input.addEventListener('input', update));
document.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', update));
document.querySelector('#clear-button').addEventListener('click', () => {
    rows.forEach(row => { row.querySelector('.quantity-input').value = 0; });
    memberToggle.checked = false;
    update();
});
update();
