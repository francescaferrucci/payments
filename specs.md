# Billing Dashboard Programming Specifications
*Last Updated: [Date] | Version: 1.0*

## 1. Database Schema Updates
[Previous content from sections 1-2]

## 2. Invoice Generation Logic
[Previous content]

## 3. Payments Page Dashboard (Frontend & Backend)

### A. Data Aggregation for Summary Cards
[Previous content]

### B. Fee Category Breakdown
[Previous content]

### C. Recent Payments Table - Enhanced Actions

#### Table Structure Update:
```html
<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Invoice #</th>
      <th>Member Name</th>
      <th>Fee Categories</th>
      <th>Amount</th>
      <th>Method</th>
      <th>Status</th>
      <th>Reference</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Row example -->
  </tbody>
</table>

// Example React component structure
const ActionDropdown = ({ invoiceId, currentStatus }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleAction = (actionType) => {
    setShowDropdown(false);
    openPaymentModal(actionType, invoiceId);
  };
  
  return (
    <div className="actions-dropdown">
      <button onClick={() => setShowDropdown(!showDropdown)}>
        Actions ▼
      </button>
      
      {showDropdown && (
        <div className="dropdown-menu">
          <button onClick={() => handleAction('pay_now')}>
            Pay Now
          </button>
          <button onClick={() => handleAction('schedule')}>
            Schedule Payment
          </button>
          <button onClick={() => handleAction('payment_plan')}>
            Payment Plan
          </button>
        </div>
      )}
    </div>
  );
};
const PaymentModal = ({ actionType, invoiceId, onClose }) => {
  // Fetch invoice details based on invoiceId
  
  const renderForm = () => {
    switch(actionType) {
      case 'pay_now':
        return <MakePaymentForm invoiceId={invoiceId} />;
      case 'schedule':
        return <SchedulePaymentForm invoiceId={invoiceId} />;
      case 'payment_plan':
        return <PaymentPlanForm invoiceId={invoiceId} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>
          {actionType === 'pay_now' && 'Make Payment'}
          {actionType === 'schedule' && 'Schedule Payment'}
          {actionType === 'payment_plan' && 'Set Up Payment Plan'}
        </h2>
        {renderForm()}
      </div>
    </div>
  );
};
const PaymentModal = ({ actionType, invoiceId, onClose }) => {
  // Fetch invoice details based on invoiceId
  
  const renderForm = () => {
    switch(actionType) {
      case 'pay_now':
        return <MakePaymentForm invoiceId={invoiceId} />;
      case 'schedule':
        return <SchedulePaymentForm invoiceId={invoiceId} />;
      case 'payment_plan':
        return <PaymentPlanForm invoiceId={invoiceId} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>
          {actionType === 'pay_now' && 'Make Payment'}
          {actionType === 'schedule' && 'Schedule Payment'}
          {actionType === 'payment_plan' && 'Set Up Payment Plan'}
        </h2>
        {renderForm()}
      </div>
    </div>
  );
};
// Components/MakePaymentForm.js
const MakePaymentForm = ({ invoiceId }) => {
  // Pre-fetch invoice amount, member details
  // Show payment method selector (Credit Card, Bank Transfer, etc.)
  // Show total amount due
  // Include "Pay Full Amount" and "Pay Partial Amount" options
  // Submit to: POST /api/payments/process-immediate
};
// Components/SchedulePaymentForm.js
const SchedulePaymentForm = ({ invoiceId }) => {
  // Date picker for future payment date
  // Payment method selection
  // Option to send reminder email
  // Submit to: POST /api/payments/schedule
};
// Components/PaymentPlanForm.js
const PaymentPlanForm = ({ invoiceId }) => {
  // Options: # of installments (2, 3, 6, 12)
  // Calculate installment amounts
  // Set start date and frequency (weekly, bi-weekly, monthly)
  // Down payment option
  // Submit to: POST /api/payments/create-plan
};
{
  "invoice_id": "INV-980654",
  "amount": 244.00,
  "payment_method": "credit_card",
  "card_token": "tok_xxx"
}
{
  "invoice_id": "INV-980654",
  "scheduled_date": "2024-01-30",
  "payment_method": "bank_transfer",
  "send_reminder": true
}
{
  "invoice_id": "INV-980654",
  "total_amount": 244.00,
  "installments": 3,
  "frequency": "monthly",
  "start_date": "2024-01-25",
  "down_payment": 50.00
}
ALTER TABLE payments ADD COLUMN scheduled_date DATE NULL;
ALTER TABLE payments ADD COLUMN is_scheduled BOOLEAN DEFAULT FALSE;
ALTER TABLE payments ADD COLUMN payment_plan_id INT NULL;
CREATE TABLE payment_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT REFERENCES invoices(id),
    total_amount DECIMAL(10, 2),
    installments INT,
    frequency ENUM('weekly', 'biweekly', 'monthly'),
    start_date DATE,
    down_payment DECIMAL(10, 2),
    status ENUM('active', 'completed', 'cancelled'),
    created_at TIMESTAMP
);
