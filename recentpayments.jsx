// In your RecentPaymentsTable.jsx component
import React, { useState } from 'react';
import MakePaymentForm from './MakePaymentForm';
import SchedulePaymentForm from './SchedulePaymentForm';
import PaymentPlanForm from './PaymentPlanForm';

function RecentPaymentsTable() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // When action is clicked
  const handleActionClick = (action, invoice) => {
    setSelectedInvoice(invoice);
    setActiveModal(action);
  };
  
  // Close modal
  const closeModal = () => {
    setActiveModal(null);
    setSelectedInvoice(null);
  };
  
  return (
    <>
      <table>
        {/* Your table headers */}
        <thead>...</thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.date}</td>
              <td>{payment.invoiceNumber}</td>
              <td>
                {/* Your action button - SIMPLIFIED VERSION */}
                <button 
                  onClick={() => handleActionClick('pay_now', payment)}
                  className="action-button"
                >
                  Actions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* MODALS - Add at the end of your component */}
      {activeModal === 'pay_now' && selectedInvoice && (
        <div className="modal-overlay">
          <MakePaymentForm 
            invoice={selectedInvoice} 
            onClose={closeModal} 
          />
        </div>
      )}
      
      {activeModal === 'schedule' && selectedInvoice && (
        <div className="modal-overlay">
          <SchedulePaymentForm 
            invoice={selectedInvoice} 
            onClose={closeModal} 
          />
        </div>
      )}
      
      {activeModal === 'payment_plan' && selectedInvoice && (
        <div className="modal-overlay">
          <PaymentPlanForm 
            invoice={selectedInvoice} 
            onClose={closeModal} 
          />
        </div>
      )}
    </>
  );
}
